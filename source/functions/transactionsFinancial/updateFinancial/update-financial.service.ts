import { MOVEMENT_TYPE } from '@common/definitions/financial'
import { BadRequest, isHttpError } from 'http-errors'

import { type FinancialResult } from '../financial.type'
import { type IUpdateFinancialRepository } from './repositories/update-financial.interface'
import { type UpdateFinancial } from './update-financial.validator'

export class UpdateFinancialService {
  constructor(private readonly updateFinancialRepository: IUpdateFinancialRepository) {}

  async execute(FinancialUUID: string, updateFinancialDto: UpdateFinancial) {
    try {
      const hasFinancial: FinancialResult | undefined = await this.updateFinancialRepository.getFinancial(FinancialUUID)
      const date = new Date()

      if (updateFinancialDto.date && new Date(updateFinancialDto.date) > date) {
        throw new BadRequest('Recording a transaction is only permitted on the current day or in the past.')
      }

      if (!hasFinancial) {
        throw new BadRequest('Financial not found.')
      }

      if (hasFinancial.accountTransfer) {
        throw new BadRequest('It is not allowed to update transfers between accounts')
      }

      const hasAccount = await this.updateFinancialRepository.getAccount(hasFinancial.accountId)

      if (hasAccount && updateFinancialDto.value) {
        const currentUpdate =
          hasFinancial.movementTypes === MOVEMENT_TYPE.EXIT
            ? hasAccount.currentBalance + hasFinancial.value
            : hasAccount.currentBalance - hasFinancial.value
        await this.updateFinancialRepository.updateAccount(hasAccount, {
          currentBalance: currentUpdate
        })

        await this.updateFinancialRepository.updateAccount(hasAccount, {
          currentBalance:
            updateFinancialDto.movementTypes === MOVEMENT_TYPE.EXIT
              ? currentUpdate - updateFinancialDto.value
              : currentUpdate + hasFinancial.value
        })
      }

      await this.updateFinancialRepository.updateFinancial(hasFinancial, updateFinancialDto)
    } catch (err) {
      if (isHttpError(err)) {
        throw new BadRequest(err.message)
      }

      console.error('UPDATE_FINANCIAL_SERVICE_ERROR\n' + JSON.stringify(err, null, 2))
      console.error('UPDATE_FINANCIAL_SERVICE_ERROR_MESSAGE\n' + JSON.stringify(err?.message, null, 2))

      throw new BadRequest('Something went wrong while updating a financial.')
    }
  }
}
