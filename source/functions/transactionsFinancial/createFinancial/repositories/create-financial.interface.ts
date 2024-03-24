import { AccountsResult } from '@common/definitions/account.type'
import { UpdateAccount } from '@functions/accounts/updateAccounts/update-accounts.validator'

import { type CreateFinancial } from '../create-financial.validator'

export interface ICreateFinancialRepository {
  getAccount: (AccountUUID: string) => Promise<AccountsResult | undefined>
  createFinancial: (createFranchisesDto: CreateFinancial[]) => Promise<void>
  updateAccount: (financial: AccountsResult, updateAccountDto: UpdateAccount) => Promise<void>
}
