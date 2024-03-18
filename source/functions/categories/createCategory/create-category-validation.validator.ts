import { useValidationSchema } from '@helpers/useValidationSchema'
import * as z from 'zod'

const CreateCategoryValidationSchema = z.object({
  categoryName: z.string().min(3).max(50),
  financeSpot: z.string()
})

const CreateCategoryRequestBody = z.object({
  createCategory: CreateCategoryValidationSchema.array().nonempty()
})

export type CreateCategory = z.infer<typeof CreateCategoryValidationSchema>
export type CreateCategoryRequestBody = z.infer<typeof CreateCategoryRequestBody>

export const useCreateCategoryValidation = () => {
  return useValidationSchema({
    body: CreateCategoryRequestBody
  })
}

export const CreateCategoryRequestBodyZodSchema = CreateCategoryRequestBody
