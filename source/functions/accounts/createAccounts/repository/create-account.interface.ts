import { type CreateAccounts } from '../create-accounts.validator'

export interface ICreateAccountsRepository {
  createAccounts: (createFranchisesDto: CreateAccounts[]) => Promise<void>
}
