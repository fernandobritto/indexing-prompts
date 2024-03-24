import { useDeleteFinancialValidator } from '@functions/transactionsFinancial/deleteFinancial/delete-financial.validator'
import { middyfy } from '@helpers/middfy'
import { type APIGatewayProxyHandler } from 'aws-lambda'

export const deleteFinancialMiddleware = (handler: APIGatewayProxyHandler) => {
  return middyfy(handler).use([useDeleteFinancialValidator()])
}
