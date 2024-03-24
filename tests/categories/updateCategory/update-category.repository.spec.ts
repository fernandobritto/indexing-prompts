import { CategoryResult } from '@functions/categories/categories.type'
import { UpdateCategoryRepository } from '@functions/categories/updateCategory/infra/repository/update-category.repository'
import { UpdateCategory } from '@functions/categories/updateCategory/update-category.validator'

import { updateCategoryStub } from './update-category.mock'

const TABLE_NAME = 'fake-develop-accounts-table-name'
const typeErrorMessage = 'Test: Forcing type error'
const { fakeCategory } = updateCategoryStub()

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
              if (command.TransactItems.length <= 1) {
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

describe('UpdateBenefit Repository Unit tests', () => {
  it('should instantiable', async () => {
    const updateCategoryRepository = new UpdateCategoryRepository(TABLE_NAME)

    expect(updateCategoryRepository).toBeDefined()
    expect(updateCategoryRepository).toBeInstanceOf(UpdateCategoryRepository)
    expect(updateCategoryRepository.getCategory).toBeInstanceOf(Function)
    expect(updateCategoryRepository.updateCategory).toBeInstanceOf(Function)
  })

  it('should not send dynamo command if getCategory params are incorrect', async () => {
    const updateCategoryRepository = new UpdateCategoryRepository(TABLE_NAME)

    await expect(updateCategoryRepository.getCategory(null as unknown as string)).rejects.toStrictEqual(
      new TypeError(typeErrorMessage)
    )
  })

  it('should not send dynamo command if updateCategory params are incorrect', async () => {
    const updateCategoryRepository = new UpdateCategoryRepository(TABLE_NAME)

    await expect(
      updateCategoryRepository.updateCategory({} as unknown as CategoryResult, {} as unknown as UpdateCategory)
    ).rejects.toBeInstanceOf(TypeError)
  })

  it('should send dynamo command if getCategory params are correct', async () => {
    const updateCategoryRepository = new UpdateCategoryRepository(TABLE_NAME)

    await expect(updateCategoryRepository.getCategory(fakeCategory.PK)).resolves.toBe(fakeCategory)
  })
})
