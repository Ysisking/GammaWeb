'use client'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Shell from '@/components/Shell'
import Loading from '@/components/Loading'
import OrderButton from '@/components/OrderButton'
import { useSite } from '../providers'
import { loadProduct } from '@/lib/store'
import { rupiah } from '@/lib/format'
import { asset } from '@/lib/config'

function Product() {
  const slug = useSearchParams().get('slug')
  const { settings: s } = useSite()
  const [p, setP] = useState(undefined)
  useEffect(() => { loadProduct(slug).then(setP).catch(() => setP(null)) }, [slug])
  useEffect(() => { if (p) document.title = `${p.nama} · ${s.nama_usaha}` }, [p, s.nama_usaha])
  if (p === undefined) return <Loading />
  if (!p || !p.aktif) return <p className="mt-8 text-sm text-ink/70">Produk tidak ditemukan. <Link href="/#etalase" className="tautan">Kembali ke etalase</Link></p>
  return (
    <article className="mt-5">
      <Link href="/#etalase" className="text-[13px] font-semibold text-ink/60 transition-colors hover:text-api">← Etalase</Link>
      {p.gambar_url && <div className="mt-4 aspect-[2/1] overflow-hidden rounded-xl bg-abu"><img src={asset(p.gambar_url)} alt="" className="h-full w-full object-cover" /></div>}
      <div className="eyebrow mt-6">{p.jenis === 'jasa' ? 'Jasa' : 'Produk digital'}</div>
      <h1 className="mt-1.5 text-[26px] font-extrabold leading-tight tracking-tight">{p.nama}</h1>
      <div className="mt-3 flex items-baseline gap-2.5 border-y border-garis py-3">
        <span className="text-xl font-extrabold">{rupiah(p.harga)}</span>
        {p.harga_coret > 0 && <span className="text-sm text-ink/45 line-through">{rupiah(p.harga_coret)}</span>}
      </div>
      {p.deskripsi && <div className="prose-gw mt-5 text-[15px] text-ink/80">{p.deskripsi.split('\n').filter(Boolean).map((t, i) => <p key={i}>{t}</p>)}</div>}
      {p.fitur?.length > 0 && (
        <div className="mt-5">
          <div className="eyebrow">Yang Anda dapat</div>
          <ul className="mt-2 divide-y divide-garis border-y border-garis text-sm">
            {p.fitur.map((f, i) => <li key={i} className="flex gap-3 py-2.5"><span aria-hidden="true" className="font-mono text-xs text-api">{String(i + 1).padStart(2, '0')}</span>{f}</li>)}
          </ul>
        </div>
      )}
      <div className="mt-7"><OrderButton product={p} /></div>
    </article>
  )
}

export default function Page() {
  return <Shell><Suspense fallback={<Loading />}><Product /></Suspense></Shell>
}
