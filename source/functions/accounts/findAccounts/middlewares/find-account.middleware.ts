import { middyfy } from '@helpers/middfy'
import { type APIGatewayProxyHandler } from 'aws-lambda'

import { useFindAccountsValidator } from '../find-accounts.validator'

export const findAccountMiddleware = (handler: APIGatewayProxyHandler) => {
  return middyfy(handler).use([useFindAccountsValidator()])
}
