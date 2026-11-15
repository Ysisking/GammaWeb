import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// null bila Supabase belum diatur: web berjalan dalam mode etalase + WhatsApp.
export const supabase = url && key
  ? createClient(url, key, { auth: { persistSession: true, storageKey: 'gammaweb-auth' } })
  : null
