-- CE Mozambique Operations — initial Supabase schema
-- Run in Supabase SQL Editor after creating your project.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Churches
-- ---------------------------------------------------------------------------
create table if not exists public.churches (
  id text primary key,
  church_name text not null,
  public_name text,
  province text,
  city text,
  district_or_area text,
  type text,
  phone_primary text,
  phone_secondary text,
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Profiles (linked to Supabase Auth users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  church_id text references public.churches (id) on delete set null,
  can_view_all_churches boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- User roles
-- ---------------------------------------------------------------------------
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (
    role in (
      'national_admin',
      'finance_head',
      'finance_officer',
      'church_pastor',
      'viewer'
    )
  ),
  church_id text references public.churches (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, role, church_id)
);

-- ---------------------------------------------------------------------------
-- Members (prepared for future dashboard sync)
-- ---------------------------------------------------------------------------
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  church_id text not null references public.churches (id) on delete restrict,
  nome text not null,
  apelido text,
  telefone text,
  email text,
  celula text,
  grupo_de_celula text,
  estado text default 'Activo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Public giving submissions
-- ---------------------------------------------------------------------------
create table if not exists public.public_giving_submissions (
  id uuid primary key default gen_random_uuid(),
  submission_group_id text not null unique,
  nome_completo text not null,
  data_de_aniversario date,
  telefone text not null,
  email text,
  igreja_id text not null references public.churches (id) on delete restrict,
  igreja_nome text,
  grupo_de_celula text,
  celula text,
  contribuicoes jsonb not null default '[]'::jsonb,
  outros_descricao text,
  metodo_de_pagamento text not null,
  referencia_da_transaccao text,
  data_da_transferencia date not null,
  comprovativo_path text,
  comprovativo_url text,
  mensagem_transferencia text,
  observacoes text,
  total_geral numeric(12, 2) not null default 0,
  source text not null default 'public_website',
  status text not null default 'Pendente de Verificação',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_public_giving_submissions_church
  on public.public_giving_submissions (igreja_id);

create index if not exists idx_public_giving_submissions_status
  on public.public_giving_submissions (status);

-- ---------------------------------------------------------------------------
-- Finance records
-- ---------------------------------------------------------------------------
create table if not exists public.finance_records (
  id uuid primary key default gen_random_uuid(),
  submission_group_id text references public.public_giving_submissions (submission_group_id) on delete set null,
  public_submission_id uuid references public.public_giving_submissions (id) on delete set null,
  church_id text not null references public.churches (id) on delete restrict,
  nome text,
  apelido text,
  telefone text,
  whatsapp text,
  email text,
  celula text,
  grupo_de_celula text,
  data_de_aniversario date,
  categoria_da_contribuicao text not null,
  outros_descricao text,
  valor numeric(12, 2) not null default 0,
  metodo_de_pagamento text not null,
  referencia_da_transaccao text,
  data date not null,
  data_da_transferencia date,
  comprovativo_path text,
  comprovativo_url text,
  mensagem_transferencia text,
  observacoes text,
  estado text not null default 'Pendente de Verificação',
  source text not null default 'public_website',
  source_type text not null default 'public_website',
  recebido_por text,
  verificado_por text,
  verified_at timestamptz,
  comentario_verificacao text,
  motivo_rejeicao text,
  created_at timestamptz not null default now(),
  created_by text,
  updated_at timestamptz not null default now(),
  updated_by text
);

create index if not exists idx_finance_records_church on public.finance_records (church_id);
create index if not exists idx_finance_records_status on public.finance_records (estado);
create index if not exists idx_finance_records_submission_group on public.finance_records (submission_group_id);

-- ---------------------------------------------------------------------------
-- Role helpers
-- ---------------------------------------------------------------------------
create or replace function public.has_role(target_role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = target_role
  );
$$;

create or replace function public.has_finance_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role in ('national_admin', 'finance_head', 'finance_officer', 'church_pastor', 'viewer')
  );
$$;

create or replace function public.can_verify_finance()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role in ('national_admin', 'finance_head')
  );
$$;

create or replace function public.user_church_ids()
returns setof text
language sql
stable
security definer
set search_path = public
as $$
  select p.church_id
  from public.profiles p
  where p.id = auth.uid()
    and p.church_id is not null
  union
  select ur.church_id
  from public.user_roles ur
  where ur.user_id = auth.uid()
    and ur.church_id is not null;
$$;

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.churches enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.members enable row level security;
alter table public.public_giving_submissions enable row level security;
alter table public.finance_records enable row level security;

-- Churches: readable by everyone (public form needs church list)
drop policy if exists "churches_public_read" on public.churches;
create policy "churches_public_read"
  on public.churches for select
  using (true);

-- Profiles: users read/update own profile
drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read"
  on public.profiles for select
  using (auth.uid() = id or public.has_role('national_admin'));

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- User roles: readable by owner or national admin
drop policy if exists "user_roles_read" on public.user_roles;
create policy "user_roles_read"
  on public.user_roles for select
  using (auth.uid() = user_id or public.has_role('national_admin'));

