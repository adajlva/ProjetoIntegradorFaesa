function requireSupabaseConfig() {
  const config = useRuntimeConfig()

  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw createError({
      statusCode: 500,
      statusMessage:
        'Supabase não configurado no servidor. Defina NUXT_SUPABASE_URL e NUXT_SUPABASE_ANON_KEY.',
    })
  }

  return config
}

function supabaseFunctionHeaders(anonKey: string) {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  }
}

export async function invokeGetClienteByCpf(cpfDigits: string) {
  const config = requireSupabaseConfig()
  const url = new URL(`${config.supabaseUrl}/functions/v1/get-cliente-by-cpf`)
  url.searchParams.set('cpf', cpfDigits)

  return await $fetch(url.toString(), {
    headers: supabaseFunctionHeaders(config.supabaseAnonKey),
  })
}

export async function invokeSavePreAtendimento(body: { form: unknown; mensagemWhatsapp: string }) {
  const config = requireSupabaseConfig()

  return await $fetch(`${config.supabaseUrl}/functions/v1/save-pre-atendimento`, {
    method: 'POST',
    headers: {
      ...supabaseFunctionHeaders(config.supabaseAnonKey),
      'Content-Type': 'application/json',
    },
    body,
  })
}
