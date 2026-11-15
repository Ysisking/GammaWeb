import Link from 'next/link'
import { rupiah } from '@/lib/format'
import { asset } from '@/lib/config'

// Satu baris katalog: gambar kecil, nama, ringkasan, harga di kanan.
export default function ProductCard({ p }) {
  return (
    <Link href={`/produk/?slug=${p.slug}`} className="group flex items-start gap-4 px-4 py-4 transition-colors hover:bg-abu/60 sm:px-5">
      <div className="h-16 w-16 flex-none overflow-hidden rounded-md bg-abu sm:h-[72px] sm:w-[72px]">
        {p.gambar_url && <img src={asset(p.gambar_url)} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="eyebrow !text-[10px]">{p.jenis === 'jasa' ? 'Jasa' : 'Produk digital'}</div>
        <div className="mt-0.5 font-bold leading-snug group-hover:text-api">{p.nama}</div>
        {p.ringkas && <div className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-ink/60">{p.ringkas}</div>}
        <div className="mt-2 flex items-baseline gap-2 sm:hidden">
          <span className="text-sm font-extrabold">{rupiah(p.harga)}</span>
          {p.harga_coret > 0 && <span className="text-xs text-ink/45 line-through">{rupiah(p.harga_coret)}</span>}
        </div>
      </div>
      <div className="hidden flex-none text-right sm:block">
        <div className="text-sm font-extrabold">{rupiah(p.harga)}</div>
        {p.harga_coret > 0 && <div className="text-xs text-ink/45 line-through">{rupiah(p.harga_coret)}</div>}
      </div>
      <span aria-hidden="true" className="mt-0.5 flex-none text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-api">→</span>
    </Link>
  )
}
