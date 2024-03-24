import { formatResponse } from '@helpers/formatResponse'
import type middy from '@middy/core'
import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyHandler,
  type APIGatewayProxyResult,
  type Context
} from 'aws-lambda'
import { type HttpError, isHttpError } from 'http-errors'

import { CreateFinancialService } from './create-financial.service'
import { type CreateFinancialRequestBody } from './create-financial.validator'
import { CreateFinancialRepository } from './infra/repository/create-financial.repositories'
import { createFinancialMiddleware } from './middlewares/create-financial.middleware'

const createFinancialHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const createFinancialService = new CreateFinancialService(new CreateFinancialRepository())
    const { financialTransaction: createFinancialDto } = event.body as unknown as CreateFinancialRequestBody

    await createFinancialService.execute(createFinancialDto)

    return await formatResponse(201, {
      message: 'Create financial request was successfully'
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

export const createFinancial: middy.MiddyfiedHandler<APIGatewayProxyEvent, APIGatewayProxyResult, Error, Context> =
  createFinancialMiddleware(createFinancialHandler)
