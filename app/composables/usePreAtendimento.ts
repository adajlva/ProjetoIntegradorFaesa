import type { VistoriaFormData } from '~/utils/validation'
import { onlyDigits } from '~/utils/masks'
import type { ClienteRow } from '~/types/database'

function formToClientePayload(form: VistoriaFormData) {
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
  }
}

function formToPreAtendimentoPayload(
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
    placa: form.placa.toUpperCase().replace(/[^A-Z0-9]/g, ''),
    renavam: onlyDigits(form.renavam),
    observacoes_documento: form.observacoesDocumento.trim() || null,
    mensagem_whatsapp: mensagemWhatsapp,
  }
}

export function usePreAtendimento() {
  const { $supabase } = useNuxtApp()

  function requireSupabase() {
    if (!$supabase) {
      throw new Error('Supabase não configurado. Verifique o arquivo .env e reinicie o servidor.')
    }
    return $supabase
  }

  async function findClienteByCpf(cpfDigits: string): Promise<ClienteRow | null> {
    const supabase = requireSupabase()
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('cpf', cpfDigits)
      .maybeSingle()

    if (error) {
      throw error
    }

    return data
  }

  async function savePreAtendimento(form: VistoriaFormData, mensagemWhatsapp: string) {
    const supabase = requireSupabase()
    const clientePayload = formToClientePayload(form)

    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .upsert(clientePayload, { onConflict: 'cpf' })
      .select('id')
      .single()

    if (clienteError) {
      throw clienteError
    }

    const preAtendimentoPayload = formToPreAtendimentoPayload(
      form,
      cliente.id,
      mensagemWhatsapp,
    )

    const { error: preAtendimentoError } = await supabase
      .from('pre_atendimentos')
      .insert(preAtendimentoPayload)

    if (preAtendimentoError) {
      throw preAtendimentoError
    }
  }

  return {
    findClienteByCpf,
    savePreAtendimento,
  }
}
