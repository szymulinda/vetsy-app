import Link from "next/link"
import { Search, Heart, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

type WelcomeHeroProps = {
  greetingName: string
  email: string
}

export function WelcomeHero({ greetingName, email }: WelcomeHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-orange-50/30 py-8 sm:py-12">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-400 fill-rose-400 shrink-0" />
              <span className="text-sm font-medium text-emerald-600">
                Panel właściciela
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl text-balance">
              Cześć, {greetingName}!
            </h1>
            <p className="mt-2 text-base text-stone-600 sm:text-lg text-pretty">
              Twoje zwierzaki są w dobrych rękach.
            </p>
            <div className="mt-6 flex items-start gap-2.5 text-stone-800 sm:items-center">
              <Mail
                className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 sm:mt-0"
                aria-hidden
              />
              <p className="min-w-0 text-sm leading-relaxed sm:text-base">
                <span className="font-semibold text-stone-700">E-mail:</span>{" "}
                <span className="break-all">{email}</span>
              </p>
            </div>
          </div>
          <Button
            size="lg"
            className="w-full bg-emerald-600 text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200/50 sm:w-auto shrink-0"
            asChild
          >
            <Link href="/szukaj">
              <Search className="mr-2 h-5 w-5" aria-hidden />
              Znajdź gabinet i umów wizytę
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
