import { middyfy } from '@helpers/middfy'
import { type APIGatewayProxyHandler } from 'aws-lambda'

import { useCreateFinancialValidator } from '../create-financial.validator'

export const createFinancialMiddleware = (handler: APIGatewayProxyHandler) => {
  return middyfy(handler).use([useCreateFinancialValidator()])
}
