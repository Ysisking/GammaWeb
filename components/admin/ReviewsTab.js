'use client'
import { useEffect, useState } from 'react'
import { Eye, EyeOff, Trash2 } from 'lucide-react'
import Stars from '../Stars'
import { Msg } from './util'
import { deleteReview, loadReviews, setReviewStatus } from '@/lib/store'
import { tanggal } from '@/lib/format'

export default function ReviewsTab() {
  const [list, setList] = useState([])
  const [msg, setMsg] = useState(null)
  const load = () => loadReviews({ all: true }).then(setList).catch((e) => setMsg(['err', e.message]))
  useEffect(() => { load() }, [])
  async function toggle(r) { try { await setReviewStatus(r.id, r.status === 'tampil' ? 'disembunyikan' : 'tampil'); load() } catch (x) { setMsg(['err', x.message]) } }
  async function del(r) { if (!confirm('Hapus ulasan ini?')) return; try { await deleteReview(r.id); load() } catch (x) { setMsg(['err', x.message]) } }
  return (
    <div className="grid gap-3">
      <Msg m={msg} />
      {list.length === 0 && <div className="card p-6 text-sm text-ink/60">Belum ada ulasan.</div>}
      {list.map((r) => (
        <div key={r.id} className={`card p-4 ${r.status !== 'tampil' ? 'opacity-60' : ''}`}>
          <div className="flex items-center justify-between gap-3"><div className="font-extrabold">{r.nama} {r.status !== 'tampil' && <span className="chip bg-ink/10">disembunyikan</span>}</div><Stars n={r.rating} /></div>
          <p className="mt-2 text-sm text-ink/80">{r.teks}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-ink/50">{tanggal(r.created_at)}<span className="flex-1" />
            <button onClick={() => toggle(r)} className="btn-ghost px-2 py-1">{r.status === 'tampil' ? <><EyeOff size={14} /> Sembunyikan</> : <><Eye size={14} /> Tampilkan</>}</button>
            <button onClick={() => del(r)} className="btn-ghost px-2 py-1 text-api"><Trash2 size={14} /> Hapus</button>
          </div>
        </div>
      ))}
    </div>
  )
}
