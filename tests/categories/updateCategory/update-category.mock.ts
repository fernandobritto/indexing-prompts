import { IUpdateCategoryRepository } from '@functions/categories/updateCategory/repositories/update-category.interface'
import { UpdateCategoryService } from '@functions/categories/updateCategory/update-category.service'

import { createFakeCategory, getFakeCategory } from '../categories.mock'

const UpdateCategorysRepositoryMock = jest.fn<IUpdateCategoryRepository, unknown[]>()

export const updateCategoryStub = () => {
  const updateCategoryRepository = new UpdateCategorysRepositoryMock()
  const updateCategoryService = new UpdateCategoryService(updateCategoryRepository)
  const fakeCategory = getFakeCategory()
  const fakeCategoryUpdate = createFakeCategory()

  return Object.freeze({
    updateCategoryRepository,
    updateCategoryService,
    fakeCategory,
    fakeCategoryUpdate
  })
}
