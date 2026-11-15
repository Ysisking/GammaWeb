'use client'
import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Field, Msg } from './util'
import { deleteCategory, loadCategories, saveCategory } from '@/lib/store'

export default function CategoriesTab() {
  const [list, setList] = useState([])
  const [edit, setEdit] = useState(null)
  const [msg, setMsg] = useState(null)
  const load = () => loadCategories().then(setList).catch((e) => setMsg(['err', e.message]))
  useEffect(() => { load() }, [])
  async function save(e) {
    e.preventDefault(); setMsg(null)
    try { await saveCategory(edit); setEdit(null); load(); setMsg(['ok', 'Kategori disimpan.']) } catch (x) { setMsg(['err', x.message]) }
  }
  async function del(c) {
    if (!confirm(`Hapus kategori "${c.nama}"?`)) return
    try { await deleteCategory(c.id); load() } catch (x) { setMsg(['err', x.message]) }
  }
  const set = (k) => (e) => setEdit({ ...edit, [k]: e.target.value })
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <div className="flex items-center justify-between"><div className="text-sm text-ink/60">Sub-menu katalog</div><button onClick={() => setEdit({ nama: '', jenis: 'jasa', urutan: list.length + 1 })} className="btn-primary px-4 py-2 text-xs"><Plus size={14} /> Tambah</button></div>
        <div className="mt-3 grid gap-2">
          {list.map((c) => (
            <div key={c.id} className="card flex items-center gap-3 p-3">
              <div className="w-6 text-center text-xs font-bold text-ink/40">{c.urutan}</div>
              <div className="flex-1"><div className="text-sm font-extrabold">{c.nama}</div><div className="text-xs text-ink/60">{c.jenis === 'jasa' ? 'Jasa' : 'Produk digital'}</div></div>
              <button onClick={() => setEdit(c)} className="btn-ghost p-2" aria-label="Ubah"><Pencil size={16} /></button>
              <button onClick={() => del(c)} className="btn-ghost p-2 text-api" aria-label="Hapus"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>
      <div>
        {edit ? (
          <form onSubmit={save} className="card space-y-4 p-5">
            <div className="font-extrabold">{edit.id ? 'Ubah kategori' : 'Kategori baru'}</div>
            <Field label="Nama"><input required value={edit.nama} onChange={set('nama')} className="input" /></Field>
            <Field label="Jenis"><select value={edit.jenis} onChange={set('jenis')} className="input"><option value="jasa">Jasa</option><option value="produk">Produk digital</option></select></Field>
            <Field label="Urutan"><input type="number" value={edit.urutan} onChange={set('urutan')} className="input w-24" /></Field>
            <div className="flex gap-2"><button type="button" onClick={() => setEdit(null)} className="btn-ghost flex-1">Batal</button><button className="btn-primary flex-1">Simpan</button></div>
          </form>
        ) : <Msg m={msg} />}
      </div>
    </div>
  )
}
