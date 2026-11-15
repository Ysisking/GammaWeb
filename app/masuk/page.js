import { Suspense } from 'react'
import Shell from '@/components/Shell'
import AuthForm from '@/components/AuthForm'

export const metadata = { title: 'Masuk' }

export default function Page() {
  return <Shell><Suspense><AuthForm mode="masuk" /></Suspense></Shell>
}
