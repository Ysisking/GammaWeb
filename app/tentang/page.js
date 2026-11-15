'use client'
import Shell from '@/components/Shell'
import { useSite } from '../providers'

export default function Page() {
  const { settings: s } = useSite()
  return (
    <Shell>
      <article className="mx-auto max-w-3xl py-10 sm:py-14">
        <div className="eyebrow">Tentang</div>
        <h1 className="mt-1.5 text-[28px] font-extrabold leading-tight tracking-tight">About gammaproject</h1>
        <div className="prose-gw mt-5 text-[15px] text-ink/80">{s.tentang.split('\n').filter(Boolean).map((t, i) => <p key={i}>{t}</p>)}</div>
        <dl className="mt-6 divide-y divide-garis border-y border-garis text-sm">
          {[['Website', 'Etalase dan undangan digital siap pakai'], ['Aplikasi', 'Pencatatan dan laporan untuk usaha'], ['Produk digital', 'Template dan modul siap unduh']].map(([a, b]) => (
            <div key={a} className="flex gap-4 py-3"><dt className="w-28 flex-none font-bold">{a}</dt><dd className="text-ink/70">{b}</dd></div>
          ))}
        </dl>
      </article>
    </Shell>
  )
}
