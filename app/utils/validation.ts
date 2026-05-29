import { onlyDigits } from './masks'

export interface VistoriaFormData {
  nomeCliente: string
  cpfCliente: string
  titularDiferente: boolean
  nomeTitularLaudo: string
  cpfTitularLaudo: string
  condutorMesmoCliente: boolean
  nomeCondutor: string
  cpfCondutor: string
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
  numeroEndereco: string
  placa: string
  renavam: string
  observacoesDocumento: string
}

export type VistoriaFormField = Exclude<
  keyof VistoriaFormData,
  'titularDiferente' | 'condutorMesmoCliente'
>

export type VistoriaFormErrors = Partial<Record<VistoriaFormField, string>>

function hasCpfDigits(cpf: string): boolean {
  return onlyDigits(cpf).length === 11
}

function isValidPlaca(placa: string): boolean {
  const normalized = placa.toUpperCase().replace(/[^A-Z0-9]/g, '')
  return normalized.length === 7
    && (/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(normalized)
      || /^[A-Z]{3}[0-9]{4}$/.test(normalized))
}

export function validateVistoriaForm(data: VistoriaFormData): VistoriaFormErrors {
  const errors: VistoriaFormErrors = {}

  if (!data.nomeCliente.trim()) {
    errors.nomeCliente = 'Informe o nome do cliente.'
  }

  if (!hasCpfDigits(data.cpfCliente)) {
    errors.cpfCliente = 'CPF do cliente deve ter 11 dígitos.'
  }

  if (data.titularDiferente) {
    if (!data.nomeTitularLaudo.trim()) {
      errors.nomeTitularLaudo = 'Informe o nome do titular do laudo.'
    }
    if (!hasCpfDigits(data.cpfTitularLaudo)) {
      errors.cpfTitularLaudo = 'CPF do titular do laudo deve ter 11 dígitos.'
    }
  }

  if (!data.condutorMesmoCliente) {
    if (!data.nomeCondutor.trim()) {
      errors.nomeCondutor = 'Informe o nome do condutor.'
    }
    if (!hasCpfDigits(data.cpfCondutor)) {
      errors.cpfCondutor = 'CPF do condutor deve ter 11 dígitos.'
    }
  }

  if (onlyDigits(data.cep).length !== 8) {
    errors.cep = 'CEP deve conter 8 dígitos.'
  }

  if (!data.logradouro.trim()) {
    errors.logradouro = 'Busque um CEP válido para preencher o logradouro.'
  }

  if (!data.bairro.trim()) {
    errors.bairro = 'Busque um CEP válido para preencher o bairro.'
  }

  if (!data.cidade.trim()) {
    errors.cidade = 'Busque um CEP válido para preencher a cidade.'
  }

  if (!data.uf.trim()) {
    errors.uf = 'Busque um CEP válido para preencher o UF.'
  }

  if (!data.numeroEndereco.trim()) {
    errors.numeroEndereco = 'Informe o número do endereço para nota fiscal.'
  } else if (!/^\d+$/.test(data.numeroEndereco)) {
    errors.numeroEndereco = 'Número deve conter apenas dígitos.'
  }

  if (!isValidPlaca(data.placa)) {
    errors.placa = 'Placa inválida. Informe 7 caracteres (ex.: ABC1234 ou ABC1D23).'
  }

  const renavamDigits = onlyDigits(data.renavam)
  if (!renavamDigits) {
    errors.renavam = 'Informe o RENAVAM.'
  } else if (!/^\d+$/.test(renavamDigits)) {
    errors.renavam = 'RENAVAM deve conter apenas números.'
  } else if (renavamDigits.length < 9 || renavamDigits.length > 11) {
    errors.renavam = 'RENAVAM deve ter entre 9 e 11 dígitos.'
  }

  return errors
}

export function resolveTitularLaudo(data: VistoriaFormData) {
  if (data.titularDiferente) {
    return {
      nome: data.nomeTitularLaudo.trim(),
      cpf: data.cpfTitularLaudo.trim(),
    }
  }

  return {
    nome: data.nomeCliente.trim(),
    cpf: data.cpfCliente.trim(),
  }
}

export function resolveCondutor(data: VistoriaFormData) {
  if (data.condutorMesmoCliente) {
    return {
      nome: data.nomeCliente.trim(),
      cpf: data.cpfCliente.trim(),
    }
  }

  return {
    nome: data.nomeCondutor.trim(),
    cpf: data.cpfCondutor.trim(),
  }
}
