import { BadRequest, isHttpError } from 'http-errors'

import { CreateCategory } from './create-category-validation.validator'
import { ICreateCategoryRepository } from './repositories/create-category-validation.interface'

export class CreateCategoryService {
  constructor(private readonly createCategoryRepository: ICreateCategoryRepository) {}

  async execute(createCategoryDto: CreateCategory[]) {
    try {
      await this.createCategoryRepository.createCategory(createCategoryDto)
    } catch (err) {
      if (isHttpError(err)) {
        throw new BadRequest(err.message)
      }
      console.error('CREATE_FINANCIAL_SERVICE_ERROR\n' + JSON.stringify(err, null, 2))
      console.error('CREATE_FINANCIAL_SERVICE_ERROR_MESSAGE\n' + JSON.stringify(err?.message, null, 2))

      throw new BadRequest('Something went wrong while creating Category.')
    }
  }
}
