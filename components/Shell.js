'use client'
import { useSite } from '@/app/providers'
import OwnerCard from './OwnerCard'
import Footer from './Footer'
import TopBar from './TopBar'

// Kerangka semua halaman: header, isi, profil pemilik (selalu tampil), footer.
// `bleed` = isi mengatur lebarnya sendiri (untuk hero selebar layar).
export default function Shell({ children, hideOwner = false, bleed = false }) {
  const { settings } = useSite()
  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar />
      <main className="flex-1">{bleed ? children : <div className="wadah">{children}</div>}</main>
      {!hideOwner && <OwnerCard settings={settings} />}
      <Footer settings={settings} />
    </div>
  )
}
