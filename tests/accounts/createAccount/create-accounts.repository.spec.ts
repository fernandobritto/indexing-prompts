import { type CreateAccounts } from '@functions/accounts/createAccounts/create-accounts.validator'
import { CreateAccountsRepository } from '@functions/accounts/createAccounts/infra/repository/create-accounts.repository'

import { createAccountsStub } from './create-accounts.mock'

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

const TABLE_NAME = 'fake-develop-Accounts-table-name'

describe('CreateAccounts Repository Unit tests', () => {
  it('should instantiable', async () => {
    const createAccountsRepository = new CreateAccountsRepository(TABLE_NAME)

    expect(createAccountsRepository).toBeDefined()
    expect(createAccountsRepository).toBeInstanceOf(CreateAccountsRepository)
    expect(createAccountsRepository.createAccounts).toBeInstanceOf(Function)
  })

  it('should not send dynamo command if createAccountsDto param is incorrect', async () => {
    const createAccountsRepository = new CreateAccountsRepository(TABLE_NAME)

    await expect(createAccountsRepository.createAccounts({} as unknown as CreateAccounts[])).rejects.toStrictEqual(
      new TypeError('createAccountsDto.map is not a function')
    )
  })

  it('should send dynamo command', async () => {
    const createAccountsRepository = new CreateAccountsRepository(TABLE_NAME)

    const { createAccountsDto } = createAccountsStub()

    await expect(createAccountsRepository.createAccounts(createAccountsDto)).resolves.toBe(undefined)
  })
})
