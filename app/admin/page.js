'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Shell from '@/components/Shell'
import Loading from '@/components/Loading'
import AdminPanel from '@/components/admin/AdminPanel'
import { useSite } from '../providers'
import { useRequireUser } from '@/lib/useRequireUser'

export default function Page() {
  const { online, isOwner } = useSite()
  const ok = useRequireUser('/admin/')
  const router = useRouter()
  useEffect(() => { if (ok && !isOwner) router.replace('/') }, [ok, isOwner, router])
  if (!online) {
    return (
      <Shell hideOwner>
        <div className="card mt-6 p-6 text-sm leading-relaxed text-ink/80">
          <h1 className="text-xl font-extrabold">Panel kelola belum aktif</h1>
          <p className="mt-2">Panel ini butuh Supabase untuk menyimpan produk, pesanan, dan ulasan. Ikuti bagian "Mengaktifkan login" di README GammaWeb, lalu deploy ulang.</p>
        </div>
      </Shell>
    )
  }
  return <Shell hideOwner wide>{ok && isOwner ? <AdminPanel /> : <Loading />}</Shell>
}
