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

import { IUpdateCategoryRepository } from '../../repositories/update-category.interface'
import { UpdateCategory } from '../../update-category.validator'

interface CategoryUpdateObject {
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

export class UpdateCategoryRepository implements IUpdateCategoryRepository {
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

  async updateCategory(CategoryDto: CategoryResult, updateCategoryDto: UpdateCategory) {
    const transactWriteItemsInput: TransactWriteCommandInput = {
      TransactItems: []
    }

    const updatedAt = Date.now()

    const CategoryUpdateObject: CategoryUpdateObject = {
      UpdateExpression: 'SET #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':updatedAt': updatedAt
      }
    }

    Object.keys(updateCategoryDto).forEach((key) => {
      if (CategoryDto[`${key}`] === updateCategoryDto[`${key}`]) {
        return
      }

      if (updateCategoryDto[`${key}`]) {
        CategoryUpdateObject.UpdateExpression = `${CategoryUpdateObject.UpdateExpression}, #${key} = :${key}`
        CategoryUpdateObject.ExpressionAttributeNames[`#${key}`] = `${key}`
        CategoryUpdateObject.ExpressionAttributeValues[`:${key}`] = updateCategoryDto[`${key}`]
      }
    })

    transactWriteItemsInput.TransactItems?.push({
      Update: {
        TableName: this.tableName,
        Key: { PK: CategoryDto.PK, SK: CategoryDto.SK },
        UpdateExpression: CategoryUpdateObject.UpdateExpression,
        ExpressionAttributeNames: CategoryUpdateObject.ExpressionAttributeNames,
        ExpressionAttributeValues: CategoryUpdateObject.ExpressionAttributeValues
      }
    })

    const transactWriteCommand = new TransactWriteCommand(transactWriteItemsInput)
    const transactWriteCommandOutput: TransactWriteCommandOutput = await dynamo.send(transactWriteCommand)

    console.info('RESPONSE_TransactWriteCommandOutput\n' + JSON.stringify(transactWriteCommandOutput, null, 2))
  }
}
