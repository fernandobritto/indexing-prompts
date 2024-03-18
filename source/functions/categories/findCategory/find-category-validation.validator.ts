import { useValidationSchema } from '@helpers/useValidationSchema'
import * as z from 'zod'

const FindCategoryHeaderParams = z.object({
  financeSpot: z.string().min(5)
})

const FindCategory = z
  .object({
    LastEvaluatedKey: z.object({}).optional()
  })
  .optional()

export type FindCategoryQueryStringParameters = z.infer<typeof FindCategory>
export type FindCategoryHeaderParams = z.infer<typeof FindCategoryHeaderParams>

export const useFindCategoriesValidator = () => {
  return useValidationSchema({
    queryStringParameters: FindCategory,
    headers: FindCategoryHeaderParams
  })
}
