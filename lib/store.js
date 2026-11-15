// Semua baca/tulis data dari browser. Tanpa Supabase, data dibaca dari SEED
// dan operasi tulis menolak dengan pesan yang jelas.
import { supabase } from './supabase'
import { SEED } from '@/data/seed'
import { BASE } from './config'

async function run(p) {
  const { data, error } = await p
  if (error) throw new Error(translate(error.message))
  return data
}
function need() {
  if (!supabase) throw new Error('Fitur ini butuh Supabase. Lihat README bagian "Mengaktifkan login".')
}
function translate(m = '') {
  if (/Invalid login credentials/i.test(m)) return 'Email atau kata sandi salah.'
  if (/already registered/i.test(m)) return 'Email sudah terdaftar. Silakan masuk.'
  if (/Email not confirmed/i.test(m)) return 'Email belum dikonfirmasi. Buka email dari kami lalu klik tautannya.'
  if (/Password should be at least/i.test(m)) return 'Kata sandi minimal 6 karakter.'
  if (/duplicate key.*slug/i.test(m)) return 'Slug sudah dipakai produk lain.'
  if (/row-level security/i.test(m)) return 'Anda tidak punya izin untuk tindakan ini.'
  return m
}
export const slugify = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80)

// ---------- Pengaturan situs ----------
export const mergeSettings = (d) => ({ ...SEED.settings, ...(d || {}), owner: { ...SEED.settings.owner, ...(d?.owner || {}) } })
export async function loadSettings() {
  if (!supabase) return SEED.settings
  const r = await run(supabase.from('gw_settings').select('data').eq('id', 1).maybeSingle())
  return mergeSettings(r?.data)
}
export async function saveSettings(s) {
  need()
  const clean = {
    username: String(s.username || '').toLowerCase().replace(/[^a-z0-9_.]/g, '').slice(0, 30),
    nama_usaha: String(s.nama_usaha || '').trim().slice(0, 60),
    tagline: String(s.tagline || '').trim().slice(0, 120),
    deskripsi: String(s.deskripsi || '').trim().slice(0, 1000),
    sampul_url: String(s.sampul_url || '').trim(),
    foto_profil_url: String(s.foto_profil_url || '').trim(),
    wa_number: String(s.wa_number || '').replace(/\D/g, '').slice(0, 20),
    tentang: String(s.tentang || '').trim().slice(0, 5000),
    owner: {
      nama: String(s.owner?.nama || '').trim().slice(0, 60),
      jabatan: String(s.owner?.jabatan || '').trim().slice(0, 60),
      bio: String(s.owner?.bio || '').trim().slice(0, 400),
      foto_url: String(s.owner?.foto_url || '').trim(),
      instagram: String(s.owner?.instagram || '').replace(/^@/, '').trim().slice(0, 40),
    },
  }
  if (!clean.username) throw new Error('Username wajib diisi (huruf, angka, titik, garis bawah).')
  await run(supabase.from('gw_settings').upsert({ id: 1, data: clean, updated_at: new Date().toISOString() }))
  return mergeSettings(clean)
}

// ---------- Kategori ----------
export async function loadCategories() {
  if (!supabase) return SEED.categories
  return run(supabase.from('gw_categories').select('*').order('urutan').order('nama'))
}
export async function saveCategory(c) {
  need()
  if (!c.nama?.trim()) throw new Error('Nama kategori wajib diisi.')
  const row = { nama: c.nama.trim().slice(0, 60), slug: slugify(c.nama), jenis: c.jenis === 'produk' ? 'produk' : 'jasa', urutan: parseInt(c.urutan) || 0 }
  return c.id ? run(supabase.from('gw_categories').update(row).eq('id', c.id)) : run(supabase.from('gw_categories').insert(row))
}
export async function deleteCategory(id) {
  need()
  const { count } = await supabase.from('gw_products').select('id', { count: 'exact', head: true }).eq('kategori_id', id)
  if (count) throw new Error(`Masih ada ${count} produk di kategori ini. Pindahkan dulu produknya.`)
  return run(supabase.from('gw_categories').delete().eq('id', id))
}

