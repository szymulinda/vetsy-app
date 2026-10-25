import { Suspense } from 'react'
import { Navbar } from '@/components/gabinet/navbar'
import AuthPageClient from '@/components/auth/auth-page-client'

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Suspense fallback={null}>
        <AuthPageClient />
      </Suspense>
    </div>
  )
}
