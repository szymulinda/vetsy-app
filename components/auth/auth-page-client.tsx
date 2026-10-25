'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { login, signupClient, signupClinic } from '@/app/auth/actions'
import { AuthForm } from '@/components/auth/auth-form'

export default function AuthPageClient() {
  const searchParams = useSearchParams()
  const [userType, setUserType] = useState<'b2c' | 'b2b'>('b2c')
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    const type = searchParams.get('type')
    const mode = searchParams.get('mode')
    if (type === 'b2b') setUserType('b2b')
    if (type === 'b2c') setUserType('b2c')
    if (mode === 'register') setAuthMode('register')
    if (mode === 'login') setAuthMode('login')
  }, [searchParams])

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <div className="relative hidden bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-white lg:flex lg:w-1/2">
        <div className="absolute inset-0 flex flex-col p-8">
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/images/vetsy-hero.jpg"
                alt="Dwa psy bawiące się na trawie"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-balance text-lg font-medium leading-relaxed text-white">
                  &ldquo;Dołącz do tysięcy zadowolonych właścicieli i najlepszych gabinetów w okolicy.&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <span className="text-sm font-semibold text-white">AK</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Anna Kowalska</p>
                    <p className="text-xs text-white/70">Właścicielka Labradora</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-emerald-700/60">
            <span>© 2024 Vetsy</span>
            <span>•</span>
            <span>Wszystkie prawa zastrzeżone</span>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-white p-6 sm:p-8 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              {authMode === 'login' ? 'Witaj ponownie!' : 'Utwórz konto'}
            </h1>
            <p className="text-gray-500">
              {authMode === 'login'
                ? 'Zaloguj się, aby kontynuować'
                : userType === 'b2b'
                  ? 'Załóż konto i odbierz 30 dni za darmo'
                  : 'Dołącz do społeczności Vetsy'}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex rounded-full bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setUserType('b2c')}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  userType === 'b2c'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dla właścicieli
              </button>
              <button
                type="button"
                onClick={() => setUserType('b2b')}
                className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  userType === 'b2b'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dla gabinetów
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 border-b-2 py-3 text-sm font-medium transition-colors duration-200 ${
                  authMode === 'login'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Logowanie
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 border-b-2 py-3 text-sm font-medium transition-colors duration-200 ${
                  authMode === 'register'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Rejestracja
              </button>
            </div>
          </div>

          <AuthForm
            userType={userType}
            authMode={authMode}
            login={login}
            signupClient={signupClient}
            signupClinic={signupClinic}
          />

          <p className="mt-8 text-center text-xs text-gray-400">
            Kontynuując, akceptujesz{' '}
            <a href="#" className="text-emerald-600 hover:underline">
              Regulamin
            </a>{' '}
            oraz{' '}
            <a href="#" className="text-emerald-600 hover:underline">
              Politykę Prywatności
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

