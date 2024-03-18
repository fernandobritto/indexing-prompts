import { CreateCategory } from '../create-category-validation.validator'

export interface ICreateCategoryRepository {
  createCategory: (createCategoryDto: CreateCategory[]) => Promise<void>
}
