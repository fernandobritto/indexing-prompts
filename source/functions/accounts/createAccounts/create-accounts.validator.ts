import { ACCOUNT_TYPE, CURRENCY_TYPE } from '@common/definitions/financial'
import { useValidationSchema } from '@helpers/useValidationSchema'
import * as z from 'zod'

const createAccount = z.object({
  financeSpot: z.string(),
  accountName: z.string(),
  financialInstitution: z.string(),
  openingBalance: z.number().min(1),
  currentBalance: z.number().optional(),
  currency: z.nativeEnum(CURRENCY_TYPE),
  accountType: z.nativeEnum(ACCOUNT_TYPE).optional(),
  description: z.string().optional()
})

const CreateAccountRequestBody = z.object({
  accounts: createAccount.array().nonempty()
})

export type CreateAccounts = z.infer<typeof createAccount>
export type CreateAccountsRequestBody = z.infer<typeof CreateAccountRequestBody>

export const useCreateAccountsValidator = () => {
  return useValidationSchema({
    body: CreateAccountRequestBody
  })
}

export const CreateAccountsRequestBodyZodSchema = CreateAccountRequestBody
