import { formatResponse } from '@helpers/formatResponse'
import type middy from '@middy/core'
import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyHandler,
  type APIGatewayProxyResult,
  type Context
} from 'aws-lambda'
import { type HttpError, isHttpError } from 'http-errors'

import { UpdateCategoryRepository } from './infra/repository/update-category.repository'
import { updateCategoryMiddleware } from './middlewares/update-category.middleware'
import { UpdateCategoryService } from './update-category.service'
import {
  type UpdateCategoryHeaderParams,
  type UpdateCategoryPathParams,
  type UpdateCategoryRequestBody
} from './update-category.validator'

const updateCategoryHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const updateCategoryService = new UpdateCategoryService(new UpdateCategoryRepository())

    const { uuid: CategoryUUID } = event.pathParameters as unknown as UpdateCategoryPathParams

    const { financeSpot } = event.headers as unknown as UpdateCategoryHeaderParams
    const { updateCategory: updateCategoryDto } = event.body as unknown as UpdateCategoryRequestBody

    await updateCategoryService.execute(CategoryUUID, financeSpot, updateCategoryDto)

    return await formatResponse(200, {
      message: 'Update category request was successfully!'
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

export const updateCategory: middy.MiddyfiedHandler<APIGatewayProxyEvent, APIGatewayProxyResult, Error, Context> =
  updateCategoryMiddleware(updateCategoryHandler)
