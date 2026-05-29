export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function maskCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function maskCep(value: string): string {
  const digits = onlyDigits(value).slice(0, 8)
  return digits.replace(/(\d{5})(\d{1,3})$/, '$1-$2')
}

export function maskPlaca(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 7)
}

export function maskRenavam(value: string): string {
  return onlyDigits(value).slice(0, 11)
}

export function maskNumero(value: string): string {
  return onlyDigits(value)
}
