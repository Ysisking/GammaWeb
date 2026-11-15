'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Shell from '@/components/Shell'
import Showcase from '@/components/Showcase'
import OwnerCard from '@/components/OwnerCard'
import ContactBlock from '@/components/ContactBlock'
import { useSite } from './providers'
import { loadCategories, loadProducts, loadReviews } from '@/lib/store'
import { asset } from '@/lib/config'
import { SEED } from '@/data/seed'

export default function Home() {
  const { settings: s } = useSite()
  const [categories, setCategories] = useState(SEED.categories)
  const [products, setProducts] = useState(null)
  const [reviews, setReviews] = useState([])
  useEffect(() => {
    loadCategories().then(setCategories).catch(() => {})
    loadProducts().then(setProducts).catch(() => setProducts([]))
    loadReviews().then(setReviews).catch(() => {})
  }, [])
  const avg = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : null
  const menu = [
    { href: '/tentang/', t: 'About gammaproject', d: 'Siapa di balik GammaWeb dan apa saja yang dikerjakan.' },
    { href: '/ulasan/', t: 'Review', d: avg ? `${avg} dari 5, berdasarkan ${reviews.length} ulasan pelanggan.` : 'Baca pengalaman pelanggan, atau tulis ulasan Anda.' },
    { href: '/#etalase', t: 'Order produk/jasa', d: 'Pilih dari etalase, lalu pesan dalam dua langkah.' },
  ]
  return (
    <Shell hideOwner wide>
      <div className="lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14 lg:pt-10">
        {/* Kolom profil: sampul, foto, username, deskripsi, pemilik */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="-mx-4 aspect-[2/1] overflow-hidden bg-ink lg:mx-0 lg:rounded-xl">
            <img src={asset(s.sampul_url)} alt="" className="h-full w-full object-cover" />
          </div>
          <img src={asset(s.foto_profil_url)} alt="" className="relative -mt-9 h-[72px] w-[72px] rounded-lg border-[3px] border-abu bg-ink object-cover" />
          <h1 className="mt-3 text-[28px] font-extrabold leading-none tracking-tight">{s.nama_usaha}</h1>
          <div className="mt-1.5 font-mono text-[13px] text-ink/55">@{s.username}</div>
          {s.tagline && <p className="mt-4 text-[15px] font-bold leading-snug">{s.tagline}</p>}
          <p className="mt-2 text-sm leading-relaxed text-ink/75">{s.deskripsi}</p>
          <div className="mt-7"><OwnerCard settings={s} /></div>
          <ContactBlock settings={s} className="mt-7 hidden lg:flex" />
        </aside>

        <div className="mt-10 lg:mt-0">
          <section id="etalase" className="scroll-mt-6">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-xl font-extrabold tracking-tight">Etalase</h2>
              <span className="eyebrow">Produk &amp; jasa</span>
            </div>
            {products ? <Showcase categories={categories} products={products} /> : <div className="text-sm text-ink/50">Memuat etalase…</div>}
          </section>

          <section className="mt-12">
            <h2 className="mb-1 text-xl font-extrabold tracking-tight">Menu</h2>
            <div className="divide-y divide-garis border-y border-garis">
              {menu.map(({ href, t, d }) => (
                <Link key={t} href={href} className="group flex items-center justify-between gap-4 py-4">
                  <span className="min-w-0">
                    <span className="block font-bold group-hover:text-api">{t}</span>
                    <span className="block text-[13px] leading-snug text-ink/60">{d}</span>
                  </span>
                  <span aria-hidden="true" className="flex-none text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-api">→</span>
                </Link>
              ))}
            </div>
          </section>

          <ContactBlock settings={s} className="mt-10 lg:hidden" />
        </div>
      </div>
    </Shell>
  )
}
