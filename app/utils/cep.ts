import { onlyDigits } from './masks'

export interface CepAddress {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
}

interface ViaCepResponse {
  cep?: string
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
  erro?: boolean
}

export async function fetchAddressByCep(cep: string): Promise<CepAddress | null> {
  const digits = onlyDigits(cep)

  if (digits.length !== 8) {
    return null
  }

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`)

  if (!response.ok) {
    throw new Error('Falha na consulta do CEP.')
  }

  const data = await response.json() as ViaCepResponse

  if (data.erro) {
    return null
  }

  return {
    cep: data.cep ?? maskCepFromDigits(digits),
    logradouro: data.logradouro?.trim() ?? '',
    complemento: data.complemento?.trim() ?? '',
    bairro: data.bairro?.trim() ?? '',
    cidade: data.localidade?.trim() ?? '',
    uf: data.uf?.trim() ?? '',
  }
}

function maskCepFromDigits(digits: string): string {
  return digits.replace(/(\d{5})(\d{1,3})$/, '$1-$2')
}
