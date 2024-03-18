import { formatResponse } from '@helpers/formatResponse'
import type middy from '@middy/core'
import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyHandler,
  type APIGatewayProxyResult,
  type Context
} from 'aws-lambda'
import { type HttpError, isHttpError } from 'http-errors'

import { UpdateAccountRepository } from './infra/update-accounts.repository'
import { updateAccountMiddleware } from './middlewares/update-accounts.middleware'
import { UpdateAccountService } from './update-accounts.service'
import { type UpdateAccountPathParams, type UpdateAccountRequestBody } from './update-accounts.validator'

const updateAccountHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const updateAccountService = new UpdateAccountService(new UpdateAccountRepository())

    const { uuid: AccountUUID } = event.pathParameters as unknown as UpdateAccountPathParams

    const { updateAccount: updateAccountDto } = event.body as unknown as UpdateAccountRequestBody

    await updateAccountService.execute(AccountUUID, updateAccountDto)

    return await formatResponse(200, {
      message: 'Update accounts request was successfully!'
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

export const updateAccount: middy.MiddyfiedHandler<APIGatewayProxyEvent, APIGatewayProxyResult, Error, Context> =
  updateAccountMiddleware(updateAccountHandler)
