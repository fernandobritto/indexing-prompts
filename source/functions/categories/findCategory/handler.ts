import { formatResponse } from '@helpers/formatResponse'
import type middy from '@middy/core'
import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyHandler,
  type APIGatewayProxyResult,
  type Context
} from 'aws-lambda'
import { type HttpError, isHttpError } from 'http-errors'

import { FindCategoryService } from './find-category-validation.service'
import {
  type FindCategoryHeaderParams,
  type FindCategoryQueryStringParameters
} from './find-category-validation.validator'
import { FindCategoryRepository } from './infra/find-categories.repository'
import { findCategoriesMiddleware } from './middlewares/find-category-validation.middleware'

const findCategoryHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const findCategoryService = new FindCategoryService(new FindCategoryRepository())
    const findCategory = event.queryStringParameters as unknown as FindCategoryQueryStringParameters

    const { financeSpot } = event.headers as unknown as FindCategoryHeaderParams

    const result = await findCategoryService.execute(findCategory, financeSpot)

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

export const findCategories: middy.MiddyfiedHandler<APIGatewayProxyEvent, APIGatewayProxyResult, Error, Context> =
  findCategoriesMiddleware(findCategoryHandler)
