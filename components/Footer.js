import Link from 'next/link'
import ContactIcons from './ContactIcons'
import { asset } from '@/lib/config'

export const POLICY_LINKS = [
  ['/ketentuan-layanan/', 'Ketentuan Layanan'],
  ['/kebijakan-privasi/', 'Kebijakan Privasi'],
  ['/kebijakan-retur-dana/', 'Kebijakan Retur Dana'],
  ['/kebijakan-pengiriman/', 'Kebijakan Pengiriman'],
]
const KATALOG = [['/?kategori=website#katalog', 'Website'], ['/?kategori=produk#katalog', 'Produk'], ['/?kategori=layanan#katalog', 'Layanan']]
const TOKO = [['/tentang/', 'About gammaproject'], ['/ulasan/', 'Review'], ['/pesanan/', 'Pesanan saya']]

export default function Footer({ settings: s }) {
  const kolom = (judul, links) => (
    <div>
      <div className="text-sm font-bold text-white">{judul}</div>
      <ul className="mt-3 space-y-2.5 text-sm">
        {links.map(([href, label]) => <li key={href}><Link href={href} className="text-white/70 transition-colors hover:text-white hover:underline">{label}</Link></li>)}
      </ul>
    </div>
  )
  return (
    <footer className="bg-ink text-white">
      <div className="wadah grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <img src={asset('/logo-terbalik.svg')} alt="gammaproject" className="h-7" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">{s.tagline}</p>
          <div className="mt-5"><ContactIcons settings={s} terang /></div>
        </div>
        {kolom('Katalog', KATALOG)}
        {kolom('Toko', TOKO)}
        {kolom('Kebijakan', POLICY_LINKS)}
      </div>
      <div className="border-t border-white/15">
        <div className="wadah flex flex-col gap-2 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} gammaproject. Hak cipta dilindungi.</span>
          <nav className="flex flex-wrap gap-x-5 gap-y-1">
            {POLICY_LINKS.map(([href, label]) => <Link key={href} href={href} className="hover:text-white hover:underline">{label}</Link>)}
          </nav>
        </div>
      </div>
    </footer>
  )
}
