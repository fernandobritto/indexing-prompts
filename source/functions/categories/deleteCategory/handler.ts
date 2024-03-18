import { formatResponse } from '@helpers/formatResponse'
import type middy from '@middy/core'
import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyHandler,
  type APIGatewayProxyResult,
  type Context
} from 'aws-lambda'
import { type HttpError, isHttpError } from 'http-errors'

import { DeleteCategoryService } from './delete-category.service'
import { type DeleteCategoryPathParams } from './delete-category.validator'
import { DeleteCategoryRepository } from './infra/delete-category.repository'
import { deleteCategorytMiddleware } from './middlewares/delete-category.middleware'

const deleteCategoryHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const deleteCategoryService = new DeleteCategoryService(new DeleteCategoryRepository())

    const { uuid: CategoryUUID } = event.pathParameters as unknown as DeleteCategoryPathParams

    await deleteCategoryService.execute(CategoryUUID)

    return await formatResponse(200, {
      message: 'Delete category request was successfully!'
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

export const deleteCategory: middy.MiddyfiedHandler<APIGatewayProxyEvent, APIGatewayProxyResult, Error, Context> =
  deleteCategorytMiddleware(deleteCategoryHandler)
