import { FindAccountsService } from '@functions/accounts/findAccounts/find-accounts.service'
import { type IFindAccountsRepository } from '@functions/accounts/findAccounts/repositories/find-accounts.interface'

import { getFakeAccounts } from '../accounts.mock'

const FindAccountsRepositoryMock = jest.fn<IFindAccountsRepository, unknown[]>()

export const findAccountsStub = () => {
  const findAccountsRepository = new FindAccountsRepositoryMock()
  const findAccountsService = new FindAccountsService(findAccountsRepository)
  const fakeAccounts = getFakeAccounts()

  return Object.freeze({
    findAccountsRepository,
    findAccountsService,
    fakeAccounts
  })
}
