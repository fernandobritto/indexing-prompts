import { CreateCategoryService } from '@functions/categories/createCategory/create-category-validation.service'
import { BadRequest } from 'http-errors'

import { createCategoryStub } from './create-category.mock'

describe('CreateCategory Service Unit tests', () => {
  it('Should be instantiable', async () => {
    const { createCategoryService } = createCategoryStub()

    expect(createCategoryService).toBeInstanceOf(CreateCategoryService)
    expect(createCategoryService.execute).toBeInstanceOf(Function)
    expect(createCategoryService.execute).toBe(CreateCategoryService.prototype.execute)
  })

  it('should throw a bad request http error if repository function createCategory throws', async () => {
    const { createCategoryDto, createCategoryRepository, createCategoryService } = createCategoryStub()
    const badRequestError = new BadRequest('Something went wrong while creating Category.')

    createCategoryRepository.createCategory = jest.fn().mockRejectedValueOnce(new Error('TEST: Http Error Bad Request'))

    await expect(createCategoryService.execute(createCategoryDto)).rejects.toStrictEqual(badRequestError)
  })

  it('should resolve if repository function createCategory resolves', async () => {
    const { createCategoryDto, createCategoryRepository, createCategoryService } = createCategoryStub()

    createCategoryRepository.createCategory = jest.fn().mockResolvedValue(undefined)

    await expect(createCategoryService.execute(createCategoryDto)).resolves.toBe(undefined)
  })
})
