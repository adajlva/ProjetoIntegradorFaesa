import type { VistoriaFormData } from '~/utils/validation'
import { validateVistoriaForm } from '~/utils/validation'

interface SavePreAtendimentoBody {
  form: VistoriaFormData
  mensagemWhatsapp: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SavePreAtendimentoBody>(event)

  if (!body?.form || typeof body.mensagemWhatsapp !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Payload inválido.' })
  }

  const validationErrors = validateVistoriaForm(body.form)
  const firstError = Object.values(validationErrors)[0]

  if (firstError) {
    throw createError({ statusCode: 400, statusMessage: firstError })
  }

  try {
    return await invokeSavePreAtendimento(body)
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Erro ao salvar pré-atendimento.' })
  }
})
