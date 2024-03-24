import { FindCategoryRepository } from '@functions/categories/findCategory/infra/find-categories.repository'

import { findCategoryStub } from './find-categories.mock'

const TABLE_NAME = 'fake-develop-financial-table-name'
const { fakeCategory } = findCategoryStub()

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
          send: jest.fn().mockImplementation(async () => {
            return await Promise.resolve({ Items: [fakeCategory] })
          })
        }
      })
    },
    QueryCommand: jest.fn().mockImplementation((command) => {
      return { ...command, name: 'QueryCommand' }
    })
  }
})

describe('ListBenefits Repository Unit tests', () => {
  it('should instantiable', async () => {
    const findCategoryRepository = new FindCategoryRepository(TABLE_NAME)

    expect(findCategoryRepository).toBeDefined()
    expect(findCategoryRepository).toBeInstanceOf(FindCategoryRepository)
    expect(findCategoryRepository.findCategory).toBeInstanceOf(Function)
  })

  it('should send dynamo command', async () => {
    const findCategoryRepository = new FindCategoryRepository(TABLE_NAME)

    await expect(findCategoryRepository.findCategory({}, fakeCategory.financeSpot)).resolves.toStrictEqual({
      Items: [fakeCategory],
      LastEvaluatedKey: undefined
    })
  })

  it('should send dynamo command with pagination', async () => {
    const findCategoryRepository = new FindCategoryRepository(TABLE_NAME)

    await expect(
      findCategoryRepository.findCategory({ LastEvaluatedKey: { foo: 'bar' } }, fakeCategory.financeSpot)
    ).resolves.toStrictEqual({
      Items: [fakeCategory],
      LastEvaluatedKey: undefined
    })
  })
})
