import Link from 'next/link'
import { rupiah } from '@/lib/format'
import { asset } from '@/lib/config'

// Kartu katalog: gambar, kategori, nama, ringkasan, harga, lalu tombol Etalase dan Order.
export default function ProductCard({ p, kategori }) {
  const detail = `/produk/?slug=${p.slug}`
  return (
    <article className="flex flex-col border border-garis bg-white transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,.10)]">
      <Link href={detail} className="block aspect-[16/10] overflow-hidden bg-abu" tabIndex={-1} aria-hidden="true">
        {p.gambar_url && <img src={asset(p.gambar_url)} alt="" className="h-full w-full object-cover" loading="lazy" />}
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {kategori && <div className="eyebrow">{kategori}</div>}
        <h3 className="mt-1.5 text-xl font-extrabold tracking-tight"><Link href={detail} className="hover:underline">{p.nama}</Link></h3>
        {p.ringkas && <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.ringkas}</p>}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-base font-extrabold">{rupiah(p.harga)}</span>
          {p.harga_coret > 0 && <span className="text-sm text-ink/45 line-through">{rupiah(p.harga_coret)}</span>}
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2.5 pt-5">
          {p.link
            ? <a href={p.link} target="_blank" rel="noopener" className="btn-outline px-3">Etalase <span aria-hidden="true">↗</span></a>
            : <Link href={detail} className="btn-outline px-3">Detail</Link>}
          <Link href={`${detail}#order`} className="btn-primary px-3">Order</Link>
        </div>
        <Link href={detail} className="tautan mt-4 self-start text-sm">Detail {p.nama}</Link>
      </div>
    </article>
  )
}
