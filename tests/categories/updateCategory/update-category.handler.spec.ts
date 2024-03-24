import { faker } from '@faker-js/faker'
import { updateCategory } from '@functions/categories/updateCategory/handler'
import { UpdateCategoryService } from '@functions/categories/updateCategory/update-category.service'
import { mockedApiGatewayEvent } from '@tests/utils/mockedApiGatewayEvent'
import { type Callback, type Context } from 'aws-lambda'
import { BadRequest } from 'http-errors'

import { updateCategoryStub } from './update-category.mock'

jest.mock('@functions/categories/updateCategory/update-category.service')

describe('UpdateCategory Handler unit tests', () => {
  let fakeCategory
  let fakeCategoryUpdate
  let header

  beforeAll(async () => {
    fakeCategory = updateCategoryStub().fakeCategory
    fakeCategoryUpdate = updateCategoryStub().fakeCategoryUpdate

    header = {
      financeSpot: fakeCategory.financeSpot,
      'Content-Type': 'application/json',
      authorization: faker.string.alphanumeric(32)
    }
  })

  it('Should return status code 422 for invalid request params', async () => {
    const response = await updateCategory(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'PUT',

        pathParameters: {
          uuid: fakeCategory.PK
        },
        body: JSON.stringify({
          updateCategory: {
            history: 'a'
          }
        })
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

    ;(UpdateCategoryService.prototype as jest.Mocked<UpdateCategoryService>).execute.mockRejectedValueOnce(
      BadRequest(result.message)
    )

    const response = await updateCategory(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'PUT',
        headers: header,
        pathParameters: {
          uuid: fakeCategory.PK
        },
        body: JSON.stringify({
          updateCategory: fakeCategoryUpdate
        })
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

    ;(UpdateCategoryService.prototype as jest.Mocked<UpdateCategoryService>).execute.mockRejectedValueOnce(
      new Error('TEST: Forcing unexpected error')
    )

    const response = await updateCategory(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'PUT',
        headers: header,
        pathParameters: {
          uuid: fakeCategory.PK
        },
        body: JSON.stringify({
          updateCategory: fakeCategoryUpdate
        })
      },
      {} as Context,
      {} as Callback
    )

    expect(response?.statusCode).toBe(500)
    expect(response?.body).toBe(JSON.stringify(result))
  })

  it('Should return 200 for successfully requests that update a category', async () => {
    ;(UpdateCategoryService.prototype as jest.Mocked<UpdateCategoryService>).execute.mockResolvedValueOnce()
    const response = await updateCategory(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'PUT',
        headers: header,
        pathParameters: {
          uuid: fakeCategory.PK
        },
        body: JSON.stringify({
          updateCategory: fakeCategoryUpdate
        })
      },
      {} as Context,
      {} as Callback
    )

    expect(response?.statusCode).toBe(200)
    expect(response?.body).toBe(
      JSON.stringify({
        message: 'Update category request was successfully!'
      })
    )
  })
})
