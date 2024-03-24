import { DeleteCategoryService } from '@functions/categories/deleteCategory/delete-category.service'
import { BadRequest } from 'http-errors'

import { deleteCategoryStub } from './delete-category.mock'

describe('DeleteCategorys Service Unit tests', () => {
  it('Should be instantiable', async () => {
    const { deleteCategoryService } = deleteCategoryStub()

    expect(deleteCategoryService).toBeInstanceOf(DeleteCategoryService)
    expect(deleteCategoryService.execute).toBeInstanceOf(Function)
    expect(deleteCategoryService.execute).toBe(DeleteCategoryService.prototype.execute)
  })

  it('should throw a bad request http error if repository function getPerson throws', async () => {
    const { deleteCategoryService, deleteCategoryRepository, fakeCategory } = deleteCategoryStub()
    const badRequestError = new BadRequest('Something went wrong while deleting a financial.')

    deleteCategoryRepository.getCategory = jest.fn().mockRejectedValueOnce(new Error('TEST: Http Error Bad Request'))

    await expect(deleteCategoryService.execute(fakeCategory.PK)).rejects.toStrictEqual(badRequestError)
  })

  it('should throw a bad request http error if repository function deleteCategory throws', async () => {
    const { deleteCategoryService, deleteCategoryRepository, fakeCategory } = deleteCategoryStub()
    const badRequestError = new BadRequest('Something went wrong while deleting a financial.')

    deleteCategoryRepository.getCategory = jest.fn().mockResolvedValue(fakeCategory)
    deleteCategoryRepository.deleteCategory = jest.fn().mockRejectedValueOnce(new Error('TEST: Http Error Bad Request'))

    await expect(deleteCategoryService.execute(fakeCategory.SK)).rejects.toStrictEqual(badRequestError)
  })

  it('should resolve if repository functions getPerson and deleteCategory resolves', async () => {
    const { deleteCategoryService, deleteCategoryRepository, fakeCategory } = deleteCategoryStub()

    deleteCategoryRepository.getCategory = jest.fn().mockResolvedValue(fakeCategory)
    deleteCategoryRepository.deleteCategory = jest.fn().mockResolvedValueOnce(undefined)

    await expect(deleteCategoryService.execute(fakeCategory.PK)).resolves.toBe(undefined)
  })
})
