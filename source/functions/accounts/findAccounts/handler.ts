import { formatResponse } from '@helpers/formatResponse'
import type middy from '@middy/core'
import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyHandler,
  type APIGatewayProxyResult,
  type Context
} from 'aws-lambda'
import { type HttpError, isHttpError } from 'http-errors'

import { FindAccountsService } from './find-accounts.service'
import { type FindAccountHeaderParams, type FindAccountsQueryStringParameters } from './find-accounts.validator'
import { FindAccountsRepository } from './infra/repository/find-accounts.repository'
import { findAccountMiddleware } from './middlewares/find-account.middleware'

const findAccountsHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const findAccountsService = new FindAccountsService(new FindAccountsRepository())
    const findAccounts = event.queryStringParameters as unknown as FindAccountsQueryStringParameters

    const { financeSpot } = event.headers as unknown as FindAccountHeaderParams

    const result = await findAccountsService.execute(findAccounts, financeSpot)

    return await formatResponse(200, { result })
  } catch (err) {
    if (isHttpError(err)) {
      const httpError: HttpError = err

      return await formatResponse(httpError.statusCode, {
        message: httpError.message
      })
    }

    console.error('UNEXPECTED_ERROR\n' + JSON.stringify(err?.message, null, 2))

    return await formatResponse(500, {
      message: 'Unexpected Error!'
    })
  }
}

export const findAccounts: middy.MiddyfiedHandler<APIGatewayProxyEvent, APIGatewayProxyResult, Error, Context> =
  findAccountMiddleware(findAccountsHandler)
