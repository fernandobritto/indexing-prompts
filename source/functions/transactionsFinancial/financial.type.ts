import { type CreateFinancial } from './createFinancial/create-financial.validator'

interface AdditionalFieldsFromFinancialRecordResultFromDynamoDB {
  PK: string
  SK: string
  createdAt: Date
  updatedAt: Date
  accountId: string
  description: string
  transactionUUID: string
  customerIDU?: string
  contractId?: string
  serviceId?: string
  category: string
  movementTypes: string
  value: number
  discount?: number
  originalValue?: number
  date: string
}

export type Financial = CreateFinancial
export type FinancialResult = Financial & AdditionalFieldsFromFinancialRecordResultFromDynamoDB
