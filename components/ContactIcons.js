import { Mail } from 'lucide-react'
import WaIcon from './WaIcon'
import { waLink } from '@/lib/format'

// Kontak: logo WhatsApp dan ikon email. `terang` untuk dipakai di latar gelap.
export default function ContactIcons({ settings: s, terang = false, label = false }) {
  const dasar = 'inline-flex h-11 items-center justify-center gap-2 rounded-full transition-colors'
  const email = s.email || 'yatufht@gmail.com'
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={waLink(s.wa_number, `Halo ${s.owner.nama}, saya ingin bertanya tentang produk di ${s.nama_usaha}.`)} target="_blank" rel="noopener" aria-label="WhatsApp"
        className={`${dasar} ${label ? 'px-4' : 'w-11'} bg-[#25D366] text-white hover:bg-[#1EBE5A]`}>
        <WaIcon size={22} />{label && <span className="text-sm font-bold">WhatsApp</span>}
      </a>
      <a href={`mailto:${email}`} aria-label={`Email ${email}`}
        className={`${dasar} ${label ? 'px-4' : 'w-11'} ${terang ? 'bg-white text-ink hover:bg-white/85' : 'bg-ink text-white hover:bg-ink/80'}`}>
        <Mail size={20} />{label && <span className="text-sm font-bold">Email</span>}
      </a>
    </div>
  )
}
