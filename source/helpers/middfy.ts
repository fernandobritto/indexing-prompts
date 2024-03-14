import middy from '@middy/core'
import errorLogger from '@middy/error-logger'
import eventNormalizerMiddleware from '@middy/event-normalizer'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import httpUrlEncodePathParser from '@middy/http-urlencode-path-parser'
import { type APIGatewayProxyHandler, SQSHandler } from 'aws-lambda'

export const middyfy = (handler: APIGatewayProxyHandler) => {
  return middy(handler)
    .use(errorLogger())
    .use(middyJsonBodyParser())
    .use(httpUrlEncodePathParser())
    .use(cors())
    .use(httpErrorHandler())
}

export const middyfySqsEvent = (handler: SQSHandler) => {
  return middy(handler).use(errorLogger()).use(eventNormalizerMiddleware())
}
