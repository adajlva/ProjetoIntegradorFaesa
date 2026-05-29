-- Clientes reutilizáveis (busca por CPF)
create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  cpf text not null unique,
  nome text not null,
  cep text,
  logradouro text,
  complemento text,
  bairro text,
  cidade text,
  uf text,
  numero_endereco text,
  placa text,
  renavam text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Registros de pré-atendimento (todos os campos do formulário)
create table public.pre_atendimentos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.clientes(id) on delete set null,
  nome_cliente text not null,
  cpf_cliente text not null,
  titular_diferente boolean not null default false,
  nome_titular_laudo text,
  cpf_titular_laudo text,
  condutor_mesmo_cliente boolean not null default true,
  nome_condutor text,
  cpf_condutor text,
  cep text not null,
  logradouro text not null,
  complemento text,
  bairro text not null,
  cidade text not null,
  uf text not null,
  numero_endereco text not null,
  placa text not null,
  renavam text not null,
  observacoes_documento text,
  mensagem_whatsapp text,
  created_at timestamptz not null default now()
);

create index pre_atendimentos_cpf_cliente_idx on public.pre_atendimentos (cpf_cliente);
create index pre_atendimentos_created_at_idx on public.pre_atendimentos (created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger clientes_updated_at
  before update on public.clientes
  for each row execute function public.set_updated_at();

alter table public.clientes enable row level security;
alter table public.pre_atendimentos enable row level security;

create policy "clientes_select_anon" on public.clientes for select to anon, authenticated using (true);
create policy "clientes_insert_anon" on public.clientes for insert to anon, authenticated with check (true);
create policy "clientes_update_anon" on public.clientes for update to anon, authenticated using (true) with check (true);

create policy "pre_atendimentos_select_anon" on public.pre_atendimentos for select to anon, authenticated using (true);
create policy "pre_atendimentos_insert_anon" on public.pre_atendimentos for insert to anon, authenticated with check (true);
