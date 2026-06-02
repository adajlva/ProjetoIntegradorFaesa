-- Remove políticas que expõem todas as linhas para anon/authenticated
drop policy if exists "clientes_select_anon" on public.clientes;
drop policy if exists "clientes_insert_anon" on public.clientes;
drop policy if exists "clientes_update_anon" on public.clientes;
drop policy if exists "pre_atendimentos_select_anon" on public.pre_atendimentos;
drop policy if exists "pre_atendimentos_insert_anon" on public.pre_atendimentos;

-- Bloqueia acesso direto via PostgREST (anon key no browser)
revoke all on table public.clientes from anon, authenticated;
revoke all on table public.pre_atendimentos from anon, authenticated;
