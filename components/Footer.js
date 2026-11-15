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
    <footer className="mt-6 border-t border-ink/10">
      <div className="mx-auto max-w-5xl px-4 py-8 text-center">
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold text-ink/70">
          {POLICY_LINKS.map(([href, label]) => <Link key={href} href={href} className="underline-offset-4 hover:text-api hover:underline">{label}</Link>)}
        </nav>
        <div className="mt-5 flex flex-col items-center gap-2 text-[11px] text-ink/50">
          <img src={asset('/logo.svg')} alt="gammaproject" className="h-5 opacity-80" />
          <span>© {new Date().getFullYear()} {s.nama_usaha} · dibuat oleh gammaproject</span>
        </div>
      </div>
    </footer>
  )
}
