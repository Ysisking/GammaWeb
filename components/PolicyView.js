'use client'
import { useSite } from '@/app/providers'
import { POLICIES, POLICY_UPDATED, parsePolicy, policyToText } from '@/lib/policies'

// Menampilkan naskah kebijakan: versi suntingan pemilik bila ada, kalau tidak naskah bawaan.
export default function PolicyView({ slug }) {
  const { settings: s } = useSite()
  const custom = s.kebijakan?.[slug]
  const blocks = parsePolicy(custom || policyToText(slug))
  return (
    <article className="mx-auto max-w-3xl py-10 sm:py-14">
      <div className="eyebrow">{custom ? 'Kebijakan' : `Diperbarui ${POLICY_UPDATED}`}</div>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{POLICIES[slug].title}</h1>
      <div className="prose-gw mt-6 text-[15px] text-ink/80">
        {blocks.map((b, i) => b.t === 'h' ? <h2 key={i}>{b.v}</h2> : b.t === 'ul' ? <ul key={i}>{b.v.map((x, j) => <li key={j}>{x}</li>)}</ul> : <p key={i}>{b.v}</p>)}
      </div>
    </article>
  )
}
