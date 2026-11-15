import Link from 'next/link'
import Shell from '@/components/Shell'

export default function NotFound() {
  return (
    <Shell>
      <div className="card mt-10 p-8 text-center">
        <div className="text-5xl font-extrabold text-ink/20">404</div>
        <p className="mt-2 text-sm text-ink/70">Halaman tidak ditemukan.</p>
        <Link href="/" className="btn-primary mt-4">Kembali ke beranda</Link>
      </div>
    </Shell>
  )
}
