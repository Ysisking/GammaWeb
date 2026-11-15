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
      <article className="card mt-6 p-6">
        <h1 className="text-2xl font-extrabold">{p.title}</h1>
        <div className="mt-1 text-xs text-ink/50">Diperbarui {POLICY_UPDATED}</div>
        <p className="mt-4 text-sm leading-relaxed text-ink/80">{p.intro}</p>
        {p.sections.map(([h, paras]) => {
          const bullets = paras.filter((t) => t.startsWith('- '))
          return (
            <section key={h} className="prose-gw text-sm text-ink/80">
              <h2>{h}</h2>
              {paras.filter((t) => !t.startsWith('- ')).map((t, i) => <p key={i}>{t}</p>)}
              {bullets.length > 0 && <ul>{bullets.map((b, i) => <li key={i}>{b.slice(2)}</li>)}</ul>}
            </section>
          )
        })}
      </article>
    </Shell>
  )
}
