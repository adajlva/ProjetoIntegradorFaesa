import { onlyDigits } from './masks'

export function isValidCpf(cpf: string): boolean {
  const digits = onlyDigits(cpf)

  if (!/^\d{11}$/.test(digits) || /^(\d)\1{10}$/.test(digits)) {
    return false
  }

  const calculateCheckDigit = (length: number) => {
    const sum = digits
      .slice(0, length)
      .split('')
      .reduce((total, digit, index) => total + Number(digit) * (length + 1 - index), 0)

    const remainder = (sum * 10) % 11
    return remainder === 10 ? 0 : remainder
  }

  return calculateCheckDigit(9) === Number(digits[9])
    && calculateCheckDigit(10) === Number(digits[10])
}
