'use client'
import { useCallback, useEffect, useState } from 'react'
import Shell from '@/components/Shell'
import ReviewForm from '@/components/ReviewForm'
import Stars from '@/components/Stars'
import { loadReviews } from '@/lib/store'
import { tanggal } from '@/lib/format'

export default function Page() {
  const [reviews, setReviews] = useState(null)
  const load = useCallback(() => loadReviews().then(setReviews).catch(() => setReviews([])), [])
  useEffect(() => { load() }, [load])
  const list = reviews || []
  const avg = list.length ? list.reduce((a, r) => a + r.rating, 0) / list.length : 0
  return (
    <Shell>
      <div className="eyebrow mt-8">Review</div>
      <div className="mt-2 flex items-center gap-5 border-b border-ink pb-5">
        <div className="text-5xl font-extrabold tracking-tight">{list.length ? avg.toFixed(1) : '–'}</div>
        <div><Stars n={Math.round(avg)} /><div className="mt-1 text-sm text-ink/60">{list.length} ulasan pelanggan</div></div>
      </div>
      <ReviewForm onDone={load} />
      <div className="mt-4 grid gap-3">
        {list.map((r) => (
          <div key={r.id} className="card p-4">
            <div className="flex items-center justify-between gap-3"><div className="font-extrabold">{r.nama}</div><Stars n={r.rating} /></div>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">{r.teks}</p>
            <div className="mt-2 text-xs text-ink/50">{tanggal(r.created_at)}</div>
          </div>
        ))}
        {reviews && list.length === 0 && <div className="card p-6 text-sm text-ink/60">Belum ada ulasan. Jadilah yang pertama.</div>}
      </div>
    </Shell>
  )
}
