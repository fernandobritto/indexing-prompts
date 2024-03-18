import { middyfy } from '@helpers/middfy'
import { type APIGatewayProxyHandler } from 'aws-lambda'

import { useCreateAccountsValidator } from '../create-accounts.validator'

export const createAccountsMiddleware = (handler: APIGatewayProxyHandler) => {
  return middyfy(handler).use([useCreateAccountsValidator()])
}
