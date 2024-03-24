import { middyfy } from '@helpers/middfy'
import { type APIGatewayProxyHandler } from 'aws-lambda'

import { useUpdateFinancialValidator } from '../update-financial.validator'

export const updateFinancialMiddleware = (handler: APIGatewayProxyHandler) => {
  return middyfy(handler).use([useUpdateFinancialValidator()])
}
