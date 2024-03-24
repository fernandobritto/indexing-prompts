import { CreateAccountsService } from '@functions/accounts/createAccounts/create-accounts.service'
import { type CreateAccountsRequestBody } from '@functions/accounts/createAccounts/create-accounts.validator'
import { type ICreateAccountsRepository } from '@functions/accounts/createAccounts/repository/create-account.interface'

import { createFakeAccounts, getFakeAccounts } from '../accounts.mock'

const CreateAccountsRepositoryMock = jest.fn<ICreateAccountsRepository, unknown[]>()

export const createAccountsStub = () => {
  const createAccountsRequestBody: CreateAccountsRequestBody = {
    createAccounts: [createFakeAccounts()]
  }
  const createAccountsDto = [createFakeAccounts()]
  const createAccountsRepository = new CreateAccountsRepositoryMock()
  const createAccountsService = new CreateAccountsService(createAccountsRepository)

  const fakeAccounts = getFakeAccounts()

  return Object.freeze({
    createAccountsRequestBody,
    createAccountsDto,
    createAccountsRepository,
    createAccountsService,
    fakeAccounts
  })
}
