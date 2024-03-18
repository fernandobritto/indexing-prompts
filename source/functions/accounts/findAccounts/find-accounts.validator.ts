import { useValidationSchema } from '@helpers/useValidationSchema'
import * as z from 'zod'

const FindAccountHeaderParams = z.object({
  financeSpot: z.string().min(5)
})

const FindAccount = z
  .object({
    LastEvaluatedKey: z.object({}).optional()
  })
  .optional()

export type FindAccountsQueryStringParameters = z.infer<typeof FindAccount>
export type FindAccountHeaderParams = z.infer<typeof FindAccountHeaderParams>

export const useFindAccountsValidator = () => {
  return useValidationSchema({
    queryStringParameters: FindAccount,
    headers: FindAccountHeaderParams
  })
}
