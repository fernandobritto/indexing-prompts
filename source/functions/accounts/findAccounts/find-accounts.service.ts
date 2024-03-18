import { FinancialResult } from '@functions/transactionsFinancial/financial.type'
import { BadRequest, isHttpError } from 'http-errors'

import { FindAccountsQueryStringParameters } from './find-accounts.validator'
import { IFindAccountsRepository } from './repositories/find-accounts.interface'

export class FindAccountsService {
  constructor(private readonly findAccountsRepository: IFindAccountsRepository) {}

  async findAccounts(findAccountsDto: FindAccountsQueryStringParameters, financeSpot: string) {
    return (await this.findAccountsRepository.findAccounts(findAccountsDto, financeSpot)) as unknown as {
      Items: FinancialResult[]
      LastEvaluatedKey: Record<string, unknown> | undefined
    }
  }

  async execute(findAccountsDto: FindAccountsQueryStringParameters, financeSpot: string) {
    try {
      return await this.findAccounts(findAccountsDto, financeSpot)
    } catch (err) {
      if (isHttpError(err)) {
        throw new BadRequest(err.message)
      }

      console.error('FIND_ACCOUNTS_SERVICE_ERROR\n' + JSON.stringify(err, null, 2))
      console.error('FIND_ACCOUNTS_SERVICE_ERROR_MESSAGE\n' + JSON.stringify(err?.message, null, 2))

      throw new BadRequest('Something went wrong while finding Accounts.')
    }
  }
}
