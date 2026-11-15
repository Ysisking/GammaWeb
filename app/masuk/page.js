import { Suspense } from 'react'
import Shell from '@/components/Shell'
import AuthForm from '@/components/AuthForm'

export const metadata = { title: 'Masuk' }

export default function Page() {
  return <Shell><div className="mx-auto max-w-md py-10 sm:py-14"><Suspense><AuthForm mode="masuk" /></Suspense></div></Shell>
}
