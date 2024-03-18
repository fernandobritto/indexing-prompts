import { useValidationSchema } from '@helpers/useValidationSchema'
import * as z from 'zod'

const DeleteCategoryPathParams = z.object({
  uuid: z.string().uuid()
})

export type DeleteCategoryPathParams = z.infer<typeof DeleteCategoryPathParams>

export const useDeleteCategoryValidator = () => {
  return useValidationSchema({
    pathParameters: DeleteCategoryPathParams
  })
}
