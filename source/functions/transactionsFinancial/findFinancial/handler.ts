import { formatResponse } from '@helpers/formatResponse'
import type middy from '@middy/core'
import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyHandler,
  type APIGatewayProxyResult,
  type Context
} from 'aws-lambda'
import { type HttpError, isHttpError } from 'http-errors'

import { FindFinancialService } from './find-financial.service'
import { type FindFinancialHeaderParams, type FindFinancialQueryStringParameters } from './find-financial.validator'
import { FindFinancialRepository } from './infra/repository/find-financial.repository'
import { findFinancialMiddleware } from './middlewares/find-financial.middleware'

const findFinancialHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const findFinancialService = new FindFinancialService(new FindFinancialRepository())
    const findFinancial = event.queryStringParameters as unknown as FindFinancialQueryStringParameters

    const { financeSpot } = event.headers as unknown as FindFinancialHeaderParams

    const result = await findFinancialService.execute(findFinancial, financeSpot)

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

export const findFinancial: middy.MiddyfiedHandler<APIGatewayProxyEvent, APIGatewayProxyResult, Error, Context> =
  findFinancialMiddleware(findFinancialHandler)
