import { CategoryResult } from '@functions/categories/categories.type'
import { DeleteCategoryRepository } from '@functions/categories/deleteCategory/infra/delete-category.repository'

import { deleteCategoryStub } from './delete-category.mock'

const TABLE_NAME = 'fake-develop-financial-table-name'
const typeErrorMessage = 'Test: Forcing type error'
const { fakeCategory } = deleteCategoryStub()

jest.mock('@aws-sdk/client-dynamodb', () => {
  return {
    DynamoDBClient: jest.fn().mockImplementation(() => {
      return {}
    })
  }
})
jest.mock('@aws-sdk/lib-dynamodb', () => {
  return {
    DynamoDBDocumentClient: {
      from: jest.fn().mockImplementation(() => {
        return {
          send: jest.fn().mockImplementation(async (command) => {
            if (command.name === 'QueryCommand') {
              if (command.ExpressionAttributeValues[':pk'] === 'null') {
                throw new TypeError(typeErrorMessage)
              }

              return await Promise.resolve({ Items: [fakeCategory] })
            }

            if (command.name === 'TransactWriteCommand') {
              if (!command.TransactItems[0].Delete.Key.PK) {
                throw new TypeError(typeErrorMessage)
              }

              await Promise.resolve(undefined)
            }
          })
        }
      })
    },
    QueryCommand: jest.fn().mockImplementation((command) => {
      return { ...command, name: 'QueryCommand' }
    }),
    TransactWriteCommand: jest.fn().mockImplementation((command) => {
      return { ...command, name: 'TransactWriteCommand' }
    })
  }
})

describe('DeleteCategory Repository Unit tests', () => {
  it('should instantiable', async () => {
    const deleteCategoryRepository = new DeleteCategoryRepository(TABLE_NAME)

    expect(deleteCategoryRepository).toBeDefined()
    expect(deleteCategoryRepository).toBeInstanceOf(DeleteCategoryRepository)
    expect(deleteCategoryRepository.getCategory).toBeInstanceOf(Function)
    expect(deleteCategoryRepository.deleteCategory).toBeInstanceOf(Function)
  })

  it('should not send dynamo command if getCategory params are incorrect', async () => {
    const deleteCategoryRepository = new DeleteCategoryRepository(TABLE_NAME)

    await expect(deleteCategoryRepository.getCategory(null as unknown as string)).rejects.toStrictEqual(
      new TypeError(typeErrorMessage)
    )
  })

  it('should not send dynamo command if deleteCategory params are incorrect', async () => {
    const deleteCategoryRepository = new DeleteCategoryRepository(TABLE_NAME)

    await expect(deleteCategoryRepository.deleteCategory(null as unknown as CategoryResult)).rejects.toBeInstanceOf(
      TypeError
    )
  })

  it('should send dynamo command if getCategory params are correct', async () => {
    const deleteCategoryRepository = new DeleteCategoryRepository(TABLE_NAME)

    await expect(deleteCategoryRepository.getCategory(fakeCategory.financeSpot)).resolves.toBe(fakeCategory)
  })

  it('should send dynamo command if deleteCategory params are correct', async () => {
    const deleteCategoryRepository = new DeleteCategoryRepository(TABLE_NAME)

    await expect(deleteCategoryRepository.deleteCategory(fakeCategory)).resolves.toBe(undefined)
  })
})
