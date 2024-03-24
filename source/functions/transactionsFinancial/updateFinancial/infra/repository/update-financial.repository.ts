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
import { type FinancialResult } from '@functions/transactionsFinancial/financial.type'

import { type IUpdateFinancialRepository } from '../../repositories/update-financial.interface'
import { type UpdateFinancial } from '../../update-financial.validator'

interface FinancialUpdateObject {
  UpdateExpression: string
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, unknown>
}

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

export class UpdateFinancialRepository implements IUpdateFinancialRepository {
  constructor(private readonly tableName = `${process.env.AWS_FINANCIAL_DYNAMODB_TABLE_NAME}`) {}

  async getFinancial(FinancialUUID: string) {
    const queryCommandInput: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: '#PK = :pk',
      ExpressionAttributeNames: {
        '#PK': 'PK'
      },
      ExpressionAttributeValues: {
        ':pk': `${FinancialUUID}`
      }
    }
    const queryCommand = new QueryCommand(queryCommandInput)
    const queryCommandOutput: QueryCommandOutput = await dynamo.send(queryCommand)

    const { Items } = queryCommandOutput

    return Items?.[0] as unknown as FinancialResult
  }

  async updateFinancial(FinancialDto: FinancialResult, updateFinancialDto: UpdateFinancial) {
    const transactWriteItemsInput: TransactWriteCommandInput = {
      TransactItems: []
    }

    const updatedAt = Date.now()

    const FinancialUpdateObject: FinancialUpdateObject = {
      UpdateExpression: 'SET #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':updatedAt': updatedAt
      }
    }

    Object.keys(updateFinancialDto).forEach((key) => {
      if (FinancialDto[`${key}`] === updateFinancialDto[`${key}`]) {
        return
      }

      if (updateFinancialDto[`${key}`]) {
        FinancialUpdateObject.UpdateExpression = `${FinancialUpdateObject.UpdateExpression}, #${key} = :${key}`
        FinancialUpdateObject.ExpressionAttributeNames[`#${key}`] = `${key}`
        FinancialUpdateObject.ExpressionAttributeValues[`:${key}`] = updateFinancialDto[`${key}`]
      }
    })

    transactWriteItemsInput.TransactItems?.push({
      Update: {
        TableName: this.tableName,
        Key: { PK: FinancialDto.PK, SK: FinancialDto.SK },
        UpdateExpression: FinancialUpdateObject.UpdateExpression,
        ExpressionAttributeNames: FinancialUpdateObject.ExpressionAttributeNames,
        ExpressionAttributeValues: FinancialUpdateObject.ExpressionAttributeValues
      }
    })

    const transactWriteCommand = new TransactWriteCommand(transactWriteItemsInput)
    const transactWriteCommandOutput: TransactWriteCommandOutput = await dynamo.send(transactWriteCommand)

    console.info('RESPONSE_TransactWriteCommandOutput\n' + JSON.stringify(transactWriteCommandOutput, null, 2))
  }

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
}
