import Link from 'next/link'
import Shell from '@/components/Shell'

export default function NotFound() {
  return (
    <Shell>
      <div className="mt-12">
        <div className="eyebrow">Galat 404</div>
        <h1 className="mt-1.5 text-[28px] font-extrabold tracking-tight">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-sm text-ink/70">Alamatnya mungkin salah ketik, atau halamannya sudah dipindahkan.</p>
        <Link href="/" className="btn-primary mt-5">Kembali ke beranda</Link>
      </div>
    </Shell>
  )
}
