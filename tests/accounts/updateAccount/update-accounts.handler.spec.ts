import { updateAccount } from '@functions/accounts/updateAccounts/handler'
import { UpdateAccountService } from '@functions/accounts/updateAccounts/update-accounts.service'
import { mockedApiGatewayEvent } from '@tests/utils/mockedApiGatewayEvent'
import { type Callback, type Context } from 'aws-lambda'
import { BadRequest } from 'http-errors'

import { updateAccountsStub } from './update-accounts.mock'

jest.mock('@functions/accounts/updateAccounts/update-accounts.service')

describe('UpdateAccount Handler unit tests', () => {
  let fakeAccount
  let fakeAccountUpdate
  let header

  beforeAll(async () => {
    fakeAccount = updateAccountsStub().fakeAccounts
    fakeAccountUpdate = updateAccountsStub().fakeAccountsUpdate
  })

  it('Should return status code 422 for invalid request params', async () => {
    const response = await updateAccount(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'PUT',

        pathParameters: {
          uuid: fakeAccount.PK
        },
        body: JSON.stringify({
          updateAccount: {
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

    ;(UpdateAccountService.prototype as jest.Mocked<UpdateAccountService>).execute.mockRejectedValueOnce(
      BadRequest(result.message)
    )

    const response = await updateAccount(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'PUT',
        headers: header,
        pathParameters: {
          uuid: fakeAccount.PK
        },
        body: JSON.stringify({
          updateAccount: fakeAccountUpdate
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

    ;(UpdateAccountService.prototype as jest.Mocked<UpdateAccountService>).execute.mockRejectedValueOnce(
      new Error('TEST: Forcing unexpected error')
    )

    const response = await updateAccount(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'PUT',
        headers: header,
        pathParameters: {
          uuid: fakeAccount.PK
        },
        body: JSON.stringify({
          updateAccount: fakeAccountUpdate
        })
      },
      {} as Context,
      {} as Callback
    )

    expect(response?.statusCode).toBe(500)
    expect(response?.body).toBe(JSON.stringify(result))
  })

  it('Should return 200 for successfully requests that update a account', async () => {
    ;(UpdateAccountService.prototype as jest.Mocked<UpdateAccountService>).execute.mockResolvedValueOnce()

    const response = await updateAccount(
      {
        ...mockedApiGatewayEvent,
        httpMethod: 'PUT',
        headers: header,
        pathParameters: {
          uuid: fakeAccount.PK
        },
        body: JSON.stringify({
          updateAccount: fakeAccountUpdate
        })
      },
      {} as Context,
      {} as Callback
    )

    expect(response?.statusCode).toBe(200)
    expect(response?.body).toBe(
      JSON.stringify({
        message: 'Update accounts request was successfully!'
      })
    )
  })
})
