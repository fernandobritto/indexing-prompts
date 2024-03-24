import { UpdateCategoryService } from '@functions/categories/updateCategory/update-category.service'
import { BadRequest } from 'http-errors'

import { updateCategoryStub } from './update-category.mock'

describe('UpdateBenefits Service Unit tests', () => {
  it('Should be instantiable', async () => {
    const { updateCategoryService } = updateCategoryStub()

    expect(updateCategoryService).toBeInstanceOf(UpdateCategoryService)
    expect(updateCategoryService.execute).toBeInstanceOf(Function)
    expect(updateCategoryService.execute).toBe(UpdateCategoryService.prototype.execute)
  })

  it('should throw a bad request http error if repository function getCategory throws', async () => {
    const { updateCategoryRepository, fakeCategory, fakeCategoryUpdate, updateCategoryService } = updateCategoryStub()
    const badRequestError = new BadRequest('Something went wrong while updating a category.')

    updateCategoryRepository.getCategory = jest.fn().mockRejectedValueOnce(new Error('TEST: Http Error Bad Request'))
    updateCategoryRepository.updateCategory = jest.fn().mockResolvedValueOnce(fakeCategoryUpdate)
    fakeCategoryUpdate.financeSpot = fakeCategory?.SK.substring(9)

    await expect(
      updateCategoryService.execute(fakeCategory.PK, fakeCategory.SK.substring(9), fakeCategoryUpdate)
    ).rejects.toStrictEqual(badRequestError)
  })

  it('should throw a bad request http error if financails is not found', async () => {
    const { updateCategoryRepository, fakeCategory, fakeCategoryUpdate, updateCategoryService } = updateCategoryStub()
    const badRequestError = new BadRequest('Category not found.')

    updateCategoryRepository.getCategory = jest.fn().mockResolvedValueOnce(undefined)
    updateCategoryRepository.updateCategory = jest.fn().mockResolvedValueOnce(fakeCategoryUpdate)
    fakeCategoryUpdate.financeSpot = fakeCategory?.SK.substring(9)

    await expect(
      updateCategoryService.execute(fakeCategory.PK, fakeCategory.SK.substring(9), fakeCategoryUpdate)
    ).rejects.toStrictEqual(badRequestError)
  })

  it('should throw a bad request http error if repository function updateCategory throws', async () => {
    const { updateCategoryRepository, fakeCategory, fakeCategoryUpdate, updateCategoryService } = updateCategoryStub()
    const badRequestError = new BadRequest('Something went wrong while updating a category.')

    updateCategoryRepository.getCategory = jest.fn().mockResolvedValue(fakeCategory)
    updateCategoryRepository.updateCategory = jest.fn().mockRejectedValueOnce(new Error('TEST: Http Error Bad Request'))
    fakeCategoryUpdate.financeSpot = fakeCategory?.SK.substring(9)

    await expect(
      updateCategoryService.execute(fakeCategory.PK, fakeCategory.SK.substring(9), fakeCategoryUpdate)
    ).rejects.toStrictEqual(badRequestError)
  })

  it('should resolve if repository functions getCategory and updateBenefit resolves', async () => {
    const { updateCategoryRepository, fakeCategory, fakeCategoryUpdate, updateCategoryService } = updateCategoryStub()

    updateCategoryRepository.getCategory = jest.fn().mockResolvedValue(fakeCategory)
    updateCategoryRepository.updateCategory = jest.fn().mockResolvedValueOnce(undefined)
    fakeCategoryUpdate.financeSpot = fakeCategory?.SK.substring(9)

    await expect(
      updateCategoryService.execute(fakeCategory.PK, fakeCategory.SK.substring(9), fakeCategoryUpdate)
    ).resolves.toBe(undefined)
  })
})
