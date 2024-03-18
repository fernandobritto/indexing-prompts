import { formatResponse } from '@helpers/formatResponse'
import type middy from '@middy/core'
import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyHandler,
  type APIGatewayProxyResult,
  type Context
} from 'aws-lambda'
import { type HttpError, isHttpError } from 'http-errors'

import { CreateCategoryService } from './create-category-validation.service'
import { type CreateCategoryRequestBody } from './create-category-validation.validator'
import { CreateCategoryRepository } from './infra/create-category.repository'
import { createCategoryValidationMiddleware } from './middlewares/create-category-validation.middleware'

const createCategoryHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const createCategoryService = new CreateCategoryService(new CreateCategoryRepository())
    const { createCategory: createCategoryDto } = event.body as unknown as CreateCategoryRequestBody

    await createCategoryService.execute(createCategoryDto)

    return await formatResponse(201, {
      message: 'Create Category request was successfully'
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

export const createCategory: middy.MiddyfiedHandler<APIGatewayProxyEvent, APIGatewayProxyResult, Error, Context> =
  createCategoryValidationMiddleware(createCategoryHandler)
