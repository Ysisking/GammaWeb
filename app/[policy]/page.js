import { notFound } from 'next/navigation'
import Shell from '@/components/Shell'
import { POLICIES, POLICY_UPDATED } from '@/lib/policies'

export const dynamicParams = false
export function generateStaticParams() { return Object.keys(POLICIES).map((policy) => ({ policy })) }

export async function generateMetadata({ params }) {
  const { policy } = await params
  return { title: POLICIES[policy]?.title || 'Halaman' }
}

export default async function PolicyPage({ params }) {
  const { policy } = await params
  const p = POLICIES[policy]
  if (!p) notFound()
  return (
    <Shell>
      <article className="mt-8">
        <div className="eyebrow">Diperbarui {POLICY_UPDATED}</div>
        <h1 className="mt-1.5 text-[28px] font-extrabold leading-tight tracking-tight">{p.title}</h1>
        <p className="mt-4 border-b border-garis pb-5 text-[15px] leading-relaxed text-ink/80">{p.intro}</p>
        {p.sections.map(([h, paras]) => {
          // Pertahankan urutan asli: butir "- " yang berurutan digabung jadi satu daftar.
          const blocks = []
          for (const t of paras) {
            if (t.startsWith('- ')) {
              const last = blocks[blocks.length - 1]
              if (Array.isArray(last)) last.push(t.slice(2)); else blocks.push([t.slice(2)])
            } else blocks.push(t)
          }
          return (
            <section key={h} className="prose-gw text-sm text-ink/80">
              <h2>{h}</h2>
              {blocks.map((b, i) => Array.isArray(b) ? <ul key={i}>{b.map((x, j) => <li key={j}>{x}</li>)}</ul> : <p key={i}>{b}</p>)}
            </section>
          )
        })}
      </article>
    </Shell>
  )
}
