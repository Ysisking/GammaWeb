'use client'
import { useState } from 'react'
import ProductCard from './ProductCard'

// Etalase dengan sub-menu kategori. Tab "Semua" selalu ada di depan.
export default function Showcase({ categories, products }) {
  const [active, setActive] = useState('semua')
  const tabs = [{ id: 'semua', nama: 'Semua' }, ...categories.filter((c) => products.some((p) => p.kategori_id === c.id))]
  const list = active === 'semua' ? products : products.filter((p) => p.kategori_id === active)
  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActive(t.id)} className={`chip flex-none px-4 py-2 text-sm transition ${active === t.id ? 'bg-ink text-white' : 'bg-white text-ink/70 hover:text-ink'}`}>{t.nama}</button>
        ))}
      </div>
      <div className="mt-3 grid gap-3">
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
        {list.length === 0 && <div className="card p-6 text-center text-sm text-ink/60">Belum ada produk di kategori ini.</div>}
      </div>
    </div>
  )
}
