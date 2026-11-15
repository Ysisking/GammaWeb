import Link from 'next/link'
import { asset } from '@/lib/config'

export const POLICY_LINKS = [
  ['/ketentuan-layanan/', 'Ketentuan Layanan'],
  ['/kebijakan-privasi/', 'Kebijakan Privasi'],
  ['/kebijakan-retur-dana/', 'Kebijakan Retur Dana'],
  ['/kebijakan-pengiriman/', 'Kebijakan Pengiriman'],
]

export default function Footer({ settings: s }) {
  return (
    <footer className="border-t border-ink">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <img src={asset('/logo.svg')} alt="gammaproject" className="h-5" />
          <div className="mt-2 text-xs text-ink/55">© {new Date().getFullYear()} {s.nama_usaha}, bagian dari gammaproject.</div>
        </div>
        <nav className="grid grid-cols-2 gap-x-8 gap-y-2 text-[13px] sm:text-right">
          {POLICY_LINKS.map(([href, label]) => <Link key={href} href={href} className="text-ink/70 underline-offset-4 transition-colors hover:text-api hover:underline">{label}</Link>)}
        </nav>
      </div>
    </footer>
  )
}