-- Members: finance staff and scoped pastors
drop policy if exists "members_finance_read" on public.members;
create policy "members_finance_read"
  on public.members for select
  using (
    public.has_role('national_admin')
    or public.has_role('finance_head')
    or (
      public.has_role('church_pastor')
      and church_id in (select public.user_church_ids())
    )
  );

-- Public giving: anonymous insert, staff read
drop policy if exists "public_giving_anon_insert" on public.public_giving_submissions;
create policy "public_giving_anon_insert"
  on public.public_giving_submissions for insert
  to anon, authenticated
  with check (
    status = 'Pendente de Verificação'
    and source = 'public_website'
  );

drop policy if exists "public_giving_staff_read" on public.public_giving_submissions;
create policy "public_giving_staff_read"
  on public.public_giving_submissions for select
  using (
    public.has_role('national_admin')
    or public.has_role('finance_head')
    or public.has_role('finance_officer')
    or public.has_role('viewer')
    or (
      public.has_role('church_pastor')
      and igreja_id in (select public.user_church_ids())
    )
  );

drop policy if exists "public_giving_verify_update" on public.public_giving_submissions;
create policy "public_giving_verify_update"
  on public.public_giving_submissions for update
  using (public.can_verify_finance())
  with check (public.can_verify_finance());

-- Finance records
drop policy if exists "finance_anon_insert" on public.finance_records;
create policy "finance_anon_insert"
  on public.finance_records for insert
  to anon, authenticated
  with check (
    estado = 'Pendente de Verificação'
    and source = 'public_website'
  );

drop policy if exists "finance_staff_read" on public.finance_records;
create policy "finance_staff_read"
  on public.finance_records for select
  using (
    public.has_role('national_admin')
    or public.has_role('finance_head')
    or public.has_role('finance_officer')
    or public.has_role('viewer')
    or (
      public.has_role('church_pastor')
      and church_id in (select public.user_church_ids())
    )
  );

drop policy if exists "finance_officer_insert" on public.finance_records;
create policy "finance_officer_insert"
  on public.finance_records for insert
  to authenticated
  with check (
    public.has_role('national_admin')
    or public.has_role('finance_head')
    or public.has_role('finance_officer')
  );

drop policy if exists "finance_verify_update" on public.finance_records;
create policy "finance_verify_update"
  on public.finance_records for update
  using (public.can_verify_finance())
  with check (public.can_verify_finance());

-- ---------------------------------------------------------------------------
-- Storage bucket policies (run after creating bucket "payment-proofs")
-- ---------------------------------------------------------------------------
-- In Supabase Dashboard → Storage → New bucket:
--   Name: payment-proofs
--   Public: true (or use signed URLs later)
--
-- Then run:
/*
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do nothing;

drop policy if exists "payment_proofs_public_upload" on storage.objects;
create policy "payment_proofs_public_upload"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'payment-proofs');

drop policy if exists "payment_proofs_public_read" on storage.objects;
create policy "payment_proofs_public_read"
  on storage.objects for select
  using (bucket_id = 'payment-proofs');

drop policy if exists "payment_proofs_staff_update" on storage.objects;
create policy "payment_proofs_staff_update"
  on storage.objects for update
  using (bucket_id = 'payment-proofs' and public.can_verify_finance())
  with check (bucket_id = 'payment-proofs');
*/

-- ---------------------------------------------------------------------------
-- Seed churches (matches dashboard mock IDs)
-- ---------------------------------------------------------------------------
insert into public.churches (id, church_name, public_name, province, city, type, is_active)
values
  ('church-hq', 'National HQ - Christ Embassy Mozambique', 'Igreja Embaixada de Cristo Maputo', 'Maputo', 'Maputo', 'headquarters', true),
  ('church-matola', 'Igreja Embaixada de Cristo Matola', 'Embaixada de Cristo Matola', 'Maputo', 'Matola', 'branch', true),
  ('church-khongolote', 'Igreja Embaixada de Cristo Khongolote', 'Embaixada de Cristo Khongolote', 'Maputo', 'Khongolote', 'branch', true),
  ('church-choupal', 'Igreja Embaixada de Cristo Choupal', 'Embaixada de Cristo Choupal', 'Maputo', 'Choupal', 'branch', true),
  ('church-beira', 'Igreja Embaixada de Cristo Beira', 'Igreja Embaixada de Cristo Beira', 'Sofala', 'Beira', 'branch', true),
  ('church-nampula', 'Igreja Embaixada de Cristo Nampula', 'Embaixada De Cristo Nampula', 'Nampula', 'Nampula', 'branch', true),
  ('church-virtual', 'CE Mozambique Online Church', 'Igreja Embaixada de Cristo Online', 'Online', 'Online', 'online', true)
on conflict (id) do update set
  church_name = excluded.church_name,
  public_name = excluded.public_name,
  updated_at = now();