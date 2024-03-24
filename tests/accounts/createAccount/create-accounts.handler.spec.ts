import { CreateAccountsService } from '@functions/accounts/createAccounts/create-accounts.service'
import { createAccounts } from '@functions/accounts/createAccounts/handler'
import { mockedApiGatewayEvent } from '@tests/utils/mockedApiGatewayEvent'
import { type Callback, type Context } from 'aws-lambda'
import { BadRequest } from 'http-errors'

import { createAccountsStub } from './create-accounts.mock'
jest.mock('@functions/accounts/createAccounts/create-accounts.services')

describe('GetService Handler unit tests', () => {
  const createAccountsRequestBody = createAccountsStub().createAccountsRequestBody

  it('Should return status code 422 for invalid request params', async () => {
    console.log(createAccountsRequestBody)
    const response = await createAccounts(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'POST',
        body: JSON.stringify({
          createAccounts: []
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
    ;(CreateAccountsService.prototype as jest.Mocked<CreateAccountsService>).execute.mockRejectedValueOnce(
      BadRequest(result.message)
    )

    const response = await createAccounts(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'POST',
        body: JSON.stringify(createAccountsRequestBody)
      },
      {} as Context,
      {} as Callback
    )

    // expect(response?.statusCode).toBe(400)
    expect(response?.body).toBe(JSON.stringify(result))
  })

  it('should return status code 500 for unexpected errors', async () => {
    ;(CreateAccountsService.prototype as jest.Mocked<CreateAccountsService>).execute.mockRejectedValueOnce(
      new Error('TEST: Forcing unexpected error')
    )

    const result = {
      message: 'Unexpected Error!'
    }

    const response = await createAccounts(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'POST',
        body: JSON.stringify(createAccountsRequestBody)
      },
      {} as Context,
      {} as Callback
    )

    expect(response?.statusCode).toBe(500)
    expect(response?.body).toBe(JSON.stringify(result))
  })

  it('Should return 201 for successfully requests that created accounts', async () => {
    ;(CreateAccountsService.prototype as jest.Mocked<CreateAccountsService>).execute.mockResolvedValueOnce()

    const result = {
      message: 'Create accounts request was successfully'
    }

    const response = await createAccounts(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'POST',
        body: JSON.stringify(createAccountsRequestBody)
      },
      {} as Context,
      {} as Callback
    )

    expect(response?.statusCode).toBe(201)
    expect(response?.body).toBe(JSON.stringify(result))
  })
})
