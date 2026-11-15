'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from './ProductCard'

// Katalog dengan sub-menu: Semua + setiap kategori (tetap tampil walau masih kosong).
// Kategori bisa dipilih lewat alamat, mis. /?kategori=website#katalog dari menu atas.
export default function Showcase({ categories, products }) {
  const dariAlamat = useSearchParams().get('kategori')
  const [active, setActive] = useState('semua')
  useEffect(() => {
    const c = categories.find((x) => x.slug === dariAlamat)
    setActive(c ? c.id : 'semua')
  }, [dariAlamat, categories])
  const tabs = [{ id: 'semua', nama: 'Semua' }, ...categories]
  const list = active === 'semua' ? products : products.filter((p) => p.kategori_id === active)
  const n = (id) => (id === 'semua' ? products.length : products.filter((p) => p.kategori_id === id).length)
  const namaKat = (id) => categories.find((c) => c.id === id)?.nama
  return (
    <div>
      <div role="tablist" aria-label="Kategori" className="-mx-5 flex gap-7 overflow-x-auto border-b border-garis px-5 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={active === t.id} onClick={() => setActive(t.id)}
            className={`-mb-px flex-none border-b-[3px] pb-3 pt-1 text-[15px] font-bold transition-colors ${active === t.id ? 'border-ink text-ink' : 'border-transparent text-ink/55 hover:text-ink'}`}>
            {t.nama} <span className="font-normal text-ink/45">({n(t.id)})</span>
          </button>
        ))}
      </div>
      {list.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <ProductCard key={p.id} p={p} kategori={namaKat(p.kategori_id)} />)}
        </div>
      ) : (
        <div className="mt-8 border border-dashed border-garis px-6 py-14 text-center">
          <div className="text-lg font-extrabold">Segera hadir</div>
          <p className="mt-1 text-sm text-ink/60">Belum ada isi di kategori {namaKat(active) || 'ini'}. Pantau terus, atau tanyakan langsung ke pemilik.</p>
        </div>
      )}
    </div>
  )
}
