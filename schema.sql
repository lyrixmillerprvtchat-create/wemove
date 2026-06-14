create table if not exists payment_requests (
  id uuid primary key default gen_random_uuid(),
  coin_id text not null,
  coin_symbol text not null,
  network text not null,
  wallet_address text not null,
  amount_crypto numeric not null,
  amount_usd numeric not null,
  note text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

alter table payment_requests enable row level security;
create policy "public read" on payment_requests for select using (true);
create policy "public insert" on payment_requests for insert with check (true);
