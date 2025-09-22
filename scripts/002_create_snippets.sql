-- Create snippets table
create table if not exists public.snippets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  code text not null,
  language text not null,
  tags text[] default '{}',
  is_favorite boolean default false,
  is_public boolean default false,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.snippets enable row level security;

-- Create RLS policies
create policy "snippets_select_own"
  on public.snippets for select
  using (auth.uid() = user_id);

create policy "snippets_insert_own"
  on public.snippets for insert
  with check (auth.uid() = user_id);

create policy "snippets_update_own"
  on public.snippets for update
  using (auth.uid() = user_id);

create policy "snippets_delete_own"
  on public.snippets for delete
  using (auth.uid() = user_id);

-- Create index for better performance
create index if not exists snippets_user_id_idx on public.snippets(user_id);
create index if not exists snippets_created_at_idx on public.snippets(created_at desc);
