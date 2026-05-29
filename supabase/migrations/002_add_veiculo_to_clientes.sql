alter table public.clientes
  add column if not exists placa text,
  add column if not exists renavam text;
