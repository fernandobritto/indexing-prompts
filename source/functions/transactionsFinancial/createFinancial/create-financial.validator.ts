import { MOVEMENT_TYPE, PAYMENT_METHOD_TYPE, TRANSACTION_STATUS, TRANSACTION_TYPE } from '@common/definitions/financial'
import { useValidationSchema } from '@helpers/useValidationSchema'
import * as z from 'zod'

const createFinancial = z.object({
  accountId: z.string(),
  category: z.string(),
  financeSpot: z.string(),
  value: z.number().min(1),
  discount: z.number(),
  description: z.string().min(3).optional(),
  movementTypes: z.nativeEnum(MOVEMENT_TYPE),
  accountTransfer: z.string().uuid().optional(),
  typeTransaction: z.nativeEnum(TRANSACTION_TYPE),
  status: z.nativeEnum(TRANSACTION_STATUS).optional(),
  paymentMethod: z.nativeEnum(PAYMENT_METHOD_TYPE).optional(),
  date: z.string().optional().default(new Date().toISOString())
})

const CreateFinancialRequestBody = z.object({
  transactions: createFinancial.array().nonempty()
})

export type CreateFinancial = z.infer<typeof createFinancial>
export type CreateFinancialRequestBody = z.infer<typeof CreateFinancialRequestBody>

export const useCreateFinancialValidator = () => {
  return useValidationSchema({
    body: CreateFinancialRequestBody
  })
}

export const CreateFinancialRequestBodyZodSchema = CreateFinancialRequestBody
