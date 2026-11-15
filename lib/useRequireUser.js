'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSite } from '@/app/providers'

// Arahkan ke halaman masuk bila belum login. Mengembalikan true bila sudah siap dipakai.
export function useRequireUser(next) {
  const { user, ready, online } = useSite()
  const router = useRouter()
  useEffect(() => {
    if (online && ready && !user) router.replace('/masuk/?next=' + encodeURIComponent(next))
  }, [online, ready, user, next, router])
  return online && ready && !!user
}
