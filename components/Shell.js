'use client'
import { useSite } from '@/app/providers'
import OwnerCard from './OwnerCard'
import Footer from './Footer'
import TopBar from './TopBar'

// Kerangka semua halaman pelanggan: bar atas, isi, profil pemilik (selalu tampil), footer.
export default function Shell({ children, hideOwner = false, wide = false }) {
  const { settings } = useSite()
  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar />
      <main className={`mx-auto w-full flex-1 px-4 pb-14 ${wide ? 'max-w-5xl' : 'max-w-xl'}`}>
        {children}
        {!hideOwner && <section className="mt-10"><OwnerCard settings={settings} /></section>}
      </main>
      <Footer settings={settings} />
    </div>
  )
}
