import { MOVEMENT_TYPE, TRANSACTION_TYPE } from '@common/definitions/financial'
import { BadRequest, isHttpError } from 'http-errors'

import { AccountsResult } from '../../../common/definitions/account.type'
import { IUpdateAccountRepository } from './repositories/update-accounts.interface'
import { UpdateAccount } from './update-accounts.validator'

export class UpdateAccountService {
  constructor(private readonly updateAccountRepository: IUpdateAccountRepository) {}

  async execute(AccountUUID: string, updateAccountDto: UpdateAccount) {
    try {
      const hasAccount: AccountsResult | undefined = await this.updateAccountRepository.getAccount(AccountUUID)

      if (!hasAccount || updateAccountDto.currentBalance) {
        throw new BadRequest('Account not found.')
      }

      if (updateAccountDto.currentBalance) {
        await this.updateAccountRepository.createFinancial([
          {
            accountId: hasAccount.PK,
            category: 'financial.category',
            date: `${new Date()}`,
            financeSpot: hasAccount.SK.substring(8),
            value: updateAccountDto.currentBalance,
            discount: 0,
            typeTransaction: TRANSACTION_TYPE.TRANSACTIONS,
            movementTypes: MOVEMENT_TYPE.ENTRY
          }
        ])
      }

      await this.updateAccountRepository.updateAccount(hasAccount, updateAccountDto)
    } catch (err) {
      if (isHttpError(err)) {
        throw new BadRequest(err.message)
      }

      console.error('UPDATE_ACCOUNTS_SERVICE_ERROR\n' + JSON.stringify(err, null, 2))
      console.error('UPDATE_ACCOUNTS_SERVICE_ERROR_MESSAGE\n' + JSON.stringify(err?.message, null, 2))

      throw new BadRequest('Something went wrong while updating a accounts.')
    }
  }
}
