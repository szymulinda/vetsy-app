'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, LogOut, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/app/auth/actions'
import { VETSY_LOGO_URL } from '@/lib/branding'

export type NavbarUserState =
  | { kind: 'guest' }
  | { kind: 'client'; fullName: string | null }
  | { kind: 'clinic_owner'; clinicId: string | null; clinicName: string | null }

function displayName(state: NavbarUserState) {
  if (state.kind === 'client') return state.fullName ?? 'Konto'
  if (state.kind === 'clinic_owner') return state.clinicName ?? 'Gabinet'
  return 'Konto'
}

export function NavbarClient({ userState }: { userState: NavbarUserState }) {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 150)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const showCompactSearch = useMemo(() => {
    if (!isScrolled) return false
    return userState.kind !== 'clinic_owner'
  }, [isScrolled, userState.kind])

  const authRight = useMemo(() => {
    if (userState.kind === 'guest') {
      return (
        <div className="flex items-center gap-2">
          <Link
            href="/auth?type=b2b&mode=register"
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-emerald-50 hover:text-emerald-800 sm:inline-flex"
          >
            Dla gabinetów
          </Link>
          <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-700">
            <Link href="/auth?mode=login">Zaloguj się</Link>
          </Button>
        </div>
      )
    }

    if (userState.kind === 'client') {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:border-emerald-600 hover:text-emerald-800"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <User className="h-4 w-4" />
              </span>
              <span className="hidden sm:inline">{displayName(userState)}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/konto" className="cursor-pointer">
                <User className="h-4 w-4" />
                Moje konto
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action={signOut} className="w-full">
                <button type="submit" className="flex w-full items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Wyloguj
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    const dashboardHref = userState.clinicId ? `/dashboard/${userState.clinicId}` : '/dashboard'
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:border-emerald-600 hover:text-emerald-800"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Building2 className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline">{displayName(userState)}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuItem asChild>
            <Link href={dashboardHref} className="cursor-pointer">
              <Building2 className="h-4 w-4" />
              Panel zarządzania
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <form action={signOut} className="w-full">
              <button type="submit" className="flex w-full items-center gap-2">
                <LogOut className="h-4 w-4" />
                Wyloguj
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }, [userState])

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-white/70 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src={VETSY_LOGO_URL}
            alt="Vetsy"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
            priority
          />
          <span className="text-lg font-bold text-emerald-700 sm:text-xl">Vetsy</span>
        </Link>

        <div
          className={`hidden flex-1 items-center justify-center px-4 md:flex ${
            showCompactSearch
              ? 'opacity-100 translate-y-0'
              : 'pointer-events-none opacity-0 -translate-y-1'
          } transition-all duration-200`}
          aria-hidden={!showCompactSearch}
        >
          <form
            action="/szukaj"
            method="GET"
            className="flex w-full max-w-xl items-center gap-2 rounded-full border border-stone-200 bg-white px-2 py-2 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault()
              const params = new URLSearchParams()
              if (q.trim()) params.set('q', q.trim())
              if (city.trim()) params.set('city', city.trim())
              const qs = params.toString()
              router.push(qs ? `/szukaj?${qs}` : '/szukaj')
            }}
          >
            <Input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Czego szukasz?"
              className="h-9 border-0 shadow-none focus-visible:ring-0"
            />
            <div className="h-8 w-px bg-stone-200" />
            <Input
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Miasto"
              className="h-9 border-0 shadow-none focus-visible:ring-0"
            />
            <Button
              type="submit"
              size="icon"
              className="h-9 w-9 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
              aria-label="Szukaj"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {authRight}
      </div>
    </header>
  )
}

