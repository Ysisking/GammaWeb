'use client'
import { useState } from 'react'
import ProductCard from './ProductCard'

// Etalase dengan sub-menu kategori. Tab "Semua" selalu ada di depan.
export default function Showcase({ categories, products }) {
  const [active, setActive] = useState('semua')
  const tabs = [{ id: 'semua', nama: 'Semua' }, ...categories.filter((c) => products.some((p) => p.kategori_id === c.id))]
  const list = active === 'semua' ? products : products.filter((p) => p.kategori_id === active)
  const n = (id) => (id === 'semua' ? products.length : products.filter((p) => p.kategori_id === id).length)
  return (
    <div>
      <div role="tablist" aria-label="Kategori" className="-mx-4 flex gap-5 overflow-x-auto border-b border-garis px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={active === t.id} onClick={() => setActive(t.id)}
            className={`-mb-px flex-none border-b-2 pb-2.5 pt-1 text-sm font-semibold transition-colors ${active === t.id ? 'border-ink text-ink' : 'border-transparent text-ink/50 hover:text-ink'}`}>
            {t.nama} <span className="font-mono text-[11px] font-normal text-ink/40">{n(t.id)}</span>
          </button>
        ))}
      </div>
      <div className="card mt-4 divide-y divide-garis overflow-hidden">
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
        {list.length === 0 && <div className="p-6 text-sm text-ink/60">Belum ada produk di kategori ini.</div>}
      </div>
    </div>
  )
}
