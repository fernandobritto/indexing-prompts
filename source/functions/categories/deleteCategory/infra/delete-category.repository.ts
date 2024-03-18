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
import { CategoryResult } from '@functions/categories/categories.type'

import { IDeleteCategoryRepository } from '../repositories/delete-category.interface'

const client = new DynamoDBClient({})
const dynamo = DynamoDBDocumentClient.from(client)

export class DeleteCategoryRepository implements IDeleteCategoryRepository {
  constructor(private readonly tableName = `${process.env.AWS_FINANCIAL_DYNAMODB_TABLE_NAME}`) {}

  async getCategory(CategoryUUID: string) {
    const queryCommandInput: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: '#PK = :pk',
      ExpressionAttributeNames: {
        '#PK': 'PK'
      },
      ExpressionAttributeValues: {
        ':pk': `${CategoryUUID}`
      }
    }
    const queryCommand = new QueryCommand(queryCommandInput)
    const queryCommandOutput: QueryCommandOutput = await dynamo.send(queryCommand)

    const { Items } = queryCommandOutput

    return Items?.[0] as unknown as CategoryResult
  }

  async deleteCategory(CategoryDto: CategoryResult) {
    const transactWriteItemsInput: TransactWriteCommandInput = {
      TransactItems: []
    }

    transactWriteItemsInput.TransactItems?.push({
      Delete: {
        TableName: this.tableName,
        Key: {
          PK: CategoryDto.PK,
          SK: CategoryDto.SK
        }
      }
    })

    const transactWriteCommand = new TransactWriteCommand(transactWriteItemsInput)
    const transactWriteCommandOutput: TransactWriteCommandOutput = await dynamo.send(transactWriteCommand)

    console.info('RESPONSE_TransactWriteCommandOutput\n' + JSON.stringify(transactWriteCommandOutput, null, 2))
  }
}
