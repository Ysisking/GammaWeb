'use client'
import { useSite } from '@/app/providers'
import OwnerCard from './OwnerCard'
import Footer from './Footer'
import TopBar from './TopBar'

// Kerangka semua halaman pelanggan: bar atas, isi, kartu pemilik (selalu tampil), footer.
export default function Shell({ children, hideOwner = false, wide = false }) {
  const { settings } = useSite()
  return (
    <div className="min-h-dvh">
      <TopBar />
      <main className={`mx-auto w-full px-4 pb-10 ${wide ? 'max-w-5xl' : 'max-w-xl'}`}>
        {children}
        {!hideOwner && <section className="mt-8"><OwnerCard settings={settings} /></section>}
      </main>
      <Footer settings={settings} />
    </div>
  )
}
