import { middyfy } from '@helpers/middfy'
import { type APIGatewayProxyHandler } from 'aws-lambda'

import { useUpdateAccountValidator } from '../update-accounts.validator'

export const updateAccountMiddleware = (handler: APIGatewayProxyHandler) => {
  return middyfy(handler).use([useUpdateAccountValidator()])
}
