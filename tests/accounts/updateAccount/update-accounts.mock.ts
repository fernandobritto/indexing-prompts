import { IUpdateAccountRepository } from '@functions/accounts/updateAccounts/repositories/update-accounts.interface'
import { UpdateAccountService } from '@functions/accounts/updateAccounts/update-accounts.service'

import { createFakeAccounts, getFakeAccounts, getFakeFinancial } from '../accounts.mock'

const UpdateAccountsRepositoryMock = jest.fn<IUpdateAccountRepository, unknown[]>()

export const updateAccountsStub = () => {
  const updateAccountsRepository = new UpdateAccountsRepositoryMock()
  const updateAccountsService = new UpdateAccountService(updateAccountsRepository)
  const fakeAccounts = getFakeAccounts()
  const fakeAccountsUpdate = createFakeAccounts()
  const fakeFinancial = getFakeFinancial()

  return Object.freeze({
    updateAccountsRepository,
    updateAccountsService,
    fakeAccounts,
    fakeAccountsUpdate,
    fakeFinancial
  })
}
