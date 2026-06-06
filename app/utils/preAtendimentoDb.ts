import type { VistoriaFormData } from '~/utils/validation'
import { isValidCpf } from '~/utils/cpf'
import { onlyDigits } from '~/utils/masks'

function normalizePlaca(placa: string) {
  return placa.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export function formToClientePayload(form: VistoriaFormData) {
  return {
    cpf: onlyDigits(form.cpfCliente),
    nome: form.nomeCliente.trim(),
    cep: onlyDigits(form.cep) || null,
    logradouro: form.logradouro.trim() || null,
    complemento: form.complemento.trim() || null,
    bairro: form.bairro.trim() || null,
    cidade: form.cidade.trim() || null,
    uf: form.uf.trim() || null,
    numero_endereco: form.numeroEndereco.trim() || null,
    placa: normalizePlaca(form.placa) || null,
    renavam: onlyDigits(form.renavam) || null,
  }
}

export function formToPreAtendimentoPayload(
  form: VistoriaFormData,
  clienteId: string | null,
  mensagemWhatsapp: string,
) {
  return {
    cliente_id: clienteId,
    nome_cliente: form.nomeCliente.trim(),
    cpf_cliente: onlyDigits(form.cpfCliente),
    titular_diferente: form.titularDiferente,
    nome_titular_laudo: form.titularDiferente ? form.nomeTitularLaudo.trim() : null,
    cpf_titular_laudo: form.titularDiferente ? onlyDigits(form.cpfTitularLaudo) : null,
    condutor_mesmo_cliente: form.condutorMesmoCliente,
    nome_condutor: form.condutorMesmoCliente ? null : form.nomeCondutor.trim(),
    cpf_condutor: form.condutorMesmoCliente ? null : onlyDigits(form.cpfCondutor),
    cep: onlyDigits(form.cep),
    logradouro: form.logradouro.trim(),
    complemento: form.complemento.trim() || null,
    bairro: form.bairro.trim(),
    cidade: form.cidade.trim(),
    uf: form.uf.trim(),
    numero_endereco: form.numeroEndereco.trim(),
    placa: normalizePlaca(form.placa),
    renavam: onlyDigits(form.renavam),
    observacoes_documento: form.observacoesDocumento.trim() || null,
    mensagem_whatsapp: mensagemWhatsapp,
  }
}

export function isValidCpfDigits(cpf: string) {
  return isValidCpf(cpf)
}
