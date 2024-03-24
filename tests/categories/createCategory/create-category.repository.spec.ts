import { type CreateCategory } from '@functions/categories/createCategory/create-category-validation.validator'
import { CreateCategoryRepository } from '@functions/categories/createCategory/infra/create-category.repository'

import { createCategoryStub } from './create-category.mock'

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
            const res = 'Test: Fake TransactWriteCommand Response'

            if (command.name !== 'TransactWriteCommand') {
              throw new Error('Test: Forcing error on dynamo send command')
            }

            return await Promise.resolve(res)
          })
        }
      })
    },
    TransactWriteCommand: jest.fn().mockImplementation(() => {
      return { name: 'TransactWriteCommand' }
    })
  }
})

const TABLE_NAME = 'fake-develop-Category-table-name'

describe('CreateCategory Repository Unit tests', () => {
  it('should instantiable', async () => {
    const createCategoryRepository = new CreateCategoryRepository(TABLE_NAME)

    expect(createCategoryRepository).toBeDefined()
    expect(createCategoryRepository).toBeInstanceOf(CreateCategoryRepository)
    expect(createCategoryRepository.createCategory).toBeInstanceOf(Function)
  })

  it('should not send dynamo command if createCategoryDto param is incorrect', async () => {
    const createCategoryRepository = new CreateCategoryRepository(TABLE_NAME)

    await expect(createCategoryRepository.createCategory({} as unknown as CreateCategory[])).rejects.toStrictEqual(
      new TypeError('createCategoryDto.map is not a function')
    )
  })

  it('should send dynamo command', async () => {
    const createCategoryRepository = new CreateCategoryRepository(TABLE_NAME)

    const { createCategoryDto } = createCategoryStub()

    await expect(createCategoryRepository.createCategory(createCategoryDto)).resolves.toBe(undefined)
  })
})
