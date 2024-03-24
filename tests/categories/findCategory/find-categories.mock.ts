import { FindCategoryService } from '@functions/categories/findCategory/find-category-validation.service'
import { type IFindCategoryRepository } from '@functions/categories/findCategory/repositories/find-category-validation.interface'

import { getFakeCategory } from '../categories.mock'

const FindCategoryRepositoryMock = jest.fn<IFindCategoryRepository, unknown[]>()

export const findCategoryStub = () => {
  const findCategoryRepository = new FindCategoryRepositoryMock()
  const findCategoryService = new FindCategoryService(findCategoryRepository)
  const fakeCategory = getFakeCategory()

  return Object.freeze({
    findCategoryRepository,
    findCategoryService,
    fakeCategory
  })
}
