import { formatResponse } from '@helpers/formatResponse'
import type middy from '@middy/core'
import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyHandler,
  type APIGatewayProxyResult,
  type Context
} from 'aws-lambda'
import { type HttpError, isHttpError } from 'http-errors'

import { UpdateFinancialRepository } from './infra/repository/update-financial.repository'
import { updateFinancialMiddleware } from './middlewares/update-financial.middleware'
import { UpdateFinancialService } from './update-financial.service'
import { type UpdateFinancialRequestBody } from './update-financial.validator'

const updateFinancialHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const updateFinancialService = new UpdateFinancialService(new UpdateFinancialRepository())

    const { uuid: FinancialUUID } = event.pathParameters as unknown

    const { updateFinancial: updateFinancialDto } = event.body as unknown as UpdateFinancialRequestBody

    await updateFinancialService.execute(FinancialUUID, updateFinancialDto)

    return await formatResponse(200, {
      message: 'Update financial request was successfully!'
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

export const updateFinancial: middy.MiddyfiedHandler<APIGatewayProxyEvent, APIGatewayProxyResult, Error, Context> =
  updateFinancialMiddleware(updateFinancialHandler)
