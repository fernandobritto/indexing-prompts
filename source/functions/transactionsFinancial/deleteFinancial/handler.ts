import { formatResponse } from '@helpers/formatResponse'
import type middy from '@middy/core'
import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyHandler,
  type APIGatewayProxyResult,
  type Context
} from 'aws-lambda'
import { type HttpError, isHttpError } from 'http-errors'

import { DeleteFinancialService } from './delete-financial.service'
import { type DeleteFinancialPathParams } from './delete-financial.validator'
import { DeleteFinancialRepository } from './infra/repository/delete-financial.repository'
import { deleteFinancialMiddleware } from './middlewares/delete-financial.middleware'

const deleteFinancialHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const deleteFinancialService = new DeleteFinancialService(new DeleteFinancialRepository())

    const { uuid: FinancialUUID } = event.pathParameters as unknown as DeleteFinancialPathParams

    await deleteFinancialService.execute(FinancialUUID)

    return await formatResponse(200, {
      message: 'Delete financial request was successfully!'
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

export const deleteFinancial: middy.MiddyfiedHandler<APIGatewayProxyEvent, APIGatewayProxyResult, Error, Context> =
  deleteFinancialMiddleware(deleteFinancialHandler)
