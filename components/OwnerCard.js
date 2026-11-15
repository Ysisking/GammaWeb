import { Instagram, MessageCircle } from 'lucide-react'
import { waLink } from '@/lib/format'
import { asset } from '@/lib/config'

// Profil pemilik usaha. Dipasang di semua halaman pelanggan lewat Shell.
export default function OwnerCard({ settings: s }) {
  const o = s.owner
  return (
    <div className="card flex items-center gap-4 p-4">
      <img src={asset(o.foto_url || s.foto_profil_url)} alt={o.nama} className="h-16 w-16 flex-none rounded-2xl object-cover" />
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-api">Pemilik usaha</div>
        <div className="truncate text-base font-extrabold">{o.nama}</div>
        <div className="truncate text-xs text-ink/60">{o.jabatan}</div>
        {o.bio && <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink/70">{o.bio}</p>}
      </div>
      <div className="flex flex-none flex-col gap-2">
        <a href={waLink(s.wa_number, `Halo ${o.nama}, saya lihat ${s.nama_usaha} dan ingin bertanya.`)} target="_blank" rel="noopener" className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366] text-white" aria-label="WhatsApp"><MessageCircle size={18} /></a>
        {o.instagram && <a href={`https://instagram.com/${o.instagram}`} target="_blank" rel="noopener" className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white" aria-label="Instagram"><Instagram size={18} /></a>}
      </div>
    </div>
  )
}
