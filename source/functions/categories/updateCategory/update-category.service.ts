import { BadRequest, isHttpError } from 'http-errors'

import { CategoryResult } from '../categories.type'
import { IUpdateCategoryRepository } from './repositories/update-category.interface'
import { UpdateCategory } from './update-category.validator'

export class UpdateCategoryService {
  constructor(private readonly updateCategoryRepository: IUpdateCategoryRepository) {}

  async execute(CategoryUUID: string, financeSpot: string, updateCategoryDto: UpdateCategory) {
    try {
      const hasCategory: CategoryResult | undefined = await this.updateCategoryRepository.getCategory(CategoryUUID)

      if (!hasCategory || hasCategory?.SK.substring(9) !== financeSpot) {
        throw new BadRequest(`Category not found.`)
      }

      await this.updateCategoryRepository.updateCategory(hasCategory, updateCategoryDto)
    } catch (err) {
      if (isHttpError(err)) {
        throw new BadRequest(err.message)
      }

      console.error('UPDATE_FINANCIAL_SERVICE_ERROR\n' + JSON.stringify(err, null, 2))
      console.error('UPDATE_FINANCIAL_SERVICE_ERROR_MESSAGE\n' + JSON.stringify(err?.message, null, 2))

      throw new BadRequest('Something went wrong while updating a category.')
    }
  }
}
