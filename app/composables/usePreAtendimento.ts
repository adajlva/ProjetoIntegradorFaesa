import type { VistoriaFormData } from '~/utils/validation'
import { onlyDigits } from '~/utils/masks'
import type { ClienteRow } from '~/types/database'

export interface ClienteDados {
  cliente: ClienteRow
  placa: string | null
  renavam: string | null
}

function normalizePlaca(placa: string) {
  return placa.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

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
    placa: normalizePlaca(form.placa) || null,
    renavam: onlyDigits(form.renavam) || null,
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
    placa: normalizePlaca(form.placa),
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

  async function findUltimoVeiculoByCpf(cpfDigits: string) {
    const supabase = requireSupabase()
    const { data, error } = await supabase
      .from('pre_atendimentos')
      .select('placa, renavam')
      .eq('cpf_cliente', cpfDigits)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      throw error
    }

    return data
  }

  async function findClienteByCpf(cpfDigits: string): Promise<ClienteDados | null> {
    const supabase = requireSupabase()
    const { data: cliente, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('cpf', cpfDigits)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (!cliente) {
      return null
    }

    let placa = cliente.placa
    let renavam = cliente.renavam

    if (!placa || !renavam) {
      const ultimoVeiculo = await findUltimoVeiculoByCpf(cpfDigits)
      placa = placa ?? ultimoVeiculo?.placa ?? null
      renavam = renavam ?? ultimoVeiculo?.renavam ?? null
    }

    return { cliente, placa, renavam }
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
