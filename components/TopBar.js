'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogIn, LogOut, Package, Settings, User } from 'lucide-react'
import { useSite } from '@/app/providers'
import { signOut } from '@/lib/store'
import { asset } from '@/lib/config'

export default function TopBar() {
  const { user, isOwner, online } = useSite()
  const router = useRouter()
  async function logout() { await signOut(); router.push('/') }
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-abu/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Beranda"><img src={asset('/logo.svg')} alt="gammaproject" className="h-6" /></Link>
        <nav className="flex items-center gap-1 text-sm font-semibold">
          {user ? (
            <>
              {isOwner && <Link href="/admin/" className="btn-ghost px-3 py-2"><Settings size={16} /><span className="hidden sm:inline">Kelola</span></Link>}
              <Link href="/pesanan/" className="btn-ghost px-3 py-2"><Package size={16} /><span className="hidden sm:inline">Pesanan</span></Link>
              <Link href="/akun/" className="btn-ghost px-3 py-2"><User size={16} /><span className="hidden sm:inline">{user.nama.split(' ')[0]}</span></Link>
              <button onClick={logout} className="btn-ghost px-3 py-2" aria-label="Keluar"><LogOut size={16} /></button>
            </>
          ) : online ? (
            <Link href="/masuk/" className="btn-outline px-4 py-2"><LogIn size={16} /> Masuk</Link>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
