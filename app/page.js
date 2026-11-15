'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BadgeCheck, Info, MessageCircle, ShoppingBag, Star } from 'lucide-react'
import Shell from '@/components/Shell'
import Showcase from '@/components/Showcase'
import OwnerCard from '@/components/OwnerCard'
import { useSite } from './providers'
import { loadCategories, loadProducts, loadReviews } from '@/lib/store'
import { waLink } from '@/lib/format'
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
    { href: '/tentang/', icon: Info, t: 'About gammaproject', d: 'Siapa di balik GammaWeb' },
    { href: '/ulasan/', icon: Star, t: 'Review', d: avg ? `${avg} dari 5 · ${reviews.length} ulasan` : 'Lihat dan tulis ulasan' },
    { href: '/#etalase', icon: ShoppingBag, t: 'Order produk/jasa', d: 'Pilih dari etalase, lalu pesan' },
  ]
  return (
    <Shell hideOwner>
      <section className="-mx-4">
        <div className="aspect-[2/1] w-full overflow-hidden bg-ink sm:rounded-b-3xl"><img src={asset(s.sampul_url)} alt="" className="h-full w-full object-cover" /></div>
      </section>
      <section className="relative -mt-12 flex flex-col items-center text-center">
        <img src={asset(s.foto_profil_url)} alt={s.nama_usaha} className="h-24 w-24 rounded-full border-4 border-abu bg-white object-cover shadow-card" />
        <h1 className="mt-3 flex items-center gap-1.5 text-2xl font-extrabold">{s.nama_usaha} <BadgeCheck size={20} className="text-api" aria-label="Terverifikasi" /></h1>
        <div className="text-sm font-semibold text-ink/50">@{s.username}</div>
        {s.tagline && <div className="mt-1 text-sm font-semibold text-ink/80">{s.tagline}</div>}
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">{s.deskripsi}</p>
      </section>

      <section className="mt-6"><OwnerCard settings={s} /></section>

      <section id="etalase" className="mt-8 scroll-mt-20">
        <h2 className="mb-3 text-lg font-extrabold">Etalase produk &amp; jasa</h2>
        {products ? <Showcase categories={categories} products={products} /> : <div className="card p-6 text-center text-sm text-ink/50">Memuat etalase…</div>}
      </section>

      <section className="mt-8 grid gap-3">
        {menu.map(({ href, icon: I, t, d }) => (
          <Link key={t} href={href} className="card flex items-center gap-4 p-4 transition hover:shadow-lift">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-api-soft text-api"><I size={20} /></span>
            <span className="min-w-0 flex-1"><span className="block font-extrabold">{t}</span><span className="block truncate text-xs text-ink/60">{d}</span></span>
            <span className="text-ink/30">›</span>
          </Link>
        ))}
      </section>

      <section className="mt-8">
        <a href={waLink(s.wa_number, `Halo ${s.owner.nama}, saya ingin bertanya tentang ${s.nama_usaha}.`)} target="_blank" rel="noopener" className="btn w-full bg-[#25D366] py-4 text-base text-white hover:bg-[#1fb857]">
          <MessageCircle size={20} /> Contact me · WhatsApp
        </a>
        <div className="mt-2 text-center text-xs text-ink/50">+{s.wa_number.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '$1 $2-$3-$4')}</div>
      </section>
    </Shell>
  )
}
