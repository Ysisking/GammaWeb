'use client'
import { useState } from 'react'
import { updateAccount } from '@/lib/store'

export default function AccountForm({ user }) {
  const [f, setF] = useState({ nama: user.nama, no_wa: user.no_wa, password_lama: '', password_baru: '' })
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  async function submit(e) {
    e.preventDefault(); setMsg(null); setBusy(true)
    try { await updateAccount({ ...f, email: user.email }); setMsg(['ok', 'Perubahan disimpan.']); setF({ ...f, password_lama: '', password_baru: '' }) } catch (x) { setMsg(['err', x.message]) }
    setBusy(false)
  }
  return (
    <form onSubmit={submit} className="card p-6">
      <h1 className="text-2xl font-extrabold">Akun saya</h1>
      <div className="mt-1 text-sm text-ink/60">{user.email}</div>
      <div className="mt-5 space-y-4">
        <div><label className="label" htmlFor="nama">Nama</label><input id="nama" value={f.nama} onChange={set('nama')} className="input" /></div>
        <div><label className="label" htmlFor="no_wa">Nomor WhatsApp</label><input id="no_wa" value={f.no_wa} onChange={set('no_wa')} className="input" placeholder="08xxxxxxxxxx" /></div>
        <div className="border-t pt-4 text-sm font-bold">Ganti kata sandi (kosongkan bila tidak perlu)</div>
        <div><label className="label" htmlFor="pl">Kata sandi lama</label><input id="pl" type="password" value={f.password_lama} onChange={set('password_lama')} className="input" autoComplete="current-password" /></div>
        <div><label className="label" htmlFor="pb">Kata sandi baru</label><input id="pb" type="password" value={f.password_baru} onChange={set('password_baru')} className="input" autoComplete="new-password" /></div>
      </div>
      {msg && <div className={`mt-3 rounded-xl px-4 py-2 text-sm font-semibold ${msg[0] === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-api-soft text-api-dark'}`}>{msg[1]}</div>}
      <button disabled={busy} className="btn-primary mt-5 w-full">{busy ? 'Menyimpan…' : 'Simpan'}</button>
    </form>
  )
}
