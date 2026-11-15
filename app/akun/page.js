'use client'
import Shell from '@/components/Shell'
import Loading from '@/components/Loading'
import OfflineNote from '@/components/OfflineNote'
import AccountForm from '@/components/AccountForm'
import { useSite } from '../providers'
import { useRequireUser } from '@/lib/useRequireUser'

export default function Page() {
  const { user, online } = useSite()
  const ok = useRequireUser('/akun/')
  return <Shell><div className="mx-auto max-w-xl py-10 sm:py-14">{!online ? <OfflineNote /> : ok ? <AccountForm user={user} /> : <Loading />}</div></Shell>
}
