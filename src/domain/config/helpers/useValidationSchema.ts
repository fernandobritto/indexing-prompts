import 'reflect-metadata'

import { plainToClass } from 'class-transformer'
import { validateOrReject, ValidationError } from 'class-validator'
import { UnprocessableEntity } from 'http-errors'

export const useValidationSchema = (schema: {
  body?: new () => object
  pathParameters?: new () => object
  queryStringParameters?: new () => object
  headers?: new () => object
}) => {
  const before = async (request: {
    event: {
      body: unknown
      pathParameters: unknown
      queryStringParameters: unknown
      headers: unknown
    }
  }) => {
    try {
      const { headers, pathParameters, queryStringParameters, body } = request.event

      if (schema.headers) {
        const headersInstance = plainToClass(schema.headers, headers)
        await validateOrReject(headersInstance)
      }

      if (schema.pathParameters) {
        const pathParametersInstance = plainToClass(schema.pathParameters, pathParameters ?? {})
        await validateOrReject(pathParametersInstance)
      }

      if (schema.queryStringParameters) {
        const queryStringParametersInstance = plainToClass(schema.queryStringParameters, queryStringParameters ?? {})
        await validateOrReject(queryStringParametersInstance)
      }

      if (schema.body) {
        const bodyInstance = plainToClass(schema.body, body)
        await validateOrReject(bodyInstance)
      }
    } catch (errors) {
      if (errors instanceof Array && errors[0] instanceof ValidationError) {
        const formattedErrors = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints
        }))
        throw new UnprocessableEntity(
          JSON.stringify({
            errors: formattedErrors
          })
        )
      }
      throw errors
    }
  }

  return {
    before
  }
}
