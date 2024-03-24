import { middyfy } from '@helpers/middfy'
import { type APIGatewayProxyHandler } from 'aws-lambda'

import { useFindFinancialValidator } from '../find-financial.validator'

export const findFinancialMiddleware = (handler: APIGatewayProxyHandler) => {
  return middyfy(handler).use([useFindFinancialValidator()])
}
