import { formatResponse } from '@helpers/formatResponse'
import type middy from '@middy/core'
import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyHandler,
  type APIGatewayProxyResult,
  type Context
} from 'aws-lambda'
import { type HttpError, isHttpError } from 'http-errors'

import { CreateAccountsService } from './create-accounts.service'
import { type CreateAccountsRequestBody } from './create-accounts.validator'
import { CreateAccountsRepository } from './infra/repository/create-accounts.repository'
import { createAccountsMiddleware } from './middlewares/create-accounts.middleware'

const createAccountsHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const createAccountsService = new CreateAccountsService(new CreateAccountsRepository())
    const { accounts: createAccountsDto } = event.body as unknown as CreateAccountsRequestBody

    await createAccountsService.execute(createAccountsDto)

    return await formatResponse(201, {
      message: 'Create accounts request was successfully'
    })
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

export const createAccounts: middy.MiddyfiedHandler<APIGatewayProxyEvent, APIGatewayProxyResult, Error, Context> =
  createAccountsMiddleware(createAccountsHandler)
