import { UpdateAccountService } from '@functions/accounts/updateAccounts/update-accounts.service'
import { BadRequest } from 'http-errors'

import { updateAccountsStub } from './update-accounts.mock'

describe('UpdateBenefits Service Unit tests', () => {
  it('Should be instantiable', async () => {
    const { updateAccountsService } = updateAccountsStub()

    expect(updateAccountsService).toBeInstanceOf(UpdateAccountService)
    expect(updateAccountsService.execute).toBeInstanceOf(Function)
    expect(updateAccountsService.execute).toBe(UpdateAccountService.prototype.execute)
  })

  it('should throw a bad request http error if repository function getAccount throws', async () => {
    const { updateAccountsRepository, fakeAccounts, fakeAccountsUpdate, updateAccountsService, fakeFinancial } =
      updateAccountsStub()
    const badRequestError = new BadRequest('Something went wrong while updating a accounts.')

    updateAccountsRepository.getAccount = jest.fn().mockRejectedValueOnce(new Error('TEST: Http Error Bad Request'))
    updateAccountsRepository.createFinancial = jest.fn().mockResolvedValueOnce(fakeFinancial)
    updateAccountsRepository.updateAccount = jest.fn().mockResolvedValueOnce(fakeAccountsUpdate)

    await expect(updateAccountsService.execute(fakeAccounts.financeSpot, fakeAccountsUpdate)).rejects.toStrictEqual(
      badRequestError
    )
  })

  it('should throw a bad request http error if financial is not found', async () => {
    const { updateAccountsRepository, fakeAccounts, fakeAccountsUpdate, updateAccountsService, fakeFinancial } =
      updateAccountsStub()
    const badRequestError = new BadRequest('Account not found.')

    updateAccountsRepository.getAccount = jest.fn().mockResolvedValueOnce(undefined)
    updateAccountsRepository.createFinancial = jest.fn().mockResolvedValueOnce(fakeFinancial)
    updateAccountsRepository.updateAccount = jest.fn().mockResolvedValueOnce(fakeAccountsUpdate)

    await expect(
      updateAccountsService.execute(fakeAccounts.PK, fakeAccounts.financeSpot, fakeAccountsUpdate)
    ).rejects.toStrictEqual(badRequestError)
  })

  it('should throw a bad request http error if repository function updateAccounts throws', async () => {
    const { updateAccountsRepository, fakeAccounts, fakeAccountsUpdate, updateAccountsService, fakeFinancial } =
      updateAccountsStub()
    const badRequestError = new BadRequest('Account not found.')

    updateAccountsRepository.getAccount = jest.fn().mockResolvedValue(fakeAccounts)
    updateAccountsRepository.updateAccount = jest.fn().mockRejectedValueOnce(new Error('TEST: Http Error Bad Request'))
    updateAccountsRepository.createFinancial = jest.fn().mockResolvedValueOnce(fakeFinancial)

    await expect(updateAccountsService.execute(fakeAccounts.PK, fakeAccountsUpdate)).rejects.toStrictEqual(
      badRequestError
    )
  })

  // it('should resolve if repository functions getAccount and updateBenefit resolves', async () => {
  //   const { updateAccountsRepository, fakeAccounts, fakeAccountsUpdate, updateAccountsService, fakeFinancial } =
  //     updateAccountsStub()

  //   updateAccountsRepository.getAccount = jest.fn().mockResolvedValue(fakeAccounts)
  //   updateAccountsRepository.updateAccount = jest.fn().mockResolvedValueOnce(undefined)
  //   updateAccountsRepository.createFinancial = jest.fn().mockResolvedValueOnce(fakeFinancial)

  //   await expect(updateAccountsService.execute(fakeAccounts.PK, fakeAccountsUpdate)).resolves.toBe(undefined)
  // })
})
