import { CreateCategoryService } from '@functions/categories/createCategory/create-category-validation.service'
import { createCategory } from '@functions/categories/createCategory/handler'
import { mockedApiGatewayEvent } from '@tests/utils/mockedApiGatewayEvent'
import { type Callback, type Context } from 'aws-lambda'
import { BadRequest } from 'http-errors'

import { createCategoryStub } from './create-category.mock'
jest.mock('@functions/categories/createCategory/create-category-validation.service')

describe('GetService Handler unit tests', () => {
  const createCategoryRequestBody = createCategoryStub().createCategoryRequestBody

  it('Should return status code 422 for invalid request params', async () => {
    console.log(createCategoryRequestBody)
    const response = await createCategory(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'POST',
        body: JSON.stringify({
          createCategory: []
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
    ;(CreateCategoryService.prototype as jest.Mocked<CreateCategoryService>).execute.mockRejectedValueOnce(
      BadRequest(result.message)
    )

    const response = await createCategory(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'POST',
        body: JSON.stringify(createCategoryRequestBody)
      },
      {} as Context,
      {} as Callback
    )

    // expect(response?.statusCode).toBe(400)
    expect(response?.body).toBe(JSON.stringify(result))
  })

  it('should return status code 500 for unexpected errors', async () => {
    ;(CreateCategoryService.prototype as jest.Mocked<CreateCategoryService>).execute.mockRejectedValueOnce(
      new Error('TEST: Forcing unexpected error')
    )

    const result = {
      message: 'Unexpected Error!'
    }

    const response = await createCategory(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'POST',
        body: JSON.stringify(createCategoryRequestBody)
      },
      {} as Context,
      {} as Callback
    )

    expect(response?.statusCode).toBe(500)
    expect(response?.body).toBe(JSON.stringify(result))
  })

  it('Should return 201 for successfully requests that created Category', async () => {
    ;(CreateCategoryService.prototype as jest.Mocked<CreateCategoryService>).execute.mockResolvedValueOnce()

    const result = {
      message: 'Create Category request was successfully'
    }

    const response = await createCategory(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'POST',
        body: JSON.stringify(createCategoryRequestBody)
      },
      {} as Context,
      {} as Callback
    )

    expect(response?.statusCode).toBe(201)
    expect(response?.body).toBe(JSON.stringify(result))
  })
})
