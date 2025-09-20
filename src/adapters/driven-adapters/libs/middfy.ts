import middy from '@middy/core'
import errorLogger from '@middy/error-logger'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import httpUrlEncodePathParser from '@middy/http-urlencode-path-parser'
import securityHeadersMiddleware from './security-headers'
import { APIGatewayProxyHandler } from 'aws-lambda'

export const middyfy = (handler: APIGatewayProxyHandler) => {
  return middy(handler)
    .use(errorLogger())
    .use({
      before: async (request) => {
        if (!request.event.body || request.event.body === '') return

        const jsonParserMiddleware = middyJsonBodyParser()
        if (jsonParserMiddleware.before) {
          await jsonParserMiddleware.before(request)
        }
      }
    })
    .use(httpUrlEncodePathParser())
    .use(cors())
    .use(httpErrorHandler())
    .use(securityHeadersMiddleware())
}
