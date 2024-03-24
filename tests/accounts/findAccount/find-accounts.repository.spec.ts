import { FindAccountsRepository } from '@functions/accounts/findAccounts/infra/repository/find-accounts.repository'

import { findAccountsStub } from './find-accounts.mock'

const TABLE_NAME = 'fake-develop-financial-table-name'
const { fakeAccounts } = findAccountsStub()

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
            return await Promise.resolve({ Items: [fakeAccounts] })
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
    const findAccountsRepository = new FindAccountsRepository(TABLE_NAME)

    expect(findAccountsRepository).toBeDefined()
    expect(findAccountsRepository).toBeInstanceOf(FindAccountsRepository)
    expect(findAccountsRepository.findAccounts).toBeInstanceOf(Function)
  })

  it('should send dynamo command', async () => {
    const findAccountsRepository = new FindAccountsRepository(TABLE_NAME)

    await expect(findAccountsRepository.findAccounts({}, fakeAccounts.financeSpot)).resolves.toStrictEqual({
      Items: [fakeAccounts],
      LastEvaluatedKey: undefined
    })
  })

  it('should send dynamo command with pagination', async () => {
    const findAccountsRepository = new FindAccountsRepository(TABLE_NAME)

    await expect(
      findAccountsRepository.findAccounts({ LastEvaluatedKey: { foo: 'bar' } }, fakeAccounts.financeSpot)
    ).resolves.toStrictEqual({
      Items: [fakeAccounts],
      LastEvaluatedKey: undefined
    })
  })
})
