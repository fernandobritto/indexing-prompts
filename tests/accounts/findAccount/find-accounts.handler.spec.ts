import { FindAccountsService } from '@functions/accounts/findAccounts/find-accounts.service'
import { findAccounts } from '@functions/accounts/findAccounts/handler'
import { mockedApiGatewayEvent } from '@tests/utils/mockedApiGatewayEvent'
import { type Callback, type Context } from 'aws-lambda'

import { findAccountsStub } from './find-accounts.mock'

jest.mock('@functions/accounts/findAccounts/find-accounts.service')

describe('ListAccounts Handler unit tests', () => {
  let fakeAccounts

  beforeAll(async () => {
    fakeAccounts = findAccountsStub().fakeAccounts
  })

  it('should return status code 500 for unexpected errors', async () => {
    ;(FindAccountsService.prototype as jest.Mocked<FindAccountsService>).execute.mockRejectedValueOnce(
      new Error('TEST: Forcing unexpected error')
    )

    const result = {
      message: 'Unexpected Error!'
    }

    const response = await findAccounts(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'GET',
        headers: {
          financeSpot: fakeAccounts.financeSpot
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
    const response = await findAccounts(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'GET',
        headers: {
          financeSpot: fakeAccounts.financeSpot
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
    ;(FindAccountsService.prototype as jest.Mocked<FindAccountsService>).execute.mockResolvedValueOnce({
      Items: [fakeAccounts],
      LastEvaluatedKey: undefined
    })

    const response = await findAccounts(
      {
        ...mockedApiGatewayEvent,
        headers: {
          financeSpot: fakeAccounts.financeSpot
        },
        httpMethod: 'GET'
      },
      {} as Context,
      {} as Callback
    )

    expect(response?.statusCode).toBe(200)
    expect(response?.body).toBe(JSON.stringify({ result: { Items: [fakeAccounts] } }))
  })
})