// ---------- Produk & jasa ----------
export async function loadProducts({ all = false } = {}) {
  if (!supabase) return SEED.products.filter((p) => all || p.aktif)
  let q = supabase.from('gw_products').select('*').order('urutan').order('created_at', { ascending: false })
  if (!all) q = q.eq('aktif', true)
  return run(q)
}
export async function loadProduct(slug) {
  if (!supabase) return SEED.products.find((p) => p.slug === slug) || null
  return run(supabase.from('gw_products').select('*').eq('slug', slug).maybeSingle())
}
export async function saveProduct(p) {
  need()
  const fitur = Array.isArray(p.fitur) ? p.fitur : String(p.fitur || '').split('\n')
  const row = {
    nama: String(p.nama || '').trim().slice(0, 120),
    jenis: p.jenis === 'produk' ? 'produk' : 'jasa',
    kategori_id: p.kategori_id || null,
    harga: Math.max(0, parseInt(p.harga) || 0),
    harga_coret: Math.max(0, parseInt(p.harga_coret) || 0),
    ringkas: String(p.ringkas || '').trim().slice(0, 200),
    deskripsi: String(p.deskripsi || '').trim().slice(0, 5000),
    gambar_url: String(p.gambar_url || '').trim(),
    fitur: fitur.map((f) => String(f).trim()).filter(Boolean).slice(0, 20),
    aktif: !!p.aktif,
    urutan: parseInt(p.urutan) || 0,
    slug: slugify(p.slug || p.nama) || 'produk',
    contoh: false,
  }
  if (!row.nama) throw new Error('Nama produk wajib diisi.')
  if (p.id) return run(supabase.from('gw_products').update(row).eq('id', p.id))
  try { return await run(supabase.from('gw_products').insert(row)) } catch (e) {
    if (!/Slug sudah dipakai/.test(e.message) || p.slug) throw e
    return run(supabase.from('gw_products').insert({ ...row, slug: row.slug + '-' + Math.random().toString(36).slice(2, 6) }))
  }
}
export async function deleteProduct(id) { need(); return run(supabase.from('gw_products').delete().eq('id', id)) }

// ---------- Pesanan ----------
// Harga, nama produk, dan kode pesanan diisi oleh database (trigger), bukan browser.
export async function createOrder({ product_id, qty, catatan, user }) {
  need()
  return run(supabase.from('gw_orders').insert({ product_id, qty: Math.max(1, Math.min(99, parseInt(qty) || 1)), catatan: String(catatan || '').slice(0, 1000), user_nama: user.nama, user_wa: user.no_wa || '' }).select().single())
}
export async function loadOrders(userId) {
  need()
  let q = supabase.from('gw_orders').select('*').order('created_at', { ascending: false }).limit(300)
  if (userId) q = q.eq('user_id', userId)
  return run(q)
}
export async function updateOrder(id, status, catatan_pemilik) {
  need()
  return run(supabase.from('gw_orders').update({ status, catatan_pemilik: String(catatan_pemilik || '').slice(0, 1000), updated_at: new Date().toISOString() }).eq('id', id))
}

// ---------- Ulasan ----------
export async function loadReviews({ all = false } = {}) {
  if (!supabase) return []
  let q = supabase.from('gw_reviews').select('*').order('created_at', { ascending: false }).limit(500)
  if (!all) q = q.eq('status', 'tampil')
  return run(q)
}
export async function createReview({ rating, teks, nama }) {
  need()
  const r = parseInt(rating)
  if (!(r >= 1 && r <= 5)) throw new Error('Beri nilai 1 sampai 5 bintang.')
  if (!teks?.trim() || teks.trim().length < 5) throw new Error('Tulis ulasan minimal 5 karakter.')
  return run(supabase.from('gw_reviews').insert({ rating: r, teks: teks.trim().slice(0, 1000), nama }).select().single())
}
export async function setReviewStatus(id, status) { need(); return run(supabase.from('gw_reviews').update({ status }).eq('id', id)) }
export async function deleteReview(id) { need(); return run(supabase.from('gw_reviews').delete().eq('id', id)) }

// ---------- Gambar ----------
export async function uploadImage(file) {
  need()
  if (!/^image\/(jpeg|png|webp|gif|svg\+xml)$/.test(file.type)) throw new Error('Format harus JPG, PNG, WebP, GIF, atau SVG.')
  if (file.size > 3 * 1024 * 1024) throw new Error('Ukuran maksimal 3 MB.')
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  await run(supabase.storage.from('gw-images').upload(path, file, { cacheControl: '31536000', contentType: file.type }))
  return supabase.storage.from('gw-images').getPublicUrl(path).data.publicUrl
}

// ---------- Akun ----------
export async function signUp({ nama, email, password, no_wa }) {
  need()
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(), password,
    options: { data: { nama: nama.trim(), no_wa: String(no_wa || '').replace(/[^\d+]/g, '') }, emailRedirectTo: location.origin + BASE + '/masuk/' },
  })
  if (error) throw new Error(translate(error.message))
  // Supabase mengembalikan user tanpa identitas bila email sudah terdaftar (anti-enumerasi).
  if (data.user && data.user.identities?.length === 0) throw new Error('Email sudah terdaftar. Silakan masuk.')
  return { needsConfirm: !data.session }
}
export async function signIn({ email, password }) {
  need()
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
  if (error) throw new Error(translate(error.message))
  return data.user
}
export async function signOut() { if (supabase) await supabase.auth.signOut() }
export async function updateAccount({ email, nama, no_wa, password_lama, password_baru }) {
  need()
  if (password_baru) {
    if (String(password_baru).length < 6) throw new Error('Kata sandi baru minimal 6 karakter.')
    const { error } = await supabase.auth.signInWithPassword({ email, password: password_lama || '' })
    if (error) throw new Error('Kata sandi lama salah.')
  }
  const upd = { data: { nama: String(nama || '').trim().slice(0, 60), no_wa: String(no_wa || '').replace(/[^\d+]/g, '') } }
  if (password_baru) upd.password = password_baru
  const { error } = await supabase.auth.updateUser(upd)
  if (error) throw new Error(translate(error.message))
}
