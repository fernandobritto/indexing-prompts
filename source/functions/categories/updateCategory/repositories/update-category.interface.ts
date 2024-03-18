import { CategoryResult } from '@functions/categories/categories.type'

import { UpdateCategory } from '../update-category.validator'

export interface IUpdateCategoryRepository {
  getCategory: (CategoryUUID: string) => Promise<CategoryResult | undefined>
  updateCategory: (financial: CategoryResult, updateCategoryDto: UpdateCategory) => Promise<void>
}
