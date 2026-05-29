import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

export type AppSupabaseClient = SupabaseClient<Database> | null

declare module '#app' {
  interface NuxtApp {
    $supabase: AppSupabaseClient
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $supabase: AppSupabaseClient
  }
}

export {}
