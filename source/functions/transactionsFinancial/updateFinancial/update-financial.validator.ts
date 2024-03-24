import { MOVEMENT_TYPE, PAYMENT_METHOD_TYPE, TRANSACTION_TYPE } from '@common/definitions/financial'
import { useValidationSchema } from '@helpers/useValidationSchema'
import * as z from 'zod'

const UpdateFinancialPathParams = z.object({
  uuid: z.string().uuid()
})

const UpdateFinancial = z.object({
  accountId: z.string(),
  category: z.string().optional(),
  date: z.string().datetime().optional(),
  value: z.number().min(1).optional(),
  discount: z.number().optional(),
  description: z.string().min(3).optional(),
  movementTypes: z.nativeEnum(MOVEMENT_TYPE),
  typeTransaction: z.nativeEnum(TRANSACTION_TYPE),
  paymentMethod: z.nativeEnum(PAYMENT_METHOD_TYPE).optional()
})

const UpdateFinancialRequestBody = z.object({
  updateFinancial: UpdateFinancial
})

export type UpdateFinancialPathParams = z.infer<typeof UpdateFinancialPathParams>
export type UpdateFinancial = z.infer<typeof UpdateFinancial>
export type UpdateFinancialRequestBody = z.infer<typeof UpdateFinancialRequestBody>

export const useUpdateFinancialValidator = () => {
  return useValidationSchema({
    pathParameters: UpdateFinancialPathParams,

    body: UpdateFinancialRequestBody
  })
}

export const UpdateFinancialRequestBodyZodSchema = UpdateFinancialRequestBody
