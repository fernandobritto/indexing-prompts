import { middyfy } from '@helpers/middfy'
import { type APIGatewayProxyHandler } from 'aws-lambda'

import { useFindCategoriesValidator } from '../find-category-validation.validator'

export const findCategoriesMiddleware = (handler: APIGatewayProxyHandler) => {
  return middyfy(handler).use([useFindCategoriesValidator()])
}
