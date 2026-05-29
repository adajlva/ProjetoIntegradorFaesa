import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

function createSupabaseClient(): SupabaseClient<Database> | null {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  const key = config.public.supabaseAnonKey

  if (!url || !key) {
    console.warn(
      '[supabase] Configure NUXT_PUBLIC_SUPABASE_URL e NUXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env',
    )
    return null
  }

  return createClient<Database>(url, key)
}

export default defineNuxtPlugin(() => {
  const supabase = createSupabaseClient()

  return {
    provide: {
      supabase,
    },
  }
})
