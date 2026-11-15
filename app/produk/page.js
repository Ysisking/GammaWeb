'use client'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Check, ChevronLeft } from 'lucide-react'
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
  if (!p || !p.aktif) return <div className="card mt-6 p-6 text-center text-sm text-ink/70">Produk tidak ditemukan. <Link href="/#etalase" className="font-bold text-api">Kembali ke etalase</Link></div>
  return (
    <>
      <Link href="/#etalase" className="btn-ghost -ml-3 mt-3 px-3 py-2 text-ink/70"><ChevronLeft size={16} /> Kembali ke etalase</Link>
      <article className="card mt-2 overflow-hidden">
        {p.gambar_url && <div className="aspect-[2/1] bg-ink/5"><img src={asset(p.gambar_url)} alt="" className="h-full w-full object-cover" /></div>}
        <div className="p-5">
          <span className={`chip ${p.jenis === 'jasa' ? 'bg-ink text-white' : 'bg-api-soft text-api-dark'}`}>{p.jenis === 'jasa' ? 'Jasa' : 'Produk digital'}</span>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight">{p.nama}</h1>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-api">{rupiah(p.harga)}</span>
            {p.harga_coret > 0 && <span className="text-sm text-ink/40 line-through">{rupiah(p.harga_coret)}</span>}
          </div>
          {p.deskripsi && <div className="prose-gw mt-4 text-sm text-ink/80">{p.deskripsi.split('\n').filter(Boolean).map((t, i) => <p key={i}>{t}</p>)}</div>}
          {p.fitur?.length > 0 && <ul className="mt-4 space-y-2 text-sm">{p.fitur.map((f, i) => <li key={i} className="flex gap-2"><Check size={16} className="mt-0.5 flex-none text-api" />{f}</li>)}</ul>}
          <div className="mt-6"><OrderButton product={p} /></div>
        </div>
      </article>
    </>
  )
}

export default function Page() {
  return <Shell><Suspense fallback={<Loading />}><Product /></Suspense></Shell>
}
