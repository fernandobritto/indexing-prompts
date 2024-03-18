import { useValidationSchema } from '@helpers/useValidationSchema'
import * as z from 'zod'

const UpdateAccountPathParams = z.object({
  uuid: z.string().uuid()
})

const UpdateAccount = z.object({
  name: z.string().optional(),
  financialInstitution: z.string().optional(),
  currentBalance: z.number().optional()
})

const UpdateAccountRequestBody = z.object({
  updateAccount: UpdateAccount
})

export type UpdateAccountPathParams = z.infer<typeof UpdateAccountPathParams>
export type UpdateAccount = z.infer<typeof UpdateAccount>
export type UpdateAccountRequestBody = z.infer<typeof UpdateAccountRequestBody>

export const useUpdateAccountValidator = () => {
  return useValidationSchema({
    pathParameters: UpdateAccountPathParams,
    body: UpdateAccountRequestBody
  })
}

export const UpdateAccountRequestBodyZodSchema = UpdateAccountRequestBody
