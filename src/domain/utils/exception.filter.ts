import { BaseError } from '@domain/errors/base-error'
import { APIGatewayProxyResult } from 'aws-lambda'

export class ExceptionFilter {
  public static catch(error: unknown): APIGatewayProxyResult {
    if (error instanceof BaseError) {
      return {
        statusCode: this.getStatusCode(error.code),
        body: JSON.stringify({
          code: error.code,
          message: error.message,
          parameters: error.parameters
        })
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        code: 'InternalServerError',
        message: 'An unexpected error occurred.'
      })
    }
  }

  private static getStatusCode(errorCode: string): number {
    const errorMap: Record<string, number> = {
      NotFound: 404,
      InvalidArgument: 400,
      InvalidRequest: 400,
      AlreadyExists: 409,
      UnImplemented: 501,
      Unauthorized: 401,
      InternalServer: 500,
      ProviderInternalValidation: 502,
      IntegrationExternalService: 503,
      IntegrationServiceUnauthorized: 401
    }

    return errorMap[errorCode] || 500
  }
}
