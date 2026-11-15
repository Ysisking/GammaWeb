'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import Shell from '@/components/Shell'
import Loading from '@/components/Loading'
import OfflineNote from '@/components/OfflineNote'
import StatusChip from '@/components/StatusChip'
import { useSite } from '../providers'
import { useRequireUser } from '@/lib/useRequireUser'
import { loadOrders } from '@/lib/store'
import { rupiah, tanggal, waLink } from '@/lib/format'

export default function Page() {
  const { user, online, settings: s } = useSite()
  const ok = useRequireUser('/pesanan/')
  const [orders, setOrders] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => { if (ok) loadOrders(user.id).then(setOrders).catch((e) => setErr(e.message)) }, [ok, user])
  return (
    <Shell>
      <h1 className="mt-6 text-2xl font-extrabold">Pesanan saya</h1>
      {err && <div className="card mt-4 p-4 text-sm text-api">{err}</div>}
      {!online ? <OfflineNote /> : !orders ? <Loading /> : (
        <div className="mt-4 grid gap-3">
          {orders.length === 0 && <div className="card p-6 text-center text-sm text-ink/60">Belum ada pesanan. <Link href="/#etalase" className="font-bold text-api">Lihat etalase</Link></div>}
          {orders.map((o) => (
            <div key={o.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-ink/50">{o.kode} · {tanggal(o.created_at)}</div>
                  <Link href={`/produk/?slug=${o.product_slug}`} className="mt-0.5 block font-extrabold leading-snug hover:text-api">{o.product_nama}</Link>
                  <div className="mt-1 text-sm text-ink/70">{o.jenis === 'produk' ? `${o.qty} × ${rupiah(o.harga)} · ` : ''}<b className="text-ink">{rupiah(o.total)}</b></div>
                </div>
                <StatusChip status={o.status} />
              </div>
              {o.catatan && <div className="mt-2 rounded-xl bg-abu px-3 py-2 text-xs text-ink/70"><b>Catatan Anda:</b> {o.catatan}</div>}
              {o.catatan_pemilik && <div className="mt-2 rounded-xl bg-api-soft px-3 py-2 text-xs text-ink/80"><b>Dari {s.owner.nama}:</b> {o.catatan_pemilik}</div>}
              {o.status === 'menunggu' && <a href={waLink(s.wa_number, `Halo ${s.owner.nama}, saya ${user.nama}. Mohon info lanjutan untuk pesanan ${o.kode} (${o.product_nama}).`)} target="_blank" rel="noopener" className="btn-outline mt-3 w-full py-2.5 text-xs"><MessageCircle size={14} /> Tanyakan lewat WhatsApp</a>}
            </div>
          ))}
        </div>
      )}
    </Shell>
  )
}
