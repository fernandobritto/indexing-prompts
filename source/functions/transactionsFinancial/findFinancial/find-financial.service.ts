import { BadRequest, isHttpError } from 'http-errors'

import { type FinancialResult } from '../financial.type'
import { type FindFinancialQueryStringParameters } from './find-financial.validator'
import { type IFindFinancialRepository } from './repositories/find-financial.interface'

export class FindFinancialService {
  constructor(private readonly findFinancialRepository: IFindFinancialRepository) {}

  async findFinancial(findFinancialDto: FindFinancialQueryStringParameters, financeSpot: string) {
    return (await this.findFinancialRepository.findFinancial(findFinancialDto, financeSpot)) as unknown as {
      Items: FinancialResult[]
      LastEvaluatedKey: Record<string, unknown> | undefined
    }
  }

  async execute(findFinancialDto: FindFinancialQueryStringParameters, financeSpot: string) {
    try {
      return await this.findFinancial(findFinancialDto, financeSpot)
    } catch (err) {
      if (isHttpError(err)) {
        throw new BadRequest(err.message)
      }

      console.error('FIND_FINANCIAL_SERVICE_ERROR\n' + JSON.stringify(err, null, 2))
      console.error('FIND_FINANCIAL_SERVICE_ERROR_MESSAGE\n' + JSON.stringify(err?.message, null, 2))

      throw new BadRequest('Something went wrong while finding Financial.')
    }
  }
}
