import { type CreateAccounts } from '../../functions/accounts/createAccounts/create-accounts.validator'

interface AdditionalFieldsFromFinancialRecordResultFromDynamoDB {
  PK: string
  SK: string
  createdAt: Date
  updatedAt: Date
  currentBalance: number
}

export type Accounts = CreateAccounts
export type AccountsResult = Accounts & AdditionalFieldsFromFinancialRecordResultFromDynamoDB
