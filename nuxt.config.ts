import { resolve } from 'node:path'
import { loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const env = loadEnv(process.env.NODE_ENV ?? 'development', resolve('.'), '')

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  future: {
    compatibilityVersion: 4,
  },

  ssr: false,
  devtools: { enabled: false },

  experimental: {
    viteEnvironmentApi: true,
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    supabaseUrl:
      process.env.NUXT_SUPABASE_URL
      ?? env.NUXT_SUPABASE_URL
      ?? process.env.NUXT_PUBLIC_SUPABASE_URL
      ?? env.NUXT_PUBLIC_SUPABASE_URL
      ?? '',
    supabaseAnonKey:
      process.env.NUXT_SUPABASE_ANON_KEY
      ?? env.NUXT_SUPABASE_ANON_KEY
      ?? process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY
      ?? env.NUXT_PUBLIC_SUPABASE_ANON_KEY
      ?? '',
  },

  app: {
    head: {
      title: 'Stênio Vistoria — Pré-atendimento',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Formulário de pré-atendimento para vistoria veicular com geração de mensagem para WhatsApp.',
        },
      ],
    },
  },
})
