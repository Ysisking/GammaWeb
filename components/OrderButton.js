'use client'
import { useState } from 'react'
import Link from 'next/link'
import { LogIn, MessageCircle, ShoppingBag } from 'lucide-react'
import { useSite } from '@/app/providers'
import { createOrder } from '@/lib/store'
import { rupiah, waLink } from '@/lib/format'

// Dengan Supabase: tamu diminta masuk dulu; pelanggan mengisi form, pesanan tercatat,
// lalu dikonfirmasi lewat WhatsApp. Tanpa Supabase: langsung ke WhatsApp.
export default function OrderButton({ product }) {
  const { user, online, ready, settings: s } = useSite()
  const owner = s.owner.nama
  const [open, setOpen] = useState(false)
  const [qty, setQty] = useState(1)
  const [catatan, setCatatan] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState(null)

  if (!online) {
    return (
      <a href={waLink(s.wa_number, `Halo ${owner}, saya ingin memesan ${product.nama} (${rupiah(product.harga)}).`)} target="_blank" rel="noopener" className="btn-wa w-full py-4 text-base">
        <MessageCircle size={18} /> Pesan lewat WhatsApp
      </a>
    )
  }
  if (!ready) return <div className="h-12 rounded-lg bg-abu" />
  if (!user) {
    return (
      <div className="rounded-lg bg-abu p-4">
        <p className="text-sm text-ink/70">Masuk atau daftar dulu untuk memesan. Melihat-lihat tidak perlu akun.</p>
        <Link href={`/masuk/?next=${encodeURIComponent('/produk/?slug=' + product.slug)}`} className="btn-primary mt-3 w-full"><LogIn size={16} /> Masuk untuk memesan</Link>
      </div>
    )
  }
  if (done) {
    const pesan = `Halo ${owner}, saya ${user.nama} baru memesan:\n• ${product.nama}${product.jenis === 'produk' ? ` × ${done.qty}` : ''}\n• Kode pesanan: ${done.kode}\n• Total: ${rupiah(done.total)}${done.catatan ? `\n• Catatan: ${done.catatan}` : ''}\n\nMohon info langkah pembayarannya.`
    return (
      <div className="rounded-lg border border-api/30 bg-api-soft p-4">
        <div className="font-extrabold">Pesanan tercatat · {done.kode}</div>
        <p className="mt-1 text-sm text-ink/70">Langkah terakhir: konfirmasi lewat WhatsApp agar {owner} bisa memproses dan mengirim info pembayaran.</p>
        <a href={waLink(s.wa_number, pesan)} target="_blank" rel="noopener" className="btn-wa mt-3 w-full"><MessageCircle size={18} /> Konfirmasi via WhatsApp</a>
        <Link href="/pesanan/" className="btn-ghost mt-1 w-full">Lihat pesanan saya</Link>
      </div>
    )
  }
  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('')
    try { setDone(await createOrder({ product_id: product.id, qty, catatan, user })) } catch (x) { setErr(x.message) }
    setBusy(false)
  }
  if (!open) return <button onClick={() => setOpen(true)} className="btn-accent w-full py-4 text-base"><ShoppingBag size={18} /> Pesan sekarang</button>
  return (
    <form onSubmit={submit} className="rounded-lg bg-abu p-4">
      {product.jenis === 'produk' && <div className="mb-3"><label className="label" htmlFor="qty">Jumlah</label><input id="qty" type="number" min="1" max="99" value={qty} onChange={(e) => setQty(e.target.value)} className="input w-28" /></div>}
      <label className="label" htmlFor="catatan">Catatan untuk {owner} (opsional)</label>
      <textarea id="catatan" rows="3" value={catatan} onChange={(e) => setCatatan(e.target.value)} className="input" placeholder={product.jenis === 'jasa' ? 'Ceritakan kebutuhan Anda, mis. nama usaha, jumlah produk, tenggat.' : 'Mis. format file yang diinginkan.'} />
      {err && <div className="mt-2 text-sm font-semibold text-api">{err}</div>}
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => setOpen(false)} className="btn-ghost flex-1">Batal</button>
        <button disabled={busy} className="btn-accent flex-1">{busy ? 'Menyimpan…' : 'Kirim pesanan'}</button>
      </div>
      <p className="mt-3 text-[11px] text-ink/50">Pembayaran dilakukan setelah konfirmasi di WhatsApp. Belum ada tagihan pada tahap ini.</p>
    </form>
  )
}
