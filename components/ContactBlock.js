import { waLink } from '@/lib/format'

// "Contact me": blok hitam dengan nomor WhatsApp yang bisa dibaca langsung.
export default function ContactBlock({ settings: s, className = '' }) {
  const nomor = '+' + s.wa_number.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '$1 $2-$3-$4')
  return (
    <a href={waLink(s.wa_number, `Halo ${s.owner.nama}, saya ingin bertanya tentang ${s.nama_usaha}.`)} target="_blank" rel="noopener"
      className={`group flex items-center justify-between gap-4 rounded-xl bg-ink px-5 py-4 text-white transition-colors hover:bg-api ${className}`}>
      <span>
        <span className="block font-mono text-[11px] uppercase tracking-[.14em] text-white/65">Contact me · WhatsApp</span>
        <span className="mt-1 block text-lg font-extrabold tracking-tight">{nomor}</span>
      </span>
      <span aria-hidden="true" className="text-2xl transition-transform group-hover:translate-x-1">→</span>
    </a>
  )
}
