import { AccountsResult } from '@common/definitions/account.type'
import { type UpdateAccount } from '@functions/accounts/updateAccounts/update-accounts.validator'
import { type FinancialResult } from '@functions/transactionsFinancial/financial.type'

import { type UpdateFinancial } from '../update-financial.validator'

export interface IUpdateFinancialRepository {
  getFinancial: (FinancialUUID: string) => Promise<FinancialResult | undefined>
  updateFinancial: (financial: FinancialResult, updateFinancialDto: UpdateFinancial) => Promise<void>
  getAccount: (AccountUUID: string) => Promise<AccountsResult | undefined>
  updateAccount: (financial: AccountsResult, updateAccountDto: UpdateAccount) => Promise<void>
}
