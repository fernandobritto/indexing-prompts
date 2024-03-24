import { type FinancialResult } from '@functions/transactionsFinancial/financial.type'

export interface IDeleteFinancialRepository {
  getFinancial: (FinancialUUID: string) => Promise<FinancialResult | undefined>
  deleteFinancial: (Financial: FinancialResult) => Promise<void>
}
