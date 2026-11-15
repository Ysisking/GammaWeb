'use client'
import Shell from '@/components/Shell'
import { useSite } from '../providers'
import { asset } from '@/lib/config'

export default function Page() {
  const { settings: s } = useSite()
  return (
    <Shell>
      <article className="card mt-6 p-6">
        <img src={asset('/logo.svg')} alt="gammaproject" className="h-9" />
        <h1 className="mt-4 text-2xl font-extrabold">About gammaproject</h1>
        <div className="prose-gw mt-3 text-sm text-ink/80">{s.tentang.split('\n').filter(Boolean).map((t, i) => <p key={i}>{t}</p>)}</div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          {[['Website', 'siap pakai'], ['Aplikasi', 'untuk usaha'], ['Produk', 'digital']].map(([a, b]) => (
            <div key={a} className="rounded-2xl bg-abu p-3"><div className="font-extrabold">{a}</div><div className="text-xs text-ink/60">{b}</div></div>
          ))}
        </div>
      </article>
    </Shell>
  )
}
