import { BadRequest, isHttpError } from 'http-errors'

import { CategoryResult } from '../categories.type'
import { IDeleteCategoryRepository } from './repositories/delete-category.interface'

export class DeleteCategoryService {
  constructor(private readonly deleteCategoryRepository: IDeleteCategoryRepository) {}

  async execute(CategoryUUID: string) {
    try {
      const hasCategory: CategoryResult | undefined = await this.deleteCategoryRepository.getCategory(CategoryUUID)

      if (!hasCategory) {
        throw new BadRequest('Category not found.')
      }

      await this.deleteCategoryRepository.deleteCategory(hasCategory)
    } catch (err) {
      if (isHttpError(err)) {
        throw new BadRequest(err.message)
      }

      console.error('DELETE_CATEGORY_SERVICE_ERROR\n' + JSON.stringify(err, null, 2))
      console.error('DELETE_CATEGORY_SERVICE_ERROR_MESSAGE\n' + JSON.stringify(err?.message, null, 2))

      throw new BadRequest('Something went wrong while deleting a financial.')
    }
  }
}
