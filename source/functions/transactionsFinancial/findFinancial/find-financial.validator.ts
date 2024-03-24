import { MOVEMENT_TYPE, TRANSACTION_TYPE } from '@common/definitions/financial'
import { useValidationSchema } from '@helpers/useValidationSchema'
import * as z from 'zod'

const FindFinancialHeaderParams = z.object({
  financeSpot: z.string().min(5)
})

const FindFinancial = z
  .object({
    LastEvaluatedKey: z.object({}).optional(),
    transactionUUID: z.string().uuid().optional(),
    movementTypes: z.nativeEnum(MOVEMENT_TYPE).optional(),
    accountId: z.string().uuid().optional(),
    customerIDU: z.string().uuid().optional(),
    typeTransaction: z.nativeEnum(TRANSACTION_TYPE)
  })
  .optional()

export type FindFinancialQueryStringParameters = z.infer<typeof FindFinancial>
export type FindFinancialHeaderParams = z.infer<typeof FindFinancialHeaderParams>

export const useFindFinancialValidator = () => {
  return useValidationSchema({
    queryStringParameters: FindFinancial,
    headers: FindFinancialHeaderParams
  })
}
