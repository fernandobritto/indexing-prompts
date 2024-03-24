import { FindCategoryService } from '@functions/categories/findCategory/find-category-validation.service'
import { findCategories } from '@functions/categories/findCategory/handler'
import { mockedApiGatewayEvent } from '@tests/utils/mockedApiGatewayEvent'
import { type Callback, type Context } from 'aws-lambda'

import { findCategoryStub } from './find-categories.mock'

jest.mock('@functions/categories/findCategory/find-category-validation.service')

describe('ListCategory Handler unit tests', () => {
  let fakeCategory

  beforeAll(async () => {
    fakeCategory = findCategoryStub().fakeCategory
  })

  it('should return status code 500 for unexpected errors', async () => {
    ;(FindCategoryService.prototype as jest.Mocked<FindCategoryService>).execute.mockRejectedValueOnce(
      new Error('TEST: Forcing unexpected error')
    )

    const result = {
      message: 'Unexpected Error!'
    }

    const response = await findCategories(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'GET',
        headers: {
          financeSpot: fakeCategory.financeSpot
        },
        queryStringParameters: {}
      },
      {} as Context,
      {} as Callback
    )

    expect(response?.statusCode).toBe(500)
    expect(response?.body).toBe(JSON.stringify(result))
  })

  it('Should return status code 422 for invalid request params', async () => {
    const response = await findCategories(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'GET',
        headers: {
          financeSpot: fakeCategory.financeSpot
        },
        queryStringParameters: {
          LastEvaluatedKey: 1 as unknown as string
        }
      },
      {} as Context,
      {} as Callback
    )

    expect(response?.statusCode).toBe(422)
  })

  it('Should return 200 for successfully requests that get a account', async () => {
    ;(FindCategoryService.prototype as jest.Mocked<FindCategoryService>).execute.mockResolvedValueOnce({
      Items: [fakeCategory],
      LastEvaluatedKey: undefined
    })

    const response = await findCategories(
      {
        ...mockedApiGatewayEvent,
        headers: {
          financeSpot: fakeCategory.financeSpot
        },
        httpMethod: 'GET'
      },
      {} as Context,
      {} as Callback
    )

    expect(response?.statusCode).toBe(200)
    expect(response?.body).toBe(JSON.stringify({ result: { Items: [fakeCategory] } }))
  })
})
