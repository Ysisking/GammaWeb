'use client'
import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Field, ImageField, Msg } from './util'
import { deleteProduct, loadCategories, loadProducts, saveProduct } from '@/lib/store'
import { rupiah } from '@/lib/format'
import { asset } from '@/lib/config'

const EMPTY = { nama: '', jenis: 'jasa', kategori_id: '', harga: 0, harga_coret: 0, ringkas: '', deskripsi: '', gambar_url: '', link: '', fitur: '', aktif: true, urutan: 0, slug: '' }

export default function ProductsTab() {
  const [list, setList] = useState([])
  const [cats, setCats] = useState([])
  const [edit, setEdit] = useState(null)
  const [msg, setMsg] = useState(null)
  const load = () => Promise.all([loadProducts({ all: true }), loadCategories()]).then(([p, c]) => { setList(p); setCats(c) }).catch((e) => setMsg(['err', e.message]))
  useEffect(() => { load() }, [])
  async function save(e) {
    e.preventDefault(); setMsg(null)
    try { await saveProduct(edit); setMsg(['ok', 'Produk disimpan.']); setEdit(null); load() } catch (x) { setMsg(['err', x.message]) }
  }
  async function del(p) {
    if (!confirm(`Hapus "${p.nama}"?`)) return
    try { await deleteProduct(p.id); load() } catch (x) { setMsg(['err', x.message]) }
  }
  const set = (k) => (e) => setEdit({ ...edit, [k]: e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e })

  if (edit) return (
    <form onSubmit={save} className="card space-y-4 p-5">
      <div className="flex items-center justify-between"><div className="font-extrabold">{edit.id ? 'Ubah produk' : 'Produk baru'}</div><button type="button" onClick={() => setEdit(null)} className="btn-ghost px-3 py-1.5 text-xs">Batal</button></div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nama"><input required value={edit.nama} onChange={set('nama')} className="input" /></Field>
        <Field label="Slug (alamat)" hint="Kosongkan untuk dibuat otomatis dari nama."><input value={edit.slug || ''} onChange={set('slug')} className="input" /></Field>
        <Field label="Jenis"><select value={edit.jenis} onChange={set('jenis')} className="input"><option value="jasa">Jasa</option><option value="produk">Produk digital</option></select></Field>
        <Field label="Kategori (sub-menu katalog)"><select value={edit.kategori_id || ''} onChange={set('kategori_id')} className="input"><option value="">Tanpa kategori</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}</select></Field>
        <Field label="Harga (Rp)" hint="0 = tampil sebagai 'Hubungi kami'."><input type="number" min="0" value={edit.harga} onChange={set('harga')} className="input" /></Field>
        <Field label="Harga coret (Rp, opsional)"><input type="number" min="0" value={edit.harga_coret} onChange={set('harga_coret')} className="input" /></Field>
      </div>
      <Field label="Ringkasan satu kalimat"><input value={edit.ringkas} onChange={set('ringkas')} className="input" maxLength={200} /></Field>
      <Field label="Deskripsi" hint="Pisahkan paragraf dengan baris kosong."><textarea rows="5" value={edit.deskripsi} onChange={set('deskripsi')} className="input" /></Field>
      <Field label="Fitur / yang didapat" hint="Satu fitur per baris."><textarea rows="4" value={Array.isArray(edit.fitur) ? edit.fitur.join('\n') : edit.fitur} onChange={set('fitur')} className="input" /></Field>
      <Field label="Link etalase" hint="Alamat tampilan asli produk (https://…). Dibuka dari tombol Etalase di kartu."><input type="url" value={edit.link || ''} onChange={set('link')} className="input" placeholder="https://" /></Field>
      <ImageField label="Gambar" value={edit.gambar_url} onChange={set('gambar_url')} hint="Rasio 16:10 paling pas, mis. 1200×750 px." />
      <div className="flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={!!edit.aktif} onChange={set('aktif')} className="h-4 w-4" /> Tampilkan di katalog</label>
        <Field label="Urutan"><input type="number" value={edit.urutan} onChange={set('urutan')} className="input w-24" /></Field>
      </div>
      <Msg m={msg} />
      <button className="btn-primary w-full">Simpan</button>
    </form>
  )
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-ink/60">{list.length} produk/jasa</div>
        <button onClick={() => setEdit({ ...EMPTY, kategori_id: cats[0]?.id || '' })} className="btn-primary px-4 py-2 text-xs"><Plus size={14} /> Tambah</button>
      </div>
      <Msg m={msg} />
      <div className="mt-3 grid gap-2">
        {list.map((p) => (
          <div key={p.id} className={`card flex items-center gap-3 p-3 ${!p.aktif ? 'opacity-60' : ''}`}>
            <div className="h-14 w-14 flex-none overflow-hidden rounded-xl bg-ink/5">{p.gambar_url && <img src={asset(p.gambar_url)} alt="" className="h-full w-full object-cover" />}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-extrabold">{p.nama} {p.contoh && <span className="chip bg-amber-100 text-amber-800">contoh</span>} {!p.aktif && <span className="chip bg-ink/10">disembunyikan</span>}</div>
              <div className="text-xs text-ink/60">{p.jenis === 'jasa' ? 'Jasa' : 'Produk'} · {cats.find((c) => c.id === p.kategori_id)?.nama || 'Tanpa kategori'} · {rupiah(p.harga)}</div>
            </div>
            <button onClick={() => setEdit({ ...EMPTY, ...p, fitur: (p.fitur || []).join('\n') })} className="btn-ghost p-2" aria-label="Ubah"><Pencil size={16} /></button>
            <button onClick={() => del(p)} className="btn-ghost p-2 text-api" aria-label="Hapus"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      {list.some((p) => p.contoh) && <p className="mt-3 text-xs text-ink/50">Produk bertanda "contoh" adalah isian awal. Ubah atau hapus sesuai kebutuhan; tanda hilang setelah Anda simpan perubahan.</p>}
    </div>
  )
}
