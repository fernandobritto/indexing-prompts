import { type FindCategoryQueryStringParameters } from '../find-category-validation.validator'

export interface IFindCategoryRepository {
  findCategory: (
    findCategoryDto: FindCategoryQueryStringParameters,
    financeSpot: string
  ) => Promise<{
    Items: Array<Record<string, unknown>> | undefined
    LastEvaluatedKey: Record<string, unknown> | undefined
  }>
}
