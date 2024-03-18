import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  TransactWriteCommand,
  type TransactWriteCommandInput,
  type TransactWriteCommandOutput
} from '@aws-sdk/lib-dynamodb'
import { v4 as uuid } from 'uuid'

import { CreateAccounts } from '../../create-accounts.validator'
import { ICreateAccountsRepository } from '../../repository/create-account.interface'

const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: true,
  convertClassInstanceToMap: false
}
const unmarshallOptions = {
  wrapNumbers: false
}
const translateConfig = { marshallOptions, unmarshallOptions }
const client = new DynamoDBClient({})

const dynamo = DynamoDBDocumentClient.from(client, translateConfig)

export class CreateAccountsRepository implements ICreateAccountsRepository {
  constructor(private readonly tableName = `${process.env.AWS_FINANCIAL_DYNAMODB_TABLE_NAME}`) {}

  async createAccounts(createAccountsDto: CreateAccounts[]) {
    const transactWriteItemsInput: TransactWriteCommandInput = {
      TransactItems: []
    }

    const currentDate = Date.now()
    const createdAt = currentDate
    const updatedAt = currentDate

    await Promise.all(
      createAccountsDto.map(async (accounts) => {
        const { accountName, accountType, currency, financialInstitution, financeSpot, openingBalance } = accounts
        const accountId = uuid()
        const sortKey = `ACCOUNT#${financeSpot}`

        if (accountType === 'DEFAULT') {
          const defaultAccount = await this.checkDefaultAccountExists()
          if (defaultAccount) {
            throw new Error(
              "An account with accountType 'DEFAULT' already exists. It's not possible to create another one."
            )
          }
        }

        transactWriteItemsInput.TransactItems?.push({
          Put: {
            Item: {
              PK: accountId,
              SK: sortKey,
              accountName,
              accountType,
              financialInstitution,
              openingBalance,
              currentBalance: openingBalance,
              currency,
              createdAt,
              updatedAt
            },
            TableName: this.tableName
          }
        })
      })
    )

    const transactWriteCommand = new TransactWriteCommand(transactWriteItemsInput)
    const transactWriteCommandOutput: TransactWriteCommandOutput = await dynamo.send(transactWriteCommand)

    console.info('RESPONSE_TransactWriteCommandOutput\n' + JSON.stringify(transactWriteCommandOutput, null, 2))
  }

  async checkDefaultAccountExists() {
    const queryCommand = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'account-type-index',
      KeyConditionExpression: 'accountType = :accountType',
      ExpressionAttributeValues: {
        ':accountType': { S: 'DEFAULT' }
      },
      Limit: 1
    })
    const data = await client.send(queryCommand)
    return data.Items ? data.Items[0] : null
  }
}
