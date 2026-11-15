'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { useSite } from '@/app/providers'
import { createReview } from '@/lib/store'

export default function ReviewForm({ onDone }) {
  const { user, online, ready } = useSite()
  const [rating, setRating] = useState(5)
  const [teks, setTeks] = useState('')
  const [msg, setMsg] = useState('')
  if (!online) return <div className="card mt-4 p-4 text-sm text-ink/70">Penulisan ulasan akan dibuka setelah fitur akun diaktifkan.</div>
  if (!ready) return null
  if (!user) return <div className="card mt-4 p-4 text-sm text-ink/70">Ingin menulis ulasan? <Link href="/masuk/?next=%2Fulasan%2F" className="tautan">Masuk dulu</Link>.</div>
  async function submit(e) {
    e.preventDefault(); setMsg('')
    try { await createReview({ rating, teks, nama: user.nama }); setTeks(''); onDone?.() } catch (x) { setMsg(x.message) }
  }
  return (
    <form onSubmit={submit} className="card mt-4 p-4">
      <div className="text-sm font-extrabold">Tulis ulasan sebagai {user.nama}</div>
      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => <button type="button" key={i} onClick={() => setRating(i)} aria-label={`${i} bintang`}><Star size={26} className={i <= rating ? 'fill-amber-400 text-amber-400' : 'text-ink/20'} /></button>)}
      </div>
      <textarea rows="3" value={teks} onChange={(e) => setTeks(e.target.value)} className="input mt-3" placeholder="Bagaimana pengalaman Anda?" required minLength={5} />
      {msg && <div className="mt-2 text-sm font-semibold text-api">{msg}</div>}
      <button className="btn-primary mt-3 w-full">Kirim ulasan</button>
    </form>
  )
}
