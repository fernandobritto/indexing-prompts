import { type FindFinancialQueryStringParameters } from '../find-financial.validator'

export interface IFindFinancialRepository {
  findFinancial: (
    findFinancialDto: FindFinancialQueryStringParameters,
    financeSpot: string
  ) => Promise<{
    Items: Array<Record<string, unknown>> | undefined
    LastEvaluatedKey: Record<string, unknown> | undefined
  }>
}
