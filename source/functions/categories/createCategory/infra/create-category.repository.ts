import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  TransactWriteCommand,
  type TransactWriteCommandInput,
  type TransactWriteCommandOutput
} from '@aws-sdk/lib-dynamodb'
import { v4 as uuid } from 'uuid'

import { CreateCategory } from '../create-category-validation.validator'
import { ICreateCategoryRepository } from '../repositories/create-category-validation.interface'

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

export class CreateCategoryRepository implements ICreateCategoryRepository {
  constructor(private readonly tableName = `${process.env.AWS_FINANCIAL_DYNAMODB_TABLE_NAME}`) {}

  async createCategory(createCategoryDto: CreateCategory[]) {
    const transactWriteItemsInput: TransactWriteCommandInput = {
      TransactItems: []
    }

    const currentDate = Date.now()
    const createdAt = currentDate
    const updatedAt = currentDate

    await Promise.all([
      createCategoryDto.map(async (Category) => {
        const { categoryName, financeSpot } = Category
        const categoryId = uuid()
        const sortKey = `CATEGORY#${financeSpot}`

        transactWriteItemsInput.TransactItems?.push({
          Put: {
            Item: {
              PK: categoryId,
              SK: sortKey,
              categoryName,
              createdAt,
              updatedAt
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
