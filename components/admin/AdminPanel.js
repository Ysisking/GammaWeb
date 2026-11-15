'use client'
import { useState } from 'react'
import SettingsTab from './SettingsTab'
import ProductsTab from './ProductsTab'
import CategoriesTab from './CategoriesTab'
import OrdersTab from './OrdersTab'
import ReviewsTab from './ReviewsTab'
import PoliciesTab from './PoliciesTab'

const TABS = [['pesanan', 'Pesanan'], ['produk', 'Produk & layanan'], ['kategori', 'Kategori'], ['pengaturan', 'Profil & toko'], ['kebijakan', 'Kebijakan'], ['ulasan', 'Ulasan'], ['berita', 'Berita']]
const SEGERA = ['berita']

export default function AdminPanel() {
  const [tab, setTab] = useState('pesanan')
  return (
    <div>
      <div className="eyebrow">Pemilik toko</div>
      <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight">Kelola toko</h1>
      <div role="tablist" className="-mx-5 mt-6 flex gap-6 overflow-x-auto border-b border-garis px-5 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {TABS.map(([id, t]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className={`-mb-px flex-none border-b-[3px] pb-3 pt-1 text-[15px] font-bold ${tab === id ? 'border-ink text-ink' : 'border-transparent text-ink/55 hover:text-ink'}`}>
            {t}{SEGERA.includes(id) && <span className="ml-1.5 rounded-sm bg-abu px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink/60">segera</span>}
          </button>
        ))}
      </div>
      <div className="mt-7">
        {tab === 'pengaturan' && <SettingsTab />}
        {tab === 'produk' && <ProductsTab />}
        {tab === 'kategori' && <CategoriesTab />}
        {tab === 'pesanan' && <OrdersTab />}
        {tab === 'ulasan' && <ReviewsTab />}
        {tab === 'kebijakan' && <PoliciesTab />}
        {tab === 'berita' && (
          <div className="border border-dashed border-garis px-6 py-14 text-center">
            <div className="text-lg font-extrabold">Berita: segera hadir</div>
            <p className="mt-1 text-sm text-ink/60">Di sini nanti Anda bisa menulis kabar terbaru untuk ditampilkan di halaman depan.</p>
          </div>
        )}
      </div>
    </div>
  )
}
