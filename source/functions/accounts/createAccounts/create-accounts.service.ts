import { BadRequest, isHttpError } from 'http-errors'

import { CreateAccounts } from './create-accounts.validator'
import { ICreateAccountsRepository } from './repository/create-account.interface'

export class CreateAccountsService {
  constructor(private readonly createAccountsRepository: ICreateAccountsRepository) {}

  async execute(createAccountsDto: CreateAccounts[]) {
    try {
      await this.createAccountsRepository.createAccounts(createAccountsDto)
    } catch (err) {
      if (isHttpError(err)) {
        throw new BadRequest(err.message)
      }
      console.error('CREATE_ACCOUNT_SERVICE_ERROR\n' + JSON.stringify(err, null, 2))
      console.error('CREATE_ACCOUNT_SERVICE_ERROR_MESSAGE\n' + JSON.stringify(err?.message, null, 2))

      throw new BadRequest('Something went wrong while creating Accounts.')
    }
  }
}
