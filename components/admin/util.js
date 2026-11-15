'use client'
import { useState } from 'react'
import { Upload } from 'lucide-react'
import { uploadImage } from '@/lib/store'
import { asset } from '@/lib/config'

export function Field({ label, children, hint }) {
  return <div><label className="label">{label}</label>{children}{hint && <div className="mt-1 text-[11px] text-ink/50">{hint}</div>}</div>
}

// Input URL gambar + tombol unggah ke Supabase Storage.
export function ImageField({ label, value, onChange, hint, ratio = 'aspect-[2/1]' }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  async function upload(e) {
    const file = e.target.files?.[0]; if (!file) return
    setBusy(true); setErr('')
    try { onChange(await uploadImage(file)) } catch (x) { setErr(x.message) }
    setBusy(false); e.target.value = ''
  }
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-3">
        <div className={`${ratio} w-32 flex-none overflow-hidden rounded-xl bg-ink/5`}>{value && <img src={asset(value)} alt="" className="h-full w-full object-cover" />}</div>
        <div className="flex-1 space-y-2">
          <input value={value || ''} onChange={(e) => onChange(e.target.value)} className="input" placeholder="https://… atau unggah" />
          <label className="btn-outline cursor-pointer px-3 py-2 text-xs"><Upload size={14} /> {busy ? 'Mengunggah…' : 'Unggah gambar'}<input type="file" accept="image/*" className="hidden" onChange={upload} disabled={busy} /></label>
          {err && <div className="text-xs font-semibold text-api">{err}</div>}
          {hint && <div className="text-[11px] text-ink/50">{hint}</div>}
        </div>
      </div>
    </div>
  )
}

export function Msg({ m }) {
  if (!m) return null
  return <div className={`rounded-xl px-4 py-2 text-sm font-semibold ${m[0] === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-api-soft text-api-dark'}`}>{m[1]}</div>
}
