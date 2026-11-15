# GammaWeb — etalase produk & jasa gammaproject

Website ala Lynk.id untuk semua produk digital dan jasa gammaproject.
Berupa **situs statis** (seperti web undangan), jadi bisa langsung dibuka di browser lewat GitHub Pages
tanpa server sendiri. Login, pesanan, dan ulasan memakai **Supabase** (opsional).

## Isi halaman utama
Foto sampul → foto profil → nama usaha & `@username` → deskripsi GammaWeb → profil pemilik (tampil di semua halaman)
→ etalase dengan sub-menu kategori → kartu menu (About gammaproject, Review, Order produk/jasa) → Contact me (WhatsApp)
→ footer: Ketentuan Layanan, Kebijakan Privasi, Kebijakan Retur Dana, Kebijakan Pengiriman.

## Dua mode
| | Tanpa Supabase | Dengan Supabase |
|---|---|---|
| Etalase, profil, kebijakan | Ya (isi dari `data/seed.js`) | Ya (isi dari database, diubah lewat `/admin`) |
| Pesan produk | Langsung ke WhatsApp | Wajib login → pesanan tercatat → konfirmasi WhatsApp |
| Ulasan | Belum bisa ditulis | Pelanggan login bisa menulis |
| Panel `/admin` | Tidak aktif | Aktif untuk email pemilik |

## Menerbitkan ke GitHub Pages
1. Taruh isi folder ini di root sebuah repo **publik** (mis. `GammaWeb`).
2. Repo → **Settings → Pages → Source: GitHub Actions**.
3. Push ke `main`. Situs tayang di `https://<username>.github.io/<nama-repo>/`.

## Mengaktifkan login (Supabase)
1. Buka project Supabase (boleh project yang sama dengan web undangan; semua tabel berawalan `gw_`).
2. **SQL Editor** → tempel seluruh isi `supabase/gammaweb.sql` → Run. Aman dijalankan ulang.
   Ganti email di fungsi `gw_is_owner()` bila email pemilik bukan `yatufht@gmail.com`.
3. **Authentication → URL Configuration**: isi *Site URL* dengan alamat GitHub Pages Anda
   (mis. `https://ysisking.github.io/GammaWeb/`) agar tautan konfirmasi email kembali ke situs.
4. **Project Settings → API**: salin *Project URL* dan *anon public key*.
5. Di repo GitHub: **Settings → Secrets and variables → Actions** → tambahkan secret
   `SUPABASE_URL` dan `SUPABASE_ANON_KEY` → jalankan ulang workflow (Actions → Deploy GammaWeb → Run workflow).
6. Daftar di `/daftar/` memakai email pemilik, konfirmasi emailnya, lalu buka `/admin/`.
   Lakukan ini segera setelah Supabase aktif.

Keamanan dijaga oleh Row Level Security di database: harga dan kode pesanan diisi database
(bukan browser), pelanggan hanya melihat pesanannya sendiri, dan hanya pemilik terkonfirmasi
yang bisa mengubah produk, pengaturan, status pesanan, ulasan, dan gambar.

## Menjalankan di laptop
```bash
npm install
npm run dev     # http://localhost:3100
```
Buat `.env.local` dari `.env.example` bila ingin mencoba dengan Supabase.

## Mengubah isi
- Kebijakan (4 halaman footer): `lib/policies.js`
- Isi awal tanpa Supabase: `data/seed.js` (jalankan `node supabase/gen-seed.mjs` untuk memperbarui SQL data awal)
- Dengan Supabase: semua lewat panel `/admin/`
