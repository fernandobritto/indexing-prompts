import { CategoryResult } from '@functions/categories/categories.type'

export interface IDeleteCategoryRepository {
  getCategory: (CategoryUUID: string) => Promise<CategoryResult | undefined>
  deleteCategory: (Category: CategoryResult) => Promise<void>
}
