import { AccountsResult } from '@common/definitions/account.type'
import { CreateFinancial } from '@functions/transactionsFinancial/createFinancial/create-financial.validator'

import { UpdateAccount } from '../update-accounts.validator'

export interface IUpdateAccountRepository {
  getAccount: (AccountUUID: string) => Promise<AccountsResult | undefined>
  updateAccount: (financial: AccountsResult, updateAccountDto: UpdateAccount) => Promise<void>
  createFinancial: (createFranchisesDto: CreateFinancial[]) => Promise<void>
}
