'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { useSite } from '@/app/providers'
import { signIn, signUp } from '@/lib/store'
import { waLink } from '@/lib/format'
import { OWNER_EMAIL } from '@/lib/config'

export default function AuthForm({ mode }) {
  const router = useRouter()
  const { online, settings: s } = useSite()
  const next = useSearchParams().get('next') || '/'
  const [f, setF] = useState({ nama: '', email: '', password: '', no_wa: '' })
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const isDaftar = mode === 'daftar'

  if (!online) {
    return (
      <div className="card mt-8 p-6">
        <h1 className="text-xl font-extrabold">Pemesanan lewat WhatsApp</h1>
        <p className="mt-2 text-sm text-ink/70">Untuk saat ini pesanan dilayani langsung lewat WhatsApp, tanpa perlu membuat akun.</p>
        <a href={waLink(s.wa_number, `Halo ${s.owner.nama}, saya ingin memesan.`)} target="_blank" rel="noopener" className="btn-wa mt-4 w-full"><MessageCircle size={18} /> Hubungi via WhatsApp</a>
      </div>
    )
  }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr(''); setInfo('')
    try {
      if (isDaftar) {
        const r = await signUp(f)
        if (r.needsConfirm) { setInfo(`Kami mengirim email konfirmasi ke ${f.email}. Klik tautannya, lalu masuk di sini.`); setBusy(false); return }
      } else {
        await signIn(f)
      }
      router.push(f.email.trim().toLowerCase() === OWNER_EMAIL && next === '/' ? '/admin/' : next)
    } catch (x) { setErr(x.message) }
    setBusy(false)
  }
  return (
    <form onSubmit={submit} className="card mt-8 p-6">
      <h1 className="text-2xl font-extrabold">{isDaftar ? 'Buat akun' : 'Masuk'}</h1>
      <p className="mt-1 text-sm text-ink/60">{isDaftar ? 'Akun hanya diperlukan saat memesan produk atau jasa.' : 'Masuk untuk memesan dan melihat riwayat pesanan.'}</p>
      <div className="mt-5 space-y-4">
        {isDaftar && <div><label className="label" htmlFor="nama">Nama</label><input id="nama" required value={f.nama} onChange={set('nama')} className="input" autoComplete="name" /></div>}
        <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" required value={f.email} onChange={set('email')} className="input" autoComplete="email" /></div>
        <div><label className="label" htmlFor="password">Kata sandi</label><input id="password" type="password" required minLength={6} value={f.password} onChange={set('password')} className="input" autoComplete={isDaftar ? 'new-password' : 'current-password'} /></div>
        {isDaftar && <div><label className="label" htmlFor="no_wa">Nomor WhatsApp (opsional)</label><input id="no_wa" value={f.no_wa} onChange={set('no_wa')} className="input" placeholder="08xxxxxxxxxx" autoComplete="tel" /></div>}
      </div>
      {err && <div className="mt-3 rounded-xl bg-api-soft px-4 py-2 text-sm font-semibold text-api-dark">{err}</div>}
      {info && <div className="mt-3 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">{info}</div>}
      <button disabled={busy} className="btn-primary mt-5 w-full py-3.5">{busy ? 'Memproses…' : isDaftar ? 'Daftar' : 'Masuk'}</button>
      <div className="mt-4 text-sm text-ink/60">
        {isDaftar
          ? <>Sudah punya akun? <Link href={`/masuk/?next=${encodeURIComponent(next)}`} className="tautan">Masuk</Link></>
          : <>Belum punya akun? <Link href={`/daftar/?next=${encodeURIComponent(next)}`} className="tautan">Daftar</Link></>}
      </div>
    </form>
  )
}
