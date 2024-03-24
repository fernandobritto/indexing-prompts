import { CreateAccountsService } from '@functions/accounts/createAccounts/create-accounts.service'
import { BadRequest } from 'http-errors'

import { createAccountsStub } from './create-accounts.mock'

describe('CreateAccounts Service Unit tests', () => {
  it('Should be instantiable', async () => {
    const { createAccountsService } = createAccountsStub()

    expect(createAccountsService).toBeInstanceOf(CreateAccountsService)
    expect(createAccountsService.execute).toBeInstanceOf(Function)
    expect(createAccountsService.execute).toBe(CreateAccountsService.prototype.execute)
  })

  it('should throw a bad request http error if repository function createAccounts throws', async () => {
    const { createAccountsDto, createAccountsRepository, createAccountsService } = createAccountsStub()
    const badRequestError = new BadRequest('Something went wrong while creating Accounts.')

    createAccountsRepository.createAccounts = jest.fn().mockRejectedValueOnce(new Error('TEST: Http Error Bad Request'))

    await expect(createAccountsService.execute(createAccountsDto)).rejects.toStrictEqual(badRequestError)
  })

  it('should resolve if repository function createAccounts resolves', async () => {
    const { createAccountsDto, createAccountsRepository, createAccountsService } = createAccountsStub()

    createAccountsRepository.createAccounts = jest.fn().mockResolvedValue(undefined)

    await expect(createAccountsService.execute(createAccountsDto)).resolves.toBe(undefined)
  })
})
