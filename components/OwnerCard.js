import ContactIcons from './ContactIcons'
import { asset } from '@/lib/config'

// Profil pemilik usaha: pita abu selebar layar, tampil di semua halaman pelanggan lewat Shell.
export default function OwnerCard({ settings: s }) {
  const o = s.owner
  return (
    <section className="bg-abu" aria-label="Pemilik usaha">
      <div className="wadah grid gap-8 py-12 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-10">
        {o.foto_url
          ? <img src={asset(o.foto_url)} alt="" className="h-24 w-24 rounded-full object-cover md:h-28 md:w-28" />
          : <div aria-hidden="true" className="flex h-24 w-24 items-center justify-center rounded-full bg-ink text-4xl font-extrabold text-white md:h-28 md:w-28">{(o.nama || '?').trim().charAt(0).toUpperCase()}</div>}
        <div className="max-w-2xl">
          <div className="eyebrow">Pemilik usaha</div>
          <div className="mt-1.5 text-2xl font-extrabold tracking-tight">{o.nama}</div>
          <div className="text-sm text-ink/60">{o.jabatan}</div>
          {o.bio && <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{o.bio}</p>}
          {o.instagram && <a href={`https://instagram.com/${o.instagram}`} target="_blank" rel="noopener" className="tautan mt-3 inline-block text-sm">Instagram @{o.instagram}</a>}
        </div>
        <div>
          <div className="mb-3 text-sm font-bold">Hubungi langsung</div>
          <ContactIcons settings={s} label />
        </div>
      </div>
    </section>
  )
}
