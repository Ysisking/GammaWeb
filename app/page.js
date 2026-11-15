'use client'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import Shell from '@/components/Shell'
import Showcase from '@/components/Showcase'
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
    { href: '/tentang/', t: 'About gammaproject', d: 'Siapa di balik toko ini dan apa saja yang dikerjakan.', aksi: 'Baca selengkapnya' },
    { href: '/ulasan/', t: 'Review', d: avg ? `${avg} dari 5, berdasarkan ${reviews.length} ulasan pelanggan.` : 'Baca pengalaman pelanggan, atau tulis ulasan Anda sendiri.', aksi: 'Lihat review' },
    { href: '/#katalog', t: 'Order produk/jasa', d: 'Pilih dari katalog, tekan Order, lalu konfirmasi. Akun hanya diminta saat memesan.', aksi: 'Mulai order' },
  ]
  return (
    <Shell bleed>
      {/* Hero: foto sampul mengisi sisi kanan dan melebur ke latar hitam lewat gradasi,
          jadi teks di kiri tetap terbaca dan foto tidak terlihat seperti tempelan. */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <img src={asset(s.sampul_url)} alt="" className="absolute inset-y-0 right-0 -z-20 h-full w-full object-cover object-[center_38%] lg:w-[64%]" />
        {/* Ponsel/tablet: foto jadi latar seluruh hero, digelapkan dari atas ke bawah. */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 lg:hidden" style={{ background: 'linear-gradient(180deg, rgba(11,11,11,.78) 0%, rgba(11,11,11,.86) 45%, rgba(11,11,11,.97) 100%)' }} />
        {/* Desktop: hitam pekat di kiri, memudar ke foto di kanan; tepi atas-bawah ikut diredam. */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 hidden lg:block" style={{ background: 'linear-gradient(90deg, #0B0B0B 0%, #0B0B0B 36%, rgba(11,11,11,.86) 46%, rgba(11,11,11,.45) 62%, rgba(11,11,11,.12) 82%, rgba(11,11,11,.3) 100%), linear-gradient(180deg, rgba(11,11,11,.35) 0%, rgba(11,11,11,0) 22%, rgba(11,11,11,0) 70%, rgba(11,11,11,.75) 100%)' }} />
        <div className="wadah">
          <div className="flex max-w-xl flex-col justify-center py-14 sm:py-20 lg:min-h-[560px] lg:py-24">
            <div className="flex items-center gap-3">
              <img src={asset(s.foto_profil_url)} alt="" className="h-11 w-11 rounded-full border border-white/25 object-cover" />
              <span className="text-sm font-semibold text-white/80">@{s.username}</span>
            </div>
            <h1 className="mt-6 text-[40px] font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-[64px]">{s.nama_usaha}</h1>
            {s.tagline && <p className="mt-5 text-lg font-semibold leading-snug sm:text-xl">{s.tagline}</p>}
            <p className="mt-3 text-[15px] leading-relaxed text-white/80">{s.deskripsi}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#katalog" className="btn-terang">Lihat katalog</Link>
              <Link href="/tentang/" className="btn-garis-terang">Tentang gammaproject</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Katalog dengan sub-menu */}
      <section id="katalog" className="scroll-mt-28 py-12 sm:py-16">
        <div className="wadah">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Produk &amp; layanan</h2>
          <p className="mt-2 max-w-2xl text-[15px] text-ink/70">Buka tampilan asli tiap produk dari tombol di kartunya, atau tekan <b>Order</b> untuk memesan.</p>
          <div className="mt-8">
            {products
              ? <Suspense fallback={null}><Showcase categories={categories} products={products} /></Suspense>
              : <div className="text-sm text-ink/50">Memuat katalog…</div>}
          </div>
        </div>
      </section>

      {/* Kartu menu */}
      <section className="border-t border-garis py-12 sm:py-16">
        <div className="wadah grid gap-6 md:grid-cols-3">
          {menu.map(({ href, t, d, aksi }) => (
            <Link key={t} href={href} className="group flex flex-col border border-garis p-6 transition-colors hover:border-ink sm:p-7">
              <h3 className="text-xl font-extrabold tracking-tight">{t}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{d}</p>
              <span className="mt-5 text-sm font-bold">{aksi} <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span></span>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  )
}
