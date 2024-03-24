import { useValidationSchema } from '@helpers/useValidationSchema'
import * as z from 'zod'

const DeleteFinancialPathParams = z.object({
  uuid: z.string().uuid()
})

export type DeleteFinancialPathParams = z.infer<typeof DeleteFinancialPathParams>

export const useDeleteFinancialValidator = () => {
  return useValidationSchema({
    pathParameters: DeleteFinancialPathParams
  })
}
