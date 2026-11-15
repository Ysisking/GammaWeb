'use client'
import { useState } from 'react'
import SettingsTab from './SettingsTab'
import ProductsTab from './ProductsTab'
import CategoriesTab from './CategoriesTab'
import OrdersTab from './OrdersTab'
import ReviewsTab from './ReviewsTab'

const TABS = [['pengaturan', 'Pengaturan'], ['produk', 'Produk & jasa'], ['kategori', 'Kategori'], ['pesanan', 'Pesanan'], ['ulasan', 'Ulasan']]

export default function AdminPanel() {
  const [tab, setTab] = useState('pesanan')
  return (
    <div className="mt-6">
      <h1 className="text-2xl font-extrabold">Kelola GammaWeb</h1>
      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {TABS.map(([id, t]) => <button key={id} onClick={() => setTab(id)} className={`chip flex-none px-4 py-2 text-sm ${tab === id ? 'bg-ink text-white' : 'bg-white text-ink/70'}`}>{t}</button>)}
      </div>
      <div className="mt-4">
        {tab === 'pengaturan' && <SettingsTab />}
        {tab === 'produk' && <ProductsTab />}
        {tab === 'kategori' && <CategoriesTab />}
        {tab === 'pesanan' && <OrdersTab />}
        {tab === 'ulasan' && <ReviewsTab />}
      </div>
    </div>
  )
}
