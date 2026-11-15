'use client'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { loadSettings } from '@/lib/store'
import { OWNER_EMAIL } from '@/lib/config'
import { SEED } from '@/data/seed'

const Ctx = createContext(null)
export const useSite = () => useContext(Ctx)

const toUser = (u) => (u ? { id: u.id, email: u.email, nama: u.user_metadata?.nama || u.email.split('@')[0], no_wa: u.user_metadata?.no_wa || '' } : null)

export default function Providers({ children }) {
  const [settings, setSettings] = useState(SEED.settings)
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(!supabase)

  const refreshSettings = useCallback(() => loadSettings().then(setSettings).catch(() => {}), [])
  useEffect(() => { refreshSettings() }, [refreshSettings])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => { setUser(toUser(data.session?.user)); setReady(true) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(toUser(s?.user)))
    return () => sub.subscription.unsubscribe()
  }, [])

  const isOwner = !!user && user.email.toLowerCase() === OWNER_EMAIL
  return <Ctx.Provider value={{ settings, user, isOwner, ready, online: !!supabase, refreshSettings }}>{children}</Ctx.Provider>
}
