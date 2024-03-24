import { faker } from '@faker-js/faker'
import { CategoryResult } from '@functions/categories/categories.type'
import { CreateCategory } from '@functions/categories/createCategory/create-category-validation.validator'

export function createFakeCategory(): CreateCategory {
  return {
    categoryName: faker.commerce.productName(),
    financeSpot: `fs${faker.string.alphanumeric({ casing: 'upper', length: 8 })}`
  }
}

export function getFakeCategory(): CategoryResult {
  const fakeDate = new Date()
  const fakeUUID = faker.string.uuid()
  const fakeUUIDFinancialSpot = `fs${faker.string.alphanumeric({ casing: 'upper', length: 8 })}`

  const partitionKey = 'CATEGORY#'
  const compositeKey = `${partitionKey}#${fakeUUIDFinancialSpot}`

  return {
    PK: fakeUUID,
    SK: compositeKey,
    createdAt: fakeDate,
    updatedAt: fakeDate,
    categoryName: faker.commerce.productName(),
    financeSpot: `fs${faker.string.alphanumeric({ casing: 'upper', length: 8 })}`
  }
}
