import { BadRequest, isHttpError } from 'http-errors'

import { type FinancialResult } from '../financial.type'
import { type IDeleteFinancialRepository } from './repositories/delete-financial.interface'

export class DeleteFinancialService {
  constructor(private readonly deleteFinancialRepository: IDeleteFinancialRepository) {}

  async execute(FinancialUUID: string) {
    try {
      const hasFinancial: FinancialResult | undefined = await this.deleteFinancialRepository.getFinancial(FinancialUUID)

      if (!hasFinancial) {
        throw new BadRequest('Financial not found.')
      }

      await this.deleteFinancialRepository.deleteFinancial(hasFinancial)
    } catch (err) {
      if (isHttpError(err)) {
        throw new BadRequest(err.message)
      }

      console.error('DELETE_FINANCIAL_SERVICE_ERROR\n' + JSON.stringify(err, null, 2))
      console.error('DELETE_FINANCIAL_SERVICE_ERROR_MESSAGE\n' + JSON.stringify(err?.message, null, 2))

      throw new BadRequest('Something went wrong while deleting a financial.')
    }
  }
}
