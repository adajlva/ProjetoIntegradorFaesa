import type { VistoriaFormData } from './validation'
import { resolveCondutor, resolveTitularLaudo } from './validation'

export function buildWhatsappMessage(data: VistoriaFormData): string {
  const titular = resolveTitularLaudo(data)
  const condutor = resolveCondutor(data)

  const lines = [
    '*PRÉ-ATENDIMENTO — STÊNIO VISTORIA VEICULAR*',
    '',
    '*Cliente*',
    `Nome do cliente: ${data.nomeCliente.trim()}`,
    `CPF do cliente: ${data.cpfCliente.trim()}`,
    '',
    '*Titular do laudo*',
    `Nome no laudo: ${titular.nome}`,
    `CPF no laudo: ${titular.cpf}`,
    '',
    '*Condutor*',
    `Nome do condutor: ${condutor.nome}`,
    `CPF do condutor: ${condutor.cpf}`,
    '',
    '*Endereço para nota fiscal*',
    `CEP: ${data.cep.trim()}`,
    `Logradouro: ${data.logradouro.trim()}`,
    `Número: ${data.numeroEndereco.trim()}`,
  ]

  if (data.complemento.trim()) {
    lines.push(`Complemento: ${data.complemento.trim()}`)
  }

  lines.push(
    `Bairro: ${data.bairro.trim()}`,
    `Cidade: ${data.cidade.trim()}`,
    `UF: ${data.uf.trim()}`,
    '',
    '*Veículo*',
    `Placa: ${data.placa.trim().toUpperCase()}`,
    `RENAVAM: ${data.renavam.trim()}`,
  )

  if (data.observacoesDocumento.trim()) {
    lines.push(
      '',
      '*Observações sobre documento*',
      data.observacoesDocumento.trim(),
    )
  }

  lines.push(
    '',
    '_Mensagem gerada pelo formulário de pré-atendimento. Dados não são armazenados (LGPD)._',
  )

  return lines.join('\n')
}
