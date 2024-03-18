import { middyfy } from '@helpers/middfy'
import { type APIGatewayProxyHandler } from 'aws-lambda'

import { useCreateCategoryValidation } from '../create-category-validation.validator'

export const createCategoryValidationMiddleware = (handler: APIGatewayProxyHandler) => {
  return middyfy(handler).use([useCreateCategoryValidation()])
}
