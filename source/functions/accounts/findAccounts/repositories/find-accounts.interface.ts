import { type FindAccountsQueryStringParameters } from '../find-accounts.validator'

export interface IFindAccountsRepository {
  findAccounts: (
    findAccountDto: FindAccountsQueryStringParameters,
    financeSpot: string
  ) => Promise<{
    Items: Array<Record<string, unknown>> | undefined
    LastEvaluatedKey: Record<string, unknown> | undefined
  }>
}
