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
import { type FinancialResult } from '@functions/transactionsFinancial/financial.type'

import { type IDeleteFinancialRepository } from '../../repositories/delete-financial.interface'

const client = new DynamoDBClient({})
const dynamo = DynamoDBDocumentClient.from(client)

export class DeleteFinancialRepository implements IDeleteFinancialRepository {
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

  async deleteFinancial(FinancialDto: FinancialResult) {
    const transactWriteItemsInput: TransactWriteCommandInput = {
      TransactItems: []
    }

    transactWriteItemsInput.TransactItems?.push({
      Delete: {
        TableName: this.tableName,
        Key: {
          PK: FinancialDto.PK,
          SK: FinancialDto.SK
        }
      }
    })

    const transactWriteCommand = new TransactWriteCommand(transactWriteItemsInput)
    const transactWriteCommandOutput: TransactWriteCommandOutput = await dynamo.send(transactWriteCommand)

    console.info('RESPONSE_TransactWriteCommandOutput\n' + JSON.stringify(transactWriteCommandOutput, null, 2))
  }
}
