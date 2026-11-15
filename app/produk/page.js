'use client'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Shell from '@/components/Shell'
import Loading from '@/components/Loading'
import OrderButton from '@/components/OrderButton'
import { useSite } from '../providers'
import { loadCategories, loadProduct } from '@/lib/store'
import { rupiah } from '@/lib/format'
import { asset } from '@/lib/config'

function Product() {
  const slug = useSearchParams().get('slug')
  const { settings: s } = useSite()
  const [p, setP] = useState(undefined)
  const [cats, setCats] = useState([])
  useEffect(() => { loadProduct(slug).then(setP).catch(() => setP(null)); loadCategories().then(setCats).catch(() => {}) }, [slug])
  useEffect(() => { if (p) document.title = `${p.nama} · ${s.nama_usaha}` }, [p, s.nama_usaha])
  if (p === undefined) return <div className="py-14"><Loading /></div>
  if (!p || !p.aktif) return <p className="py-14 text-sm text-ink/70">Produk tidak ditemukan. <Link href="/#katalog" className="tautan">Kembali ke katalog</Link></p>
  const kat = cats.find((c) => c.id === p.kategori_id)
  return (
    <article className="py-8 sm:py-12">
      <nav className="text-[13px] text-ink/60" aria-label="Jejak halaman">
        <Link href="/#katalog" className="hover:text-ink hover:underline">Produk &amp; layanan</Link>
        {kat && <> <span aria-hidden="true">/</span> <Link href={`/?kategori=${kat.slug}#katalog`} className="hover:text-ink hover:underline">{kat.nama}</Link></>}
        <span aria-hidden="true"> /</span> <span className="text-ink">{p.nama}</span>
      </nav>
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
        <div className="order-2 lg:order-1">
          {p.gambar_url && <div className="aspect-[16/10] overflow-hidden bg-abu"><img src={asset(p.gambar_url)} alt="" className="h-full w-full object-cover" /></div>}
          {p.deskripsi && <div className="prose-gw mt-7 text-[15px] text-ink/80">{p.deskripsi.split('\n').filter(Boolean).map((t, i) => <p key={i}>{t}</p>)}</div>}
          {p.fitur?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-extrabold">Yang Anda dapat</h2>
              <ul className="mt-3 divide-y divide-garis border-y border-garis text-[15px]">
                {p.fitur.map((f, i) => <li key={i} className="flex gap-3 py-3"><span aria-hidden="true" className="font-bold">✓</span>{f}</li>)}
              </ul>
            </div>
          )}
        </div>
        <div className="order-1 lg:sticky lg:top-32 lg:order-2 lg:self-start">
          {kat && <div className="eyebrow">{kat.nama}</div>}
          <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{p.nama}</h1>
          {p.ringkas && <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{p.ringkas}</p>}
          <div className="mt-5 flex items-baseline gap-2.5 border-y border-garis py-4">
            <span className="text-2xl font-extrabold">{rupiah(p.harga)}</span>
            {p.harga_coret > 0 && <span className="text-sm text-ink/45 line-through">{rupiah(p.harga_coret)}</span>}
          </div>
          {p.link && <a href={p.link} target="_blank" rel="noopener" className="btn-outline mt-5 w-full">View Product <span aria-hidden="true">↗</span></a>}
          <div id="order" className="mt-3 scroll-mt-32"><OrderButton product={p} /></div>
        </div>
      </div>
    </article>
  )
}

export default function Page() {
  return <Shell><Suspense fallback={<Loading />}><Product /></Suspense></Shell>
}
