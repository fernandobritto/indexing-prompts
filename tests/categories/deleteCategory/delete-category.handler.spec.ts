import { CategoryResult } from '@functions/categories/categories.type'
import { DeleteCategoryService } from '@functions/categories/deleteCategory/delete-category.service'
import { deleteCategory } from '@functions/categories/deleteCategory/handler'
import { mockedApiGatewayEvent } from '@tests/utils/mockedApiGatewayEvent'
import { type Callback, type Context } from 'aws-lambda'
import { BadRequest } from 'http-errors'

import { deleteCategoryStub } from './delete-category.mock'

jest.mock('@functions/categories/deleteCategory/delete-category.service')

describe('DeleteCategory Handler unit tests', () => {
  let fakeCategory: CategoryResult

  beforeAll(async () => {
    fakeCategory = deleteCategoryStub().fakeCategory
  })

  it('Should return status code 422 for invalid request params', async () => {
    console.log(fakeCategory)
    const response = await deleteCategory(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'DELETE',
        pathParameters: {}
      },
      {} as Context,
      {} as Callback
    )

    expect(response?.statusCode).toBe(422)
  })

  it('Should return status code 400 for bad requests', async () => {
    const result = {
      message: 'TEST: Forcing bad request'
    }

    ;(DeleteCategoryService.prototype as unknown as jest.Mocked<DeleteCategoryService>).execute.mockRejectedValueOnce(
      BadRequest(result.message)
    )

    const response = await deleteCategory(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'DELETE',
        pathParameters: {
          uuid: fakeCategory.PK
        }
      },
      {} as Context,
      {} as Callback
    )

    expect(response?.statusCode).toBe(400)
    expect(response?.body).toBe(JSON.stringify(result))
  })

  it('should return status code 500 for unexpected errors', async () => {
    const result = {
      message: 'Unexpected Error!'
    }

    ;(DeleteCategoryService.prototype as jest.Mocked<DeleteCategoryService>).execute.mockRejectedValueOnce(
      new Error('TEST: Forcing unexpected error')
    )

    const response = await deleteCategory(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'DELETE',
        pathParameters: {
          uuid: fakeCategory.PK
        }
      },
      {} as Context,
      {} as Callback
    )

    expect(response?.statusCode).toBe(500)
    expect(response?.body).toBe(JSON.stringify(result))
  })

  it('Should return 200 for successfully requests that delete a Category', async () => {
    ;(DeleteCategoryService.prototype as jest.Mocked<DeleteCategoryService>).execute.mockResolvedValueOnce()
    const response = await deleteCategory(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'DELETE',
        pathParameters: {
          uuid: fakeCategory.PK
        }
      },
      {} as Context,
      {} as Callback
    )

    expect(response?.statusCode).toBe(200)
    expect(response?.body).toBe(JSON.stringify({ message: 'Delete category request was successfully!' }))
  })
})
