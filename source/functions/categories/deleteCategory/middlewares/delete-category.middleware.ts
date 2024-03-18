import { middyfy } from '@helpers/middfy'
import { APIGatewayProxyHandler } from 'aws-lambda'

import { useDeleteCategoryValidator } from '../delete-category.validator'

export const deleteCategorytMiddleware = (handler: APIGatewayProxyHandler) => {
  return middyfy(handler).use([useDeleteCategoryValidator()])
}
