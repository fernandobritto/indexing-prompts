import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  QueryCommand,
  type QueryCommandInput,
  type QueryCommandOutput
} from '@aws-sdk/lib-dynamodb'

import { FindAccountsQueryStringParameters } from '../../find-accounts.validator'
import { IFindAccountsRepository } from '../../repositories/find-accounts.interface'

interface financialFindObject {
  KeyConditionExpression: string
  IndexName: string
  FilterExpression: string
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, unknown>
}

const client = new DynamoDBClient({})
const dynamo = DynamoDBDocumentClient.from(client)

export class FindAccountsRepository implements IFindAccountsRepository {
  constructor(
    private readonly tableName = `${process.env.AWS_FINANCIAL_DYNAMODB_TABLE_NAME}`,
    private readonly paginationLimit = parseInt(`${process.env.AWS_DYNAMODB_PAGINATION_LIMIT}`)
  ) {}

  async findAccounts(findAccountsDto: FindAccountsQueryStringParameters, financeSpot: string) {
    const financialFindObject: financialFindObject = {
      IndexName: 'finance-spot-index',
      KeyConditionExpression: '#sk = :sk',
      ExpressionAttributeNames: {
        '#sk': 'SK'
      },
      ExpressionAttributeValues: {
        ':sk': `ACCOUNT#${financeSpot}`
      },
      FilterExpression: ''
    }

    if (findAccountsDto) {
      Object.keys(findAccountsDto).forEach((key) => {
        if (findAccountsDto[`${key}`]) {
          if (financialFindObject.FilterExpression.length > 0) {
            financialFindObject.FilterExpression = `${financialFindObject.FilterExpression} AND #${key} = :${key}`
          } else {
            financialFindObject.FilterExpression = `${financialFindObject.FilterExpression} #${key} = :${key}`
          }

          financialFindObject.ExpressionAttributeNames[`#${key}`] = `${key}`
          financialFindObject.ExpressionAttributeValues[`:${key}`] = findAccountsDto[`${key}`]
        }
      })
    }

    const queryCommandInput: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: financialFindObject.IndexName,
      KeyConditionExpression: financialFindObject.KeyConditionExpression,
      ExpressionAttributeNames: financialFindObject.ExpressionAttributeNames,
      ExpressionAttributeValues: financialFindObject.ExpressionAttributeValues,
      Limit: this.paginationLimit
    }

    if (financialFindObject.FilterExpression.length > 0) {
      queryCommandInput.FilterExpression = financialFindObject.FilterExpression
    }

    if (findAccountsDto?.LastEvaluatedKey) {
      queryCommandInput.ExclusiveStartKey = findAccountsDto.LastEvaluatedKey
    }

    const queryCommand = new QueryCommand(queryCommandInput)
    const queryCommandOutput: QueryCommandOutput = await dynamo.send(queryCommand)

    delete queryCommandInput.ExpressionAttributeValues

    console.info('RESPONSE_queryCommandInput\n' + JSON.stringify(queryCommandInput, null, 2))
    console.info('RESPONSE_queryCommandOutput\n' + JSON.stringify(queryCommandOutput, null, 2))

    const { Items, LastEvaluatedKey } = queryCommandOutput

    return { Items, LastEvaluatedKey }
  }
}
