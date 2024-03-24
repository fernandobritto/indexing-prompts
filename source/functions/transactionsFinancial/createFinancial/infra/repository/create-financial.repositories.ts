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
import { UpdateAccount } from '@functions/accounts/updateAccounts/update-accounts.validator'
import { v4 as uuid } from 'uuid'

import { type CreateFinancial } from '../../create-financial.validator'
import { type ICreateFinancialRepository } from '../../repositories/create-financial.interface'

const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: true,
  convertClassInstanceToMap: false
}

interface AccountUpdateObject {
  UpdateExpression: string
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, unknown>
}

const unmarshallOptions = {
  wrapNumbers: false
}
const translateConfig = { marshallOptions, unmarshallOptions }
const client = new DynamoDBClient({})

const dynamo = DynamoDBDocumentClient.from(client, translateConfig)

export class CreateFinancialRepository implements ICreateFinancialRepository {
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

  async createFinancial(createFinancialDto: CreateFinancial[]) {
    const transactWriteItemsInput: TransactWriteCommandInput = {
      TransactItems: []
    }

    const currentDate = Date.now()
    const createdAt = currentDate
    const updatedAt = currentDate

    await Promise.all([
      createFinancialDto.map(async (financial) => {
        const {
          accountId,
          description,
          category,
          value,
          movementTypes,
          date,
          status,
          financeSpot,
          accountTransfer,
          typeTransaction,
          discount,
          paymentMethod
        } = financial
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
              status,
              accountTransfer,
              transactionUUID,
              createdAt,
              discount,
              updatedAt,
              typeTransaction,
              paymentMethod,
              isManual: false,
              originalValue: value + discount
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
}
