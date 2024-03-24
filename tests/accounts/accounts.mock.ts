import { AccountsResult } from '@common/definitions/account.type'
import { CURRENCY_TYPE, MOVEMENT_TYPE, TRANSACTION_TYPE } from '@common/definitions/financial'
import { faker } from '@faker-js/faker'
import { type CreateAccounts } from '@functions/accounts/createAccounts/create-accounts.validator'
import { FinancialResult } from '@functions/transactionsFinancial/financial.type'

export function createFakeAccounts() {
  const openingBalance = faker.finance.amount()
  const fakeAccount: CreateAccounts = {
    currency: CURRENCY_TYPE.REAL,
    financeSpot: `fs${faker.string.alphanumeric({ casing: 'upper', length: 8 })}`,
    financialInstitution: faker.company.name(),
    accountName: faker.person.fullName(),
    openingBalance: Number(openingBalance),
    currentBalance: Number(openingBalance)
  }

  return fakeAccount
}

export function getFakeAccounts() {
  const fakeDate = new Date()
  const openingBalance = faker.finance.amount()

  const fakeUUID = faker.string.uuid()
  const fakeUUIDFinancialSpot = faker.string.uuid()

  const partitionKey = 'ACCOUNTS'
  const compositeKey = `${partitionKey}#${fakeUUIDFinancialSpot}`

  const fakeAccount: AccountsResult = {
    PK: fakeUUID,
    SK: compositeKey,
    currency: CURRENCY_TYPE.REAL,
    accountName: faker.person.fullName(),
    openingBalance: Number(openingBalance),
    currentBalance: Number(openingBalance),
    financialInstitution: faker.company.name(),
    createdAt: fakeDate,
    updatedAt: fakeDate,
    financeSpot: `fs${faker.string.alphanumeric({ casing: 'upper', length: 8 })}`
  }

  return fakeAccount
}

export function getFakeFinancial() {
  const fakeDate = new Date()
  const fakeUUID = faker.string.uuid()
  const fakeUUIDFinancialSpot = faker.string.uuid()

  const partitionKey = 'FINANCIAL'
  const compositeKey = `${partitionKey}#${fakeUUIDFinancialSpot}`
  const fakeFinancial: FinancialResult = {
    PK: fakeUUID,
    SK: compositeKey,
    transactionUUID: fakeUUID,
    accountId: faker.finance.accountName(),
    category: faker.finance.accountName(),
    date: `${new Date().toISOString().split('T')[0] + 'T00:00:00Z'}`,
    value: Number(faker.finance.amount()),
    discount: Number(faker.finance.amount()),
    createdAt: fakeDate,
    updatedAt: fakeDate,
    movementTypes: MOVEMENT_TYPE.ENTRY,
    typeTransaction: TRANSACTION_TYPE.TRANSACTIONS,
    description: faker.lorem.word({ length: { min: 5, max: 7 } }),
    financeSpot: `fs${faker.string.alphanumeric({ casing: 'upper', length: 8 })}`
  }

  return fakeFinancial
}
