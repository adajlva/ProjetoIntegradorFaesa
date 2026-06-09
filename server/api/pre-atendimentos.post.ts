import { sanitizeVistoriaForm, sanitizeInput, type VistoriaFormData } from '../utils/supabaseFunctions'
import { invokeSavePreAtendimento } from '../utils/supabaseFunctions'

interface SavePreAtendimentoBody {
  form: VistoriaFormData
  mensagemWhatsapp: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SavePreAtendimentoBody>(event)

  if (!body?.form || typeof body.mensagemWhatsapp !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Payload inválido.' })
  }

  const sanitizedForm = sanitizeVistoriaForm(body.form)
  const sanitizedMensagem = sanitizeInput(body.mensagemWhatsapp)

  try {
    return await invokeSavePreAtendimento({
      form: sanitizedForm,
      mensagemWhatsapp: sanitizedMensagem,
    })
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Erro ao salvar pré-atendimento.' })
  }
})
