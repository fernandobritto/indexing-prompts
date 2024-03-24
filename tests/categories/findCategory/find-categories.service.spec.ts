import { FindCategoryService } from '@functions/categories/findCategory/find-category-validation.service'
import { BadRequest } from 'http-errors'

import { findCategoryStub } from './find-categories.mock'

describe('FindAccount Service Unit tests', () => {
  let findCategoryRepository
  let findCategoryService
  let fakeAccount

  beforeEach(() => {
    const stubs = findCategoryStub()
    findCategoryRepository = stubs.findCategoryRepository
    findCategoryService = stubs.findCategoryService
    fakeAccount = stubs.fakeCategory
  })

  it('Should be instantiable', async () => {
    expect(findCategoryService).toBeInstanceOf(FindCategoryService)
    expect(findCategoryService.execute).toBeInstanceOf(Function)
    expect(findCategoryService.execute).toBe(FindCategoryService.prototype.execute)
  })

  it('should throw a bad request http error if repository function FindCategory throws http error', async () => {
    const internalServerError = new BadRequest('TEST: Http Error Internal Server.')

    findCategoryRepository.findCategory = jest
      .fn()
      .mockRejectedValueOnce(new BadRequest('TEST: Http Error Internal Server.'))

    await expect(findCategoryService.execute({}, fakeAccount.financeSpot)).rejects.toStrictEqual(internalServerError)
  })

  it('should resolve if repository function FindCategory resolves', async () => {
    findCategoryRepository.findCategory = jest.fn().mockResolvedValueOnce({ Items: [fakeAccount] })

    await expect(findCategoryService.execute({}, fakeAccount.financeSpot)).resolves.toStrictEqual({
      Items: [fakeAccount]
    })
  })
})
