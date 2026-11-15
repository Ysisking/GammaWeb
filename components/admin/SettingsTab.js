'use client'
import { useEffect, useState } from 'react'
import { useSite } from '@/app/providers'
import { loadSettings, saveSettings } from '@/lib/store'
import { Field, ImageField, Msg } from './util'

export default function SettingsTab() {
  const { refreshSettings } = useSite()
  const [s, setS] = useState(null)
  const [msg, setMsg] = useState(null)
  useEffect(() => { loadSettings().then(setS).catch((e) => setMsg(['err', e.message])) }, [])
  if (!s) return <div className="text-sm text-ink/60">Memuat…</div>
  const set = (k) => (e) => setS({ ...s, [k]: e?.target ? e.target.value : e })
  const setO = (k) => (e) => setS({ ...s, owner: { ...s.owner, [k]: e?.target ? e.target.value : e } })
  async function save(e) {
    e.preventDefault(); setMsg(null)
    try { setS(await saveSettings(s)); refreshSettings(); setMsg(['ok', 'Pengaturan disimpan.']) } catch (x) { setMsg(['err', x.message]) }
  }
  return (
    <form onSubmit={save} className="grid gap-5 md:grid-cols-2">
      <div className="card space-y-4 p-5">
        <div className="font-extrabold">Halaman utama</div>
        <Field label="Username"><div className="flex items-center"><span className="rounded-l-xl border border-r-0 border-ink/15 bg-abu px-3 py-3 text-sm text-ink/50">@</span><input value={s.username} onChange={set('username')} className="input rounded-l-none" /></div></Field>
        <Field label="Nama usaha"><input value={s.nama_usaha} onChange={set('nama_usaha')} className="input" /></Field>
        <Field label="Tagline"><input value={s.tagline} onChange={set('tagline')} className="input" /></Field>
        <Field label="Deskripsi GammaWeb"><textarea rows="4" value={s.deskripsi} onChange={set('deskripsi')} className="input" /></Field>
        <ImageField label="Foto sampul" value={s.sampul_url} onChange={set('sampul_url')} hint="Rasio 2:1, mis. 2000×1000 px." />
        <ImageField label="Foto profil" value={s.foto_profil_url} onChange={set('foto_profil_url')} ratio="aspect-square" hint="Persegi, ditampilkan bulat." />
        <Field label="Nomor WhatsApp" hint="Format internasional tanpa +, mis. 6287821130367"><input value={s.wa_number} onChange={set('wa_number')} className="input" /></Field>
      </div>
      <div className="space-y-5">
        <div className="card space-y-4 p-5">
          <div className="font-extrabold">Profil pemilik (tampil di semua halaman)</div>
          <Field label="Nama"><input value={s.owner.nama} onChange={setO('nama')} className="input" /></Field>
          <Field label="Jabatan"><input value={s.owner.jabatan} onChange={setO('jabatan')} className="input" /></Field>
          <Field label="Bio singkat"><textarea rows="3" value={s.owner.bio} onChange={setO('bio')} className="input" /></Field>
          <ImageField label="Foto pemilik" value={s.owner.foto_url} onChange={setO('foto_url')} ratio="aspect-square" hint="Kosongkan untuk memakai foto profil usaha." />
          <Field label="Instagram (tanpa @)"><input value={s.owner.instagram} onChange={setO('instagram')} className="input" /></Field>
        </div>
        <div className="card space-y-4 p-5">
          <div className="font-extrabold">Halaman About gammaproject</div>
          <Field label="Isi" hint="Pisahkan paragraf dengan baris kosong."><textarea rows="7" value={s.tentang} onChange={set('tentang')} className="input" /></Field>
        </div>
        <Msg m={msg} />
        <button className="btn-primary w-full">Simpan pengaturan</button>
      </div>
    </form>
  )
}
