import { faker } from '@faker-js/faker/locale/pt_BR'

function calculateCheckerDigit(digits: string, firstCheckerPounds: number[], secondCheckerPounds: number[]): string {
  let firstCheckerDigitSum = 0
  let secondCheckerDigitSum = 0

  for (const [index, digit] of digits.split('').entries()) {
    firstCheckerDigitSum += parseInt(digit, 10) * firstCheckerPounds[index]
    secondCheckerDigitSum += parseInt(digit, 10) * secondCheckerPounds[index]
  }

  firstCheckerDigitSum %= 11

  const firstCheckerDigit = firstCheckerDigitSum < 2 ? 0 : 11 - firstCheckerDigitSum

  secondCheckerDigitSum += firstCheckerDigit * secondCheckerPounds[secondCheckerPounds.length - 1]

  secondCheckerDigitSum %= 11

  const secondCheckerDigit = secondCheckerDigitSum < 2 ? 0 : 11 - secondCheckerDigitSum

  return `${digits}${firstCheckerDigit}${secondCheckerDigit}`
}

export function generateCpf(cleaned = false): string {
  const digits = faker.string.numeric(9)
  const cpf = calculateCheckerDigit(digits, [10, 9, 8, 7, 6, 5, 4, 3, 2], [11, 10, 9, 8, 7, 6, 5, 4, 3, 2])

  if (!cleaned) {
    return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9)}`
  }

  return cpf
}

export function generateUUID() {
  return faker.string.uuid()
}

export function getOnlyNumbers(value: string): string {
  return value.replace(/\D+/gu, '')
}

export function generatePassword(): string {
  return `@${faker.string.alpha(5)}${faker.number.int(10)}`
}
