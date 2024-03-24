import { FindAccountsService } from '@functions/accounts/findAccounts/find-accounts.service'
import { BadRequest } from 'http-errors'

import { findAccountsStub } from './find-accounts.mock'

describe('FindAccount Service Unit tests', () => {
  let findAccountsRepository
  let findAccountsService
  let fakeAccount

  beforeEach(() => {
    const stubs = findAccountsStub()
    findAccountsRepository = stubs.findAccountsRepository
    findAccountsService = stubs.findAccountsService
    fakeAccount = stubs.fakeAccounts
  })

  it('Should be instantiable', async () => {
    expect(findAccountsService).toBeInstanceOf(FindAccountsService)
    expect(findAccountsService.execute).toBeInstanceOf(Function)
    expect(findAccountsService.execute).toBe(FindAccountsService.prototype.execute)
  })

  it('should throw a bad request http error if repository function FindAccounts throws http error', async () => {
    const internalServerError = new BadRequest('TEST: Http Error Internal Server.')

    findAccountsRepository.findAccounts = jest
      .fn()
      .mockRejectedValueOnce(new BadRequest('TEST: Http Error Internal Server.'))

    await expect(findAccountsService.execute({}, fakeAccount.financeSpot)).rejects.toStrictEqual(internalServerError)
  })

  it('should resolve if repository function FindAccounts resolves', async () => {
    findAccountsRepository.findAccounts = jest.fn().mockResolvedValueOnce({ Items: [fakeAccount] })

    await expect(findAccountsService.execute({}, fakeAccount.financeSpot)).resolves.toStrictEqual({
      Items: [fakeAccount]
    })
  })
})
