import { AccountsResult } from '@common/definitions/account.type'
import { UpdateAccountRepository } from '@functions/accounts/updateAccounts/infra/update-accounts.repository'
import { UpdateAccount } from '@functions/accounts/updateAccounts/update-accounts.validator'

import { updateAccountsStub } from './update-accounts.mock'

const TABLE_NAME = 'fake-develop-accounts-table-name'
const typeErrorMessage = 'Test: Forcing type error'
const { fakeAccounts } = updateAccountsStub()

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

              return await Promise.resolve({ Items: [fakeAccounts] })
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
    const updateAccountRepository = new UpdateAccountRepository(TABLE_NAME)

    expect(updateAccountRepository).toBeDefined()
    expect(updateAccountRepository).toBeInstanceOf(UpdateAccountRepository)
    expect(updateAccountRepository.getAccount).toBeInstanceOf(Function)
    expect(updateAccountRepository.updateAccount).toBeInstanceOf(Function)
    expect(updateAccountRepository.createFinancial).toBeInstanceOf(Function)
  })

  it('should not send dynamo command if getAccount params are incorrect', async () => {
    const updateAccountRepository = new UpdateAccountRepository(TABLE_NAME)

    await expect(updateAccountRepository.getAccount(null as unknown as string)).rejects.toStrictEqual(
      new TypeError(typeErrorMessage)
    )
  })

  it('should not send dynamo command if updateAccount params are incorrect', async () => {
    const updateAccountRepository = new UpdateAccountRepository(TABLE_NAME)

    await expect(
      updateAccountRepository.updateAccount({} as unknown as AccountsResult, {} as unknown as UpdateAccount)
    ).rejects.toBeInstanceOf(TypeError)
  })

  it('should send dynamo command if getAccount params are correct', async () => {
    const updateAccountRepository = new UpdateAccountRepository(TABLE_NAME)

    await expect(updateAccountRepository.getAccount(fakeAccounts.PK)).resolves.toBe(fakeAccounts)
  })
})
