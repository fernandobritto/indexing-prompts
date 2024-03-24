import { DeleteCategoryService } from '@functions/categories/deleteCategory/delete-category.service'
import { IDeleteCategoryRepository } from '@functions/categories/deleteCategory/repositories/delete-category.interface'

import { getFakeCategory } from '../categories.mock'

const DeleteCategoryRepositoryMock = jest.fn<IDeleteCategoryRepository, unknown[]>()

export const deleteCategoryStub = () => {
  const deleteCategoryRepository = new DeleteCategoryRepositoryMock()
  const deleteCategoryService = new DeleteCategoryService(deleteCategoryRepository)
  const fakeCategory = getFakeCategory()

  return Object.freeze({
    deleteCategoryRepository,
    deleteCategoryService,
    fakeCategory
  })
}
