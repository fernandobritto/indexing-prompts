import { middyfy } from '@helpers/middfy'
import { type APIGatewayProxyHandler } from 'aws-lambda'

import { useUpdateCategoryValidator } from '../update-category.validator'

export const updateCategoryMiddleware = (handler: APIGatewayProxyHandler) => {
  return middyfy(handler).use([useUpdateCategoryValidator()])
}
