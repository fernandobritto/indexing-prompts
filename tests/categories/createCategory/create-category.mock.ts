import { CreateCategoryService } from '@functions/categories/createCategory/create-category-validation.service'
import { type CreateCategoryRequestBody } from '@functions/categories/createCategory/create-category-validation.validator'
import { type ICreateCategoryRepository } from '@functions/categories/createCategory/repositories/create-category-validation.interface'

import { createFakeCategory } from '../categories.mock'

const CreateCategoryRepositoryMock = jest.fn<ICreateCategoryRepository, unknown[]>()

export const createCategoryStub = () => {
  const createCategoryRequestBody: CreateCategoryRequestBody = {
    createCategory: [createFakeCategory()]
  }
  const createCategoryDto = [createFakeCategory()]
  const createCategoryRepository = new CreateCategoryRepositoryMock()
  const createCategoryService = new CreateCategoryService(createCategoryRepository)

  // const fakeCategory = getFakeCategories()

  return Object.freeze({
    createCategoryRequestBody,
    createCategoryDto,
    createCategoryRepository,
    createCategoryService
  })
}
