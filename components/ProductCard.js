import Link from 'next/link'
import { rupiah } from '@/lib/format'
import { asset } from '@/lib/config'

export default function ProductCard({ p }) {
  return (
    <Link href={`/produk/?slug=${p.slug}`} className="card group flex gap-3 overflow-hidden p-3 transition hover:shadow-lift">
      <div className="h-24 w-24 flex-none overflow-hidden rounded-2xl bg-ink/5">
        {p.gambar_url ? <img src={asset(p.gambar_url)} alt="" className="h-full w-full object-cover transition group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-2xl font-extrabold text-ink/20">Γ</div>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className={`chip self-start ${p.jenis === 'jasa' ? 'bg-ink text-white' : 'bg-api-soft text-api-dark'}`}>{p.jenis === 'jasa' ? 'Jasa' : 'Produk digital'}</span>
        <div className="mt-1.5 line-clamp-2 text-sm font-extrabold leading-snug">{p.nama}</div>
        {p.ringkas && <div className="mt-0.5 line-clamp-1 text-xs text-ink/60">{p.ringkas}</div>}
        <div className="mt-auto flex items-baseline gap-2 pt-1.5">
          <span className="text-sm font-extrabold text-api">{rupiah(p.harga)}</span>
          {p.harga_coret > 0 && <span className="text-xs text-ink/40 line-through">{rupiah(p.harga_coret)}</span>}
        </div>
      </div>
    </Link>
  )
}
