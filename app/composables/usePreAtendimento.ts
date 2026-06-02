import type { VistoriaFormData } from '~/utils/validation'
import type { ClienteRow } from '~/types/database'

export interface ClienteDados {
  cliente: ClienteRow
  placa: string | null
  renavam: string | null
}

export function usePreAtendimento() {
  async function findClienteByCpf(cpfDigits: string): Promise<ClienteDados | null> {
    return await $fetch<ClienteDados | null>(`/api/clientes/${cpfDigits}`)
  }

  async function savePreAtendimento(form: VistoriaFormData, mensagemWhatsapp: string) {
    await $fetch('/api/pre-atendimentos', {
      method: 'POST',
      body: { form, mensagemWhatsapp },
    })
  }

  return {
    findClienteByCpf,
    savePreAtendimento,
  }
}
