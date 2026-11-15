'use client'
import { MessageCircle } from 'lucide-react'
import { useSite } from '@/app/providers'
import { waLink } from '@/lib/format'

// Ditampilkan di halaman yang butuh akun ketika Supabase belum diatur.
export default function OfflineNote() {
  const { settings: s } = useSite()
  return (
    <div className="card mt-6 p-6 text-center">
      <p className="text-sm text-ink/70">Fitur akun belum aktif. Untuk pesanan dan pertanyaan, hubungi kami langsung lewat WhatsApp.</p>
      <a href={waLink(s.wa_number, `Halo ${s.owner.nama}, saya ingin menanyakan pesanan saya.`)} target="_blank" rel="noopener" className="btn mt-4 w-full bg-[#25D366] text-white"><MessageCircle size={18} /> Hubungi via WhatsApp</a>
    </div>
  )
}
