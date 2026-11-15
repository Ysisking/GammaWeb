import { waLink } from '@/lib/format'
import { asset } from '@/lib/config'

// Profil pemilik usaha. Dipasang di semua halaman pelanggan lewat Shell.
export default function OwnerCard({ settings: s }) {
  const o = s.owner
  return (
    <div className="border-t border-ink pt-4">
      <div className="eyebrow">Pemilik usaha</div>
      <div className="mt-3 flex gap-3.5">
        {o.foto_url
          ? <img src={asset(o.foto_url)} alt="" className="h-12 w-12 flex-none rounded-full object-cover" />
          : <div aria-hidden="true" className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-ink text-lg font-extrabold text-white">{(o.nama || '?').trim().charAt(0).toUpperCase()}</div>}
        <div className="min-w-0">
          <div className="font-extrabold leading-tight">{o.nama}</div>
          <div className="text-[13px] text-ink/60">{o.jabatan}</div>
        </div>
      </div>
      {o.bio && <p className="mt-3 text-sm leading-relaxed text-ink/75">{o.bio}</p>}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
        <a href={waLink(s.wa_number, `Halo ${o.nama}, saya lihat ${s.nama_usaha} dan ingin bertanya.`)} target="_blank" rel="noopener" className="tautan">WhatsApp ↗</a>
        {o.instagram && <a href={`https://instagram.com/${o.instagram}`} target="_blank" rel="noopener" className="tautan">Instagram ↗</a>}
      </div>
    </div>
  )
}
