'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSite } from '@/app/providers'
import { signIn, signUp } from '@/lib/store'
import { OWNER_EMAIL } from '@/lib/config'

export default function AuthForm({ mode }) {
  const router = useRouter()
  const { online } = useSite()
  const next = useSearchParams().get('next') || '/'
  const [f, setF] = useState({ nama: '', email: '', password: '', no_wa: '' })
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const isDaftar = mode === 'daftar'

  async function submit(e) {
    e.preventDefault(); setErr(''); setInfo('')
    if (!online) { setErr('Sistem akun belum tersambung ke server. Untuk sementara, pesanan dilayani lewat tombol WhatsApp di bawah halaman.'); return }
    setBusy(true)
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
    <form onSubmit={submit}>
      <h1 className="text-3xl font-extrabold tracking-tight">{isDaftar ? 'Buat akun' : 'Masuk'}</h1>
      <p className="mt-2 text-sm text-ink/70">{isDaftar ? 'Akun hanya diperlukan saat memesan. Melihat-lihat katalog tidak perlu akun.' : 'Masuk untuk memesan dan melihat riwayat pesanan Anda.'}</p>
      <div className="mt-7 space-y-4">
        {isDaftar && <div><label className="label" htmlFor="nama">Nama</label><input id="nama" required value={f.nama} onChange={set('nama')} className="input" autoComplete="name" /></div>}
        <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" required value={f.email} onChange={set('email')} className="input" autoComplete="email" /></div>
        <div><label className="label" htmlFor="password">Kata sandi</label><input id="password" type="password" required minLength={6} value={f.password} onChange={set('password')} className="input" autoComplete={isDaftar ? 'new-password' : 'current-password'} /></div>
        {isDaftar && <div><label className="label" htmlFor="no_wa">Nomor WhatsApp (opsional)</label><input id="no_wa" value={f.no_wa} onChange={set('no_wa')} className="input" placeholder="08xxxxxxxxxx" autoComplete="tel" /></div>}
      </div>
      {err && <div role="alert" className="mt-4 border-l-4 border-api bg-api-soft px-4 py-3 text-sm font-semibold text-ink">{err}</div>}
      {info && <div role="status" className="mt-4 border-l-4 border-emerald-600 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">{info}</div>}
      <button disabled={busy} className="btn-primary mt-6 w-full py-3.5">{busy ? 'Memproses…' : isDaftar ? 'Daftar' : 'Masuk'}</button>
      <div className="mt-5 border-t border-garis pt-5 text-sm text-ink/70">
        {isDaftar
          ? <>Sudah punya akun? <Link href={`/masuk/?next=${encodeURIComponent(next)}`} className="tautan">Masuk</Link></>
          : <>Belum punya akun? <Link href={`/daftar/?next=${encodeURIComponent(next)}`} className="tautan">Daftar</Link></>}
      </div>
    </form>
  )
}
