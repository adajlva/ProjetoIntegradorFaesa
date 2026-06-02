import type { ClienteDados } from '~/composables/usePreAtendimento'
import { isValidCpfDigits } from '~/utils/preAtendimentoDb'

export default defineEventHandler(async (event): Promise<ClienteDados | null> => {
  const cpfParam = getRouterParam(event, 'cpf') ?? ''
  const cpfDigits = cpfParam.replace(/\D/g, '')

  if (!isValidCpfDigits(cpfDigits)) {
    throw createError({ statusCode: 400, statusMessage: 'CPF inválido.' })
  }

  try {
    return await invokeGetClienteByCpf(cpfDigits)
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Erro ao consultar cliente.' })
  }
})
