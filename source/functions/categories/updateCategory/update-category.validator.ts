import { useValidationSchema } from '@helpers/useValidationSchema'
import * as z from 'zod'

const UpdateCategoryPathParams = z.object({
  uuid: z.string().uuid()
})

const UpdateCategoryHeaderParams = z.object({
  financeSpot: z.string()
})

const UpdateCategory = z.object({
  categoryName: z.string().min(3).max(50)
})

const UpdateCategoryRequestBody = z.object({
  updateCategory: UpdateCategory
})

export type UpdateCategoryPathParams = z.infer<typeof UpdateCategoryPathParams>
export type UpdateCategoryHeaderParams = z.infer<typeof UpdateCategoryHeaderParams>
export type UpdateCategory = z.infer<typeof UpdateCategory>
export type UpdateCategoryRequestBody = z.infer<typeof UpdateCategoryRequestBody>

export const useUpdateCategoryValidator = () => {
  return useValidationSchema({
    pathParameters: UpdateCategoryPathParams,
    headers: UpdateCategoryHeaderParams,
    body: UpdateCategoryRequestBody
  })
}

export const UpdateCategoryRequestBodyZodSchema = UpdateCategoryRequestBody
