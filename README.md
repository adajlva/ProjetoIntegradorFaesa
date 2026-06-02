# Stênio Vistoria — Pré-atendimento

Formulário web simples de pré-atendimento para vistoria veicular (Projeto Integrador — Módulo 01/2026, Grupo 36).

## Objetivo

Padronizar a coleta de dados antes da abertura da vistoria e gerar mensagem estruturada para copiar e colar no WhatsApp, reduzindo idas e vindas entre recepção e escritório e erros de digitação.

## Campos (conforme proposta)

| Campo | Obrigatório |
|-------|-------------|
| Nome e CPF do cliente | Sim |
| Titular do laudo (quando diferente do cliente) | Condicional |
| Condutor (ou mesmo cliente) | Sim |
| CEP e número para nota fiscal | Sim |
| Placa e RENAVAM | Sim |
| Observações sobre documento | Não |

## Validações (MVP)

- Campos obrigatórios vazios
- Tamanho da placa (7 caracteres: ABC1234 ou ABC1D23)
- Apenas números onde couber: CPF (11 dígitos), CEP (8), RENAVAM, número do endereço

## Persistência (Supabase)

Os dados do formulário são salvos no banco Supabase ao clicar em **Gerar mensagem**:

- **`clientes`** — cadastro reutilizável por CPF (nome e endereço para nota fiscal)
- **`pre_atendimentos`** — histórico completo de cada pré-atendimento (todos os campos da tela + mensagem WhatsApp)

Ao digitar um CPF com 11 dígitos, o sistema consulta `clientes` e preenche automaticamente os dados encontrados.

### Configuração

Copie `.env.example` para `.env` e preencha as variáveis do projeto Supabase (**somente no servidor**, nunca no front):

```bash
NUXT_SUPABASE_URL=...
NUXT_SUPABASE_ANON_KEY=...
```

A chave **anon** fica em *Project Settings → API* no dashboard Supabase. Ela fica só no servidor Nuxt (não é exposta ao browser). O acesso ao banco usa Edge Functions (`get-cliente-by-cpf`, `save-pre-atendimento`) com `service_role` injetada pelo Supabase — você não precisa colar a service role no `.env`.

As migrations SQL estão em `supabase/migrations/`. A `002_lock_down_anon_access.sql` revoga acesso direto via anon key (PostgREST) às tabelas `clientes` e `pre_atendimentos`. O front chama rotas Nitro (`/api/clientes/:cpf`, `/api/pre-atendimentos`), que invocam as Edge Functions.

**Deploy:** use `npm run build` + servidor Nitro (`node .output/server/index.mjs`). Export estático (`nuxt generate`) não inclui a API.

## LGPD

Os dados pessoais são armazenados no Supabase para reutilização em novos pré-atendimentos. O navegador não acessa o PostgREST diretamente; consultas passam pelo backend e pelas Edge Functions. Em produção, revise políticas de retenção, consentimento e autenticação da equipe.

## Componentes

Os componentes do design system ficam em `app/components/` (atoms e molecules), copiados do backoffice DMPeople para uso local neste projeto.

## Como executar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Publicar no GitHub

1. Crie um repositório vazio no GitHub (sem README inicial).
2. Na pasta do projeto:

```bash
git init
git add .
git commit -m "Projeto Integrador — pré-atendimento Stênio Vistoria"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

O arquivo `.env` não é versionado. Use `.env.example` como referência das variáveis necessárias.

## Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e importe o repositório do GitHub.
2. A Vercel detecta **Nuxt.js** automaticamente (`vercel.json` já está configurado).
3. Em **Settings → Environment Variables**, adicione:

| Variável | Descrição |
|----------|-----------|
| `NUXT_SUPABASE_URL` | URL do projeto Supabase |
| `NUXT_SUPABASE_ANON_KEY` | Chave anon do Supabase (somente servidor) |

4. Faça o deploy. Cada push na branch `main` gera um novo deploy.

**Build local (opcional):**

```bash
npm run build
npm run preview
```

## Evidências

"PENDÊNTE"

## Grupo 36 — FAESA

Adailton Junior Neres Silva; Andressa Lucatelli Caetano de Souza; Icaro Lyra Rangel Tércio; Lucas Gomes; Otávio Wolff Buffon; Yuri Toraz Maia.
