'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSite } from '@/app/providers'
import { signOut } from '@/lib/store'
import { asset } from '@/lib/config'

export default function TopBar() {
  const { user, isOwner, online } = useSite()
  const router = useRouter()
  async function logout() { await signOut(); router.push('/') }
  const link = 'rounded px-2.5 py-2 text-[13px] font-semibold text-ink/70 transition-colors hover:text-ink'
  return (
    <header className="border-b border-garis bg-abu">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" aria-label="Beranda"><img src={asset('/logo.svg')} alt="gammaproject" className="h-[22px]" /></Link>
        <nav className="-mr-2.5 flex items-center">
          {user ? (
            <>
              {isOwner && <Link href="/admin/" className={link}>Kelola</Link>}
              <Link href="/pesanan/" className={link}>Pesanan</Link>
              <Link href="/akun/" className={link}>Akun</Link>
              <button onClick={logout} className={link}>Keluar</button>
            </>
          ) : online ? (
            <Link href="/masuk/" className={`${link} text-ink`}>Masuk</Link>
          ) : (
            <Link href="/#etalase" className={link}>Etalase</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
