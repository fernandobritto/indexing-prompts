import { CreateCategory } from './createCategory/create-category-validation.validator'

interface AdditionalFieldsFromCategoryRecordResultFromDynamoDB {
  PK: string
  SK: string
  createdAt: Date
  updatedAt: Date
}

export type Category = CreateCategory
export type CategoryResult = Category & AdditionalFieldsFromCategoryRecordResultFromDynamoDB
