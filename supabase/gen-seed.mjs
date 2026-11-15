// Membuat supabase/gammaweb.sql = schema.sql + data awal dari data/seed.js.
// Jalankan: node supabase/gen-seed.mjs
import fs from 'fs'
// data/seed.js memakai sintaks ESM di proyek CommonJS, jadi dibaca sebagai teks.
const src = fs.readFileSync(new URL('../data/seed.js', import.meta.url), 'utf8').replace('export const SEED =', 'return')
const SEED = new Function(src)()
const q = (v) => (v === null || v === undefined ? 'null' : typeof v === 'number' || typeof v === 'boolean' ? String(v) : `'${String(v).replace(/'/g, "''")}'`)
const arr = (a) => `array[${a.map(q).join(', ')}]::text[]`
let out = fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf8')
out += `\n-- ---------- Data awal (hanya diisi bila tabel masih kosong) ----------\n`
out += `insert into public.gw_settings (id, data) values (1, ${q(JSON.stringify(SEED.settings))}::jsonb) on conflict (id) do nothing;\n\n`
out += `do $$\nbegin\n  if not exists (select 1 from public.gw_categories) then\n`
for (const c of SEED.categories) out += `    insert into public.gw_categories (nama, slug, jenis, urutan) values (${q(c.nama)}, ${q(c.slug)}, ${q(c.jenis)}, ${c.urutan});\n`
out += `  end if;\n  if not exists (select 1 from public.gw_products) then\n`
for (const p of SEED.products) {
  const cat = SEED.categories.find((c) => c.id === p.kategori_id)
  out += `    insert into public.gw_products (slug, nama, jenis, kategori_id, harga, harga_coret, ringkas, deskripsi, gambar_url, link, fitur, aktif, urutan, contoh) values (${q(p.slug)}, ${q(p.nama)}, ${q(p.jenis)}, (select id from public.gw_categories where slug = ${q(cat.slug)} limit 1), ${p.harga}, ${p.harga_coret}, ${q(p.ringkas)}, ${q(p.deskripsi)}, ${q(p.gambar_url)}, ${q(p.link || '')}, ${arr(p.fitur)}, true, ${p.urutan}, true);\n`
}
out += `  end if;\nend $$;\n`
fs.writeFileSync(new URL('./gammaweb.sql', import.meta.url), out)
console.log('supabase/gammaweb.sql ditulis')
