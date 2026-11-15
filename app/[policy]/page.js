import { notFound } from 'next/navigation'
import Shell from '@/components/Shell'
import PolicyView from '@/components/PolicyView'
import { POLICIES } from '@/lib/policies'

export const dynamicParams = false
export function generateStaticParams() { return Object.keys(POLICIES).map((policy) => ({ policy })) }

export async function generateMetadata({ params }) {
  const { policy } = await params
  return { title: POLICIES[policy]?.title || 'Halaman' }
}

export default async function PolicyPage({ params }) {
  const { policy } = await params
  if (!POLICIES[policy]) notFound()
  return <Shell><PolicyView slug={policy} /></Shell>
}
