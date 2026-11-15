'use client'
import { useEffect, useState } from 'react'
import WaIcon from '@/components/WaIcon'
import StatusChip from '../StatusChip'
import { Msg } from './util'
import { loadOrders, updateOrder } from '@/lib/store'
import { rupiah, tanggal, waLink } from '@/lib/format'

const STATUSES = ['menunggu', 'diproses', 'selesai', 'dibatalkan']

export default function OrdersTab() {
  const [list, setList] = useState([])
  const [filter, setFilter] = useState('semua')
  const [note, setNote] = useState({})
  const [msg, setMsg] = useState(null)
  const load = () => loadOrders().then(setList).catch((e) => setMsg(['err', e.message]))
  useEffect(() => { load() }, [])
  async function setStatus(o, status) {
    try { await updateOrder(o.id, status, note[o.id] ?? o.catatan_pemilik ?? ''); load() } catch (x) { setMsg(['err', x.message]) }
  }
  const shown = filter === 'semua' ? list : list.filter((o) => o.status === filter)
  const count = (s) => list.filter((o) => o.status === s).length
  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {['semua', ...STATUSES].map((s) => <button key={s} onClick={() => setFilter(s)} className={`chip flex-none px-3 py-1.5 capitalize ${filter === s ? 'bg-api text-white' : 'bg-white text-ink/70'}`}>{s} {s !== 'semua' && `(${count(s)})`}</button>)}
      </div>
      <Msg m={msg} />
      <div className="mt-3 grid gap-3">
        {shown.length === 0 && <div className="card p-6 text-sm text-ink/60">Tidak ada pesanan.</div>}
        {shown.map((o) => (
          <div key={o.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="text-xs font-bold text-ink/50">{o.kode} · {tanggal(o.created_at)}</div>
                <div className="font-extrabold">{o.product_nama}</div>
                <div className="text-sm text-ink/70">{o.user_nama} · {o.user_email}{o.user_wa && ` · ${o.user_wa}`}</div>
                <div className="mt-1 text-sm">{o.jenis === 'produk' ? `${o.qty} × ${rupiah(o.harga)} = ` : ''}<b>{rupiah(o.total)}</b></div>
              </div>
              <StatusChip status={o.status} />
            </div>
            {o.catatan && <div className="mt-2 rounded-xl bg-abu px-3 py-2 text-xs"><b>Catatan pelanggan:</b> {o.catatan}</div>}
            <textarea rows="2" className="input mt-2 text-xs" placeholder="Catatan untuk pelanggan (mis. info pembayaran, estimasi selesai)" value={note[o.id] ?? o.catatan_pemilik ?? ''} onChange={(e) => setNote({ ...note, [o.id]: e.target.value })} />
            <div className="mt-2 flex flex-wrap gap-2">
              {STATUSES.map((s) => <button key={s} onClick={() => setStatus(o, s)} className={`chip px-3 py-1.5 capitalize ${o.status === s ? 'bg-ink text-white' : 'bg-abu hover:bg-ink/10'}`}>{s}</button>)}
              {o.user_wa && <a href={waLink(o.user_wa.replace(/^0/, '62'), `Halo ${o.user_nama}, terkait pesanan ${o.kode} (${o.product_nama}):`)} target="_blank" rel="noopener" className="chip ml-auto bg-ink px-3 py-1.5 text-white"><WaIcon size={12} className="mr-1" /> WhatsApp</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
