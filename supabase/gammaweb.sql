-- =====================================================================
-- GammaWeb — skema Supabase. Jalankan SEKALI di Supabase > SQL Editor.
-- Aman dijalankan ulang (idempotent). Semua tabel berawalan gw_ supaya
-- bisa berbagi project Supabase dengan web lain (mis. undangan).
--
-- PENTING: ganti email pemilik di fungsi gw_is_owner() bila berbeda,
-- dan samakan dengan NEXT_PUBLIC_OWNER_EMAIL di GitHub.
-- =====================================================================

-- Pemilik = akun dengan email ini yang sudah dikonfirmasi.
create or replace function public.gw_is_owner() returns boolean
language sql stable security definer set search_path = public, auth as $$
  select exists (
    select 1 from auth.users
    where id = auth.uid()
      and lower(email) = lower('yatufht@gmail.com')
      and email_confirmed_at is not null
  )
$$;

-- ---------- Tabel ----------
create table if not exists public.gw_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.gw_categories (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  slug text not null,
  jenis text not null default 'jasa' check (jenis in ('jasa', 'produk')),
  urutan int not null default 0
);

create table if not exists public.gw_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nama text not null,
  jenis text not null default 'jasa' check (jenis in ('jasa', 'produk')),
  kategori_id uuid references public.gw_categories(id) on delete set null,
  harga int not null default 0 check (harga >= 0),
  harga_coret int not null default 0 check (harga_coret >= 0),
  ringkas text not null default '',
  deskripsi text not null default '',
  gambar_url text not null default '',
  fitur text[] not null default '{}',
  aktif boolean not null default true,
  urutan int not null default 0,
  contoh boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.gw_orders (
  id uuid primary key default gen_random_uuid(),
  kode text unique,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  user_nama text not null default '',
  user_email text not null default '',
  user_wa text not null default '',
  product_id uuid references public.gw_products(id) on delete set null,
  product_nama text not null default '',
  product_slug text not null default '',
  jenis text not null default 'jasa',
  harga int not null default 0,
  qty int not null default 1 check (qty between 1 and 99),
  total int not null default 0,
  catatan text not null default '',
  catatan_pemilik text not null default '',
  status text not null default 'menunggu' check (status in ('menunggu', 'diproses', 'selesai', 'dibatalkan')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.gw_products add column if not exists link text not null default '';

create index if not exists gw_orders_user on public.gw_orders (user_id, created_at desc);

create table if not exists public.gw_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nama text not null,
  rating int not null check (rating between 1 and 5),
  teks text not null check (char_length(teks) between 5 and 1000),
  status text not null default 'tampil' check (status in ('tampil', 'disembunyikan')),
  created_at timestamptz not null default now()
);

-- ---------- Trigger: data penting diisi database, bukan browser ----------
-- Harga, total, nama produk, dan kode pesanan selalu diambil dari tabel produk,
-- jadi pelanggan tidak bisa mengubah harga lewat browser.
create or replace function public.gw_order_fill() returns trigger
language plpgsql security definer set search_path = public as $$
declare p public.gw_products;
begin
  select * into p from public.gw_products where id = new.product_id and aktif;
  if not found then
    raise exception 'Produk tidak ditemukan atau sedang tidak tersedia.';
  end if;
  new.user_id := auth.uid();
  new.user_email := coalesce(auth.jwt() ->> 'email', '');
  new.product_nama := p.nama;
  new.product_slug := p.slug;
  new.jenis := p.jenis;
  new.harga := p.harga;
  new.qty := coalesce(new.qty, 1);
  new.total := p.harga * new.qty;
  new.status := 'menunggu';
  new.catatan_pemilik := '';
  new.kode := 'GW-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
  new.created_at := now();
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists gw_order_fill on public.gw_orders;
create trigger gw_order_fill before insert on public.gw_orders
  for each row execute function public.gw_order_fill();

create or replace function public.gw_review_fill() returns trigger
language plpgsql as $$
begin
  new.user_id := auth.uid();
  new.status := 'tampil';
  new.created_at := now();
  return new;
end $$;
drop trigger if exists gw_review_fill on public.gw_reviews;
create trigger gw_review_fill before insert on public.gw_reviews
  for each row execute function public.gw_review_fill();

-- ---------- Row Level Security ----------
alter table public.gw_settings enable row level security;
alter table public.gw_categories enable row level security;
alter table public.gw_products enable row level security;
alter table public.gw_orders enable row level security;
alter table public.gw_reviews enable row level security;

drop policy if exists gw_settings_read on public.gw_settings;
drop policy if exists gw_settings_write on public.gw_settings;
create policy gw_settings_read on public.gw_settings for select using (true);
create policy gw_settings_write on public.gw_settings for all using (public.gw_is_owner()) with check (public.gw_is_owner());

drop policy if exists gw_categories_read on public.gw_categories;
drop policy if exists gw_categories_write on public.gw_categories;
create policy gw_categories_read on public.gw_categories for select using (true);
create policy gw_categories_write on public.gw_categories for all using (public.gw_is_owner()) with check (public.gw_is_owner());

drop policy if exists gw_products_read on public.gw_products;
drop policy if exists gw_products_write on public.gw_products;
create policy gw_products_read on public.gw_products for select using (aktif or public.gw_is_owner());
create policy gw_products_write on public.gw_products for all using (public.gw_is_owner()) with check (public.gw_is_owner());

drop policy if exists gw_orders_read on public.gw_orders;
drop policy if exists gw_orders_insert on public.gw_orders;
drop policy if exists gw_orders_owner_update on public.gw_orders;
drop policy if exists gw_orders_owner_delete on public.gw_orders;
create policy gw_orders_read on public.gw_orders for select using (user_id = auth.uid() or public.gw_is_owner());
create policy gw_orders_insert on public.gw_orders for insert with check (auth.uid() is not null and user_id = auth.uid());
create policy gw_orders_owner_update on public.gw_orders for update using (public.gw_is_owner()) with check (public.gw_is_owner());
create policy gw_orders_owner_delete on public.gw_orders for delete using (public.gw_is_owner());

drop policy if exists gw_reviews_read on public.gw_reviews;
drop policy if exists gw_reviews_insert on public.gw_reviews;
drop policy if exists gw_reviews_owner_update on public.gw_reviews;
drop policy if exists gw_reviews_owner_delete on public.gw_reviews;
create policy gw_reviews_read on public.gw_reviews for select using (status = 'tampil' or public.gw_is_owner());
create policy gw_reviews_insert on public.gw_reviews for insert with check (auth.uid() is not null and user_id = auth.uid());
create policy gw_reviews_owner_update on public.gw_reviews for update using (public.gw_is_owner()) with check (public.gw_is_owner());
create policy gw_reviews_owner_delete on public.gw_reviews for delete using (public.gw_is_owner());

-- ---------- Penyimpanan gambar ----------
insert into storage.buckets (id, name, public) values ('gw-images', 'gw-images', true)
  on conflict (id) do nothing;
drop policy if exists gw_images_read on storage.objects;
drop policy if exists gw_images_insert on storage.objects;
drop policy if exists gw_images_update on storage.objects;
drop policy if exists gw_images_delete on storage.objects;
create policy gw_images_read on storage.objects for select using (bucket_id = 'gw-images');
create policy gw_images_insert on storage.objects for insert with check (bucket_id = 'gw-images' and public.gw_is_owner());
create policy gw_images_update on storage.objects for update using (bucket_id = 'gw-images' and public.gw_is_owner());
create policy gw_images_delete on storage.objects for delete using (bucket_id = 'gw-images' and public.gw_is_owner());

-- ---------- Data awal (hanya diisi bila tabel masih kosong) ----------
insert into public.gw_settings (id, data) values (1, '{"username":"gammaproject","nama_usaha":"gammaproject official store","tagline":"Website, produk digital, dan layanan buatan gammaproject.","deskripsi":"Toko resmi gammaproject. Semua website, produk digital, dan layanan di sini dibuat dan dikelola langsung oleh pemiliknya. Lihat-lihat dulu sepuasnya; akun baru diperlukan saat Anda memesan.","sampul_url":"/sampul-default.jpg","foto_profil_url":"/profil-default.jpg","wa_number":"6287821130367","email":"yatufht@gmail.com","owner":{"nama":"Taufik","jabatan":"Pemilik gammaproject","bio":"Membangun website dan produk digital untuk usaha kecil agar tampil meyakinkan sejak detik pertama.","foto_url":"","instagram":""},"tentang":"gammaproject adalah studio kecil yang membuat website, aplikasi, dan produk digital untuk usaha kecil dan perorangan.\n\nSetiap pesanan dikerjakan langsung oleh pemilik, jadi Anda berkomunikasi dengan orang yang benar-benar membuat pesanan Anda.","kebijakan":{}}'::jsonb) on conflict (id) do nothing;

do $$
begin
  if not exists (select 1 from public.gw_categories) then
    insert into public.gw_categories (nama, slug, jenis, urutan) values ('Website', 'website', 'jasa', 1);
    insert into public.gw_categories (nama, slug, jenis, urutan) values ('Produk', 'produk', 'produk', 2);
    insert into public.gw_categories (nama, slug, jenis, urutan) values ('Layanan', 'layanan', 'jasa', 3);
  end if;
  if not exists (select 1 from public.gw_products) then
    insert into public.gw_products (slug, nama, jenis, kategori_id, harga, harga_coret, ringkas, deskripsi, gambar_url, link, fitur, aktif, urutan, contoh) values ('madhura-rekap', 'Madhura Rekap', 'jasa', (select id from public.gw_categories where slug = 'website' limit 1), 0, 0, 'Rekap pemasukan dan pengeluaran harian semua cabang usaha dalam satu tempat.', 'Website rekap harian untuk usaha dengan banyak cabang. Pengurus cabang mengisi rekap, pemilik melihat semuanya dari satu dasbor.', '/produk-madhura.jpg', 'https://madura-bisnis.emergent.host/?utm_source=share', array['Rekap harian per cabang', 'Dasbor untuk pemilik usaha', 'Bisa dibuka dari ponsel']::text[], true, 1, true);
    insert into public.gw_products (slug, nama, jenis, kategori_id, harga, harga_coret, ringkas, deskripsi, gambar_url, link, fitur, aktif, urutan, contoh) values ('mycash', 'MyCash', 'jasa', (select id from public.gw_categories where slug = 'website' limit 1), 0, 0, 'Catat uang usahamu, apa pun jenis bisnisnya.', 'Aplikasi web pencatatan keuangan usaha. Pemilik melihat semua cabang dan dasbor, pengurus cabang mengisi rekap harian. Data tersimpan di akun, jadi ganti HP pun rekap tetap ada.', '/produk-mycash.jpg', 'https://mycash-nine.vercel.app', array['Masuk sebagai pemilik usaha atau pengurus cabang', 'Rekap semua cabang dalam satu tempat', 'Tersedia dalam bahasa Indonesia dan Inggris']::text[], true, 2, true);
    insert into public.gw_products (slug, nama, jenis, kategori_id, harga, harga_coret, ringkas, deskripsi, gambar_url, link, fitur, aktif, urutan, contoh) values ('undangan-digital', 'Undangan Digital', 'jasa', (select id from public.gw_categories where slug = 'layanan' limit 1), 0, 0, 'Undangan pernikahan online dengan banyak pilihan desain dan nama tamu di sampul.', 'Pilih desain dari etalase undangan, kirim data acara dan foto, lalu undangan siap dibagikan lewat WhatsApp dengan nama tamu masing-masing.', '/produk-undangan.jpg', 'https://undangan-studio-theta.vercel.app/', array['Banyak pilihan desain, dari adat sampai modern', 'Nama tamu otomatis dari link', 'Demo langsung bisa dicoba sebelum memesan']::text[], true, 3, true);
  end if;
end $$;
