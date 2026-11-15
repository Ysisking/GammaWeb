import './globals.css'
import Providers from './providers'
import { SEED } from '@/data/seed'
import { BASE } from '@/lib/config'

export const metadata = {
  title: { default: `${SEED.settings.nama_usaha} · @${SEED.settings.username}`, template: `%s · ${SEED.settings.nama_usaha}` },
  description: SEED.settings.deskripsi,
  icons: { icon: BASE + '/ikon-aplikasi.png' },
  openGraph: { title: SEED.settings.nama_usaha, description: SEED.settings.tagline, images: [BASE + '/sampul-default.jpg'] },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-dvh"><Providers>{children}</Providers></body>
    </html>
  )
}
