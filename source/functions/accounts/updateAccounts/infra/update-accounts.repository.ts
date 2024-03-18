import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  QueryCommand,
  type QueryCommandInput,
  type QueryCommandOutput,
  TransactWriteCommand,
  type TransactWriteCommandInput,
  type TransactWriteCommandOutput
} from '@aws-sdk/lib-dynamodb'
import { AccountsResult } from '@common/definitions/account.type'
import { CreateFinancial } from '@functions/transactionsFinancial/createFinancial/create-financial.validator'
import { v4 as uuid } from 'uuid'

import { IUpdateAccountRepository } from '../repositories/update-accounts.interface'
import { UpdateAccount } from '../update-accounts.validator'

interface AccountUpdateObject {
  UpdateExpression: string
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, unknown>
}

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

export class UpdateAccountRepository implements IUpdateAccountRepository {
  constructor(private readonly tableName = `${process.env.AWS_FINANCIAL_DYNAMODB_TABLE_NAME}`) {}

  async getAccount(AccountUUID: string) {
    const queryCommandInput: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: '#PK = :pk',
      ExpressionAttributeNames: {
        '#PK': 'PK'
      },
      ExpressionAttributeValues: {
        ':pk': `${AccountUUID}`
      }
    }
    const queryCommand = new QueryCommand(queryCommandInput)
    const queryCommandOutput: QueryCommandOutput = await dynamo.send(queryCommand)

    const { Items } = queryCommandOutput

    return Items?.[0] as unknown as AccountsResult
  }

  async updateAccount(AccountDto: AccountsResult, updateAccountDto: UpdateAccount) {
    const transactWriteItemsInput: TransactWriteCommandInput = {
      TransactItems: []
    }

    const updatedAt = Date.now()

    const AccountUpdateObject: AccountUpdateObject = {
      UpdateExpression: 'SET #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':updatedAt': updatedAt
      }
    }

    Object.keys(updateAccountDto).forEach((key) => {
      if (AccountDto[`${key}`] === updateAccountDto[`${key}`]) {
        return
      }

      if (updateAccountDto[`${key}`]) {
        AccountUpdateObject.UpdateExpression = `${AccountUpdateObject.UpdateExpression}, #${key} = :${key}`
        AccountUpdateObject.ExpressionAttributeNames[`#${key}`] = `${key}`
        AccountUpdateObject.ExpressionAttributeValues[`:${key}`] = updateAccountDto[`${key}`]
      }
    })

    transactWriteItemsInput.TransactItems?.push({
      Update: {
        TableName: this.tableName,
        Key: { PK: AccountDto.PK, SK: AccountDto.SK },
        UpdateExpression: AccountUpdateObject.UpdateExpression,
        ExpressionAttributeNames: AccountUpdateObject.ExpressionAttributeNames,
        ExpressionAttributeValues: AccountUpdateObject.ExpressionAttributeValues
      }
    })

    const transactWriteCommand = new TransactWriteCommand(transactWriteItemsInput)
    const transactWriteCommandOutput: TransactWriteCommandOutput = await dynamo.send(transactWriteCommand)

    console.info('RESPONSE_TransactWriteCommandOutput\n' + JSON.stringify(transactWriteCommandOutput, null, 2))
  }

  async createFinancial(createFinancialDto: CreateFinancial[]) {
    const transactWriteItemsInput: TransactWriteCommandInput = {
      TransactItems: []
    }

    const currentDate = Date.now()
    const createdAt = currentDate
    const updatedAt = currentDate

    await Promise.all([
      createFinancialDto.map(async (financial) => {
        const { accountId, description, category, value, movementTypes, date, financeSpot, typeTransaction } = financial
        const transactionUUID = uuid()
        const financialId = uuid()
        const sortKey = `${financial.typeTransaction}#${financeSpot}`

        transactWriteItemsInput.TransactItems?.push({
          Put: {
            Item: {
              PK: financialId,
              SK: sortKey,
              accountId,
              description,
              category,
              value,
              movementTypes,
              date,
              transactionUUID,
              createdAt,
              updatedAt,
              typeTransaction,
              isManual: true
            },
            TableName: this.tableName
          }
        })
      })
    ])

    const transactWriteCommand = new TransactWriteCommand(transactWriteItemsInput)
    const transactWriteCommandOutput: TransactWriteCommandOutput = await dynamo.send(transactWriteCommand)

    console.info('RESPONSE_TransactWriteCommandOutput\n' + JSON.stringify(transactWriteCommandOutput, null, 2))
  }
}
