import { faker } from '@faker-js/faker/locale/pt_BR'
import { generateCpf, generatePassword, generateUUID } from '@tests/utils/helpers'
export function generateCustomer() {
  return {
    id: generateUUID(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    document: generateCpf(),
    mobile: faker.phone.number(),
    activeViva: false
  }
}

export function generateCustomerSignUp() {
  const password = generatePassword()
  return {
    id: generateUUID(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    document: generateCpf(),
    mobile: faker.phone.number(),
    password: password,
    passwordConfirm: password,
    activeViva: false
  }
}
