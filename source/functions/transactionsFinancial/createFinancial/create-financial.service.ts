import { AccountsResult } from '@common/definitions/account.type'
import { MOVEMENT_TYPE } from '@common/definitions/financial'
import { BadRequest, isHttpError } from 'http-errors'

import { type CreateFinancial } from './create-financial.validator'
import { type ICreateFinancialRepository } from './repositories/create-financial.interface'

export class CreateFinancialService {
  constructor(private readonly createFinancialRepository: ICreateFinancialRepository) {}

  async execute(createFinancialDto: CreateFinancial[]) {
    try {
      const date = new Date()
      const invalidFinancial = createFinancialDto.filter((financial) => new Date(financial.date) > date)

      if (invalidFinancial.length > 0) {
        throw new BadRequest('Recording a transaction is only permitted on the current day or in the past.')
      }

      for (const financial of createFinancialDto) {
        const hasAccount = (await this.createFinancialRepository.getAccount(
          financial.accountId
        )) as unknown as AccountsResult

        if (!hasAccount) {
          throw new BadRequest('Account not found')
        }

        if (
          hasAccount.currentBalance &&
          hasAccount.currentBalance < financial.value &&
          financial.movementTypes === MOVEMENT_TYPE.EXIT
        ) {
          throw new BadRequest('Insufficient balance for the transaction.')
        }

        if (hasAccount.SK.substring(8) !== financial.financeSpot) {
          throw new BadRequest(`Franchise differing from the account `)
        }

        await this.createFinancialRepository.updateAccount(hasAccount, {
          currentBalance:
            financial.movementTypes === MOVEMENT_TYPE.EXIT
              ? hasAccount.currentBalance - financial.value
              : hasAccount.currentBalance + financial.value
        })

        if (financial.accountTransfer) {
          const hasAccountTransfer = (await this.createFinancialRepository.getAccount(
            financial.accountTransfer
          )) as unknown as AccountsResult

          if (!hasAccountTransfer) {
            throw new BadRequest('Account transfer not found')
          }

          await this.createFinancialRepository.updateAccount(hasAccountTransfer, {
            currentBalance: hasAccountTransfer.currentBalance + financial.value
          })

          await this.createFinancialRepository.createFinancial([
            {
              accountId: hasAccountTransfer.PK,
              category: financial.category,
              date: financial.date,
              accountTransfer: financial.accountId,
              financeSpot: hasAccountTransfer.SK.substring(8),
              movementTypes: MOVEMENT_TYPE.ENTRY,
              value: financial.value,
              discount: financial.discount,
              typeTransaction: financial.typeTransaction
            }
          ])
        }
      }

      await this.createFinancialRepository.createFinancial(createFinancialDto)
    } catch (err) {
      if (isHttpError(err)) {
        throw new BadRequest(err.message)
      }
      console.error('CREATE_FINANCIAL_SERVICE_ERROR\n' + JSON.stringify(err, null, 2))
      console.error('CREATE_FINANCIAL_SERVICE_ERROR_MESSAGE\n' + JSON.stringify(err?.message, null, 2))

      throw new BadRequest('Something went wrong while creating Financial.')
    }
  }
}
