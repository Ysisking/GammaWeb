'use client'
import { useEffect, useState } from 'react'
import { useSite } from '@/app/providers'
import { loadSettings, saveSettings } from '@/lib/store'
import { POLICIES, policyToText } from '@/lib/policies'
import { Msg } from './util'

// Sunting naskah empat halaman kebijakan. Mengosongkan kotak = kembali ke naskah bawaan.
export default function PoliciesTab() {
  const { refreshSettings } = useSite()
  const [s, setS] = useState(null)
  const [slug, setSlug] = useState(Object.keys(POLICIES)[0])
  const [teks, setTeks] = useState({})
  const [msg, setMsg] = useState(null)
  useEffect(() => {
    loadSettings().then((x) => {
      setS(x)
      setTeks(Object.fromEntries(Object.keys(POLICIES).map((k) => [k, x.kebijakan?.[k] || policyToText(k)])))
    }).catch((e) => setMsg(['err', e.message]))
  }, [])
  if (!s) return <div className="text-sm text-ink/60">Memuat…</div>
  async function save() {
    setMsg(null)
    // Simpan hanya naskah yang berbeda dari bawaan, supaya pembaruan bawaan tetap ikut.
    const kebijakan = Object.fromEntries(Object.entries(teks).filter(([k, v]) => v.trim() && v.trim() !== policyToText(k).trim()))
    try { setS(await saveSettings({ ...s, kebijakan })); refreshSettings(); setMsg(['ok', 'Kebijakan disimpan.']) } catch (x) { setMsg(['err', x.message]) }
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="flex gap-2 overflow-x-auto lg:flex-col">
        {Object.entries(POLICIES).map(([k, p]) => (
          <button key={k} onClick={() => setSlug(k)} className={`flex-none border px-4 py-3 text-left text-sm font-bold ${slug === k ? 'border-ink bg-ink text-white' : 'border-garis bg-white hover:border-ink'}`}>{p.title}</button>
        ))}
      </div>
      <div>
        <label className="label" htmlFor="naskah">{POLICIES[slug].title}</label>
        <textarea id="naskah" rows="22" value={teks[slug] || ''} onChange={(e) => setTeks({ ...teks, [slug]: e.target.value })} className="input font-mono text-[13px] leading-relaxed" />
        <p className="mt-2 text-xs text-ink/60">Baris berawalan <code>## </code> menjadi judul bagian, <code>- </code> menjadi butir daftar, dan baris kosong memisahkan paragraf.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button onClick={save} className="btn-primary">Simpan kebijakan</button>
          <button onClick={() => setTeks({ ...teks, [slug]: policyToText(slug) })} className="btn-outline">Kembalikan naskah bawaan</button>
        </div>
        <div className="mt-3"><Msg m={msg} /></div>
      </div>
    </div>
  )
}
