import { FinancialResult } from '@functions/transactionsFinancial/financial.type'
import { BadRequest, isHttpError } from 'http-errors'

import { FindCategoryQueryStringParameters } from './find-category-validation.validator'
import { IFindCategoryRepository } from './repositories/find-category-validation.interface'

export class FindCategoryService {
  constructor(private readonly findCategoryRepository: IFindCategoryRepository) {}

  async findCategory(findCategoryDto: FindCategoryQueryStringParameters, financeSpot: string) {
    return (await this.findCategoryRepository.findCategory(findCategoryDto, financeSpot)) as unknown as {
      Items: FinancialResult[]
      LastEvaluatedKey: Record<string, unknown> | undefined
    }
  }

  async execute(findCategoryDto: FindCategoryQueryStringParameters, financeSpot: string) {
    try {
      return await this.findCategory(findCategoryDto, financeSpot)
    } catch (err) {
      if (isHttpError(err)) {
        throw new BadRequest(err.message)
      }

      console.error('FIND_ACCOUNTS_SERVICE_ERROR\n' + JSON.stringify(err, null, 2))
      console.error('FIND_ACCOUNTS_SERVICE_ERROR_MESSAGE\n' + JSON.stringify(err?.message, null, 2))

      throw new BadRequest('Something went wrong while finding Category.')
    }
  }
}
