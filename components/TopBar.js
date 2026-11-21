'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, UserRound, X } from 'lucide-react'
import { useSite } from '@/app/providers'
import { signOut } from '@/lib/store'
import { asset } from '@/lib/config'

const NAV = [
  ['/?kategori=produk#katalog', 'Produk'],
  ['/?kategori=layanan#katalog', 'Layanan'],
  ['/tentang/', 'Tentang'],
  ['/ulasan/', 'Review'],
]

// Header: bar putih berisi logo, menu, dan akun.
export default function TopBar() {
  const { user, isOwner } = useSite()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  async function logout() { await signOut(); setOpen(false); router.push('/') }
  const item = 'text-[15px] font-semibold text-ink/80 transition-colors hover:text-ink'
  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="border-b border-garis">
        <div className="wadah flex h-16 items-center gap-8">
          <Link href="/" aria-label="Beranda" className="flex flex-none items-center gap-3">
            <img src={asset('/logo.svg')} alt="gammaproject" className="h-6" />
            <span className="hidden border-l border-garis pl-3 text-[13px] font-semibold text-ink/60 sm:block">official store</span>
          </Link>
          <nav className="hidden flex-1 items-center gap-7 lg:flex" aria-label="Menu utama">
            {NAV.map(([href, label]) => <Link key={label} href={href} className={item}>{label}</Link>)}
          </nav>
          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            {user ? (
              <div className="hidden items-center gap-5 lg:flex">
                {isOwner && <Link href="/admin/" className={item}>Kelola</Link>}
                <Link href="/pesanan/" className={item}>Pesanan</Link>
                <Link href="/akun/" className={`${item} flex items-center gap-1.5`}><UserRound size={18} />{user.nama.split(' ')[0]}</Link>
                <button onClick={logout} className={item}>Keluar</button>
              </div>
            ) : (
              <Link href="/masuk/" className={`${item} flex items-center gap-1.5 rounded-sm px-2 py-2`}><UserRound size={18} /><span>Masuk <span className="hidden sm:inline">/ Daftar</span></span></Link>
            )}
            <button onClick={() => setOpen(!open)} className="-mr-2 p-2 lg:hidden" aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open}>{open ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
      </div>
      {open && (
        <nav className="border-b border-garis bg-white lg:hidden" aria-label="Menu utama">
          <div className="wadah flex flex-col py-2">
            {NAV.map(([href, label]) => <Link key={label} href={href} onClick={() => setOpen(false)} className="border-b border-garis py-3.5 text-base font-semibold last:border-0">{label}</Link>)}
            {user && (
              <>
                {isOwner && <Link href="/admin/" onClick={() => setOpen(false)} className="border-b border-garis py-3.5 text-base font-semibold">Kelola</Link>}
                <Link href="/pesanan/" onClick={() => setOpen(false)} className="border-b border-garis py-3.5 text-base font-semibold">Pesanan saya</Link>
                <Link href="/akun/" onClick={() => setOpen(false)} className="border-b border-garis py-3.5 text-base font-semibold">Akun</Link>
                <button onClick={logout} className="py-3.5 text-left text-base font-semibold">Keluar</button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
