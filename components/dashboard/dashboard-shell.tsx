"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

function getActiveTab(pathname: string) {
  if (pathname.includes("/uslugi")) return "uslugi"
  if (pathname.includes("/pacjenci")) return "pacjenci"
  if (pathname.includes("/ustawienia")) return "ustawienia"
  return "kalendarz"
}

export function DashboardShell({
  clinicId,
  clinicName,
  children,
}: {
  clinicId: string
  clinicName: string
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const activeTab = useMemo(() => getActiveTab(pathname), [pathname])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const onTabChange = (tab: string) => {
    const base = `/dashboard/${clinicId}`
    const next =
      tab === "kalendarz" ? base : `${base}/${encodeURIComponent(tab)}`
    router.push(next)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        clinicName={clinicName}
      />

      <main className="lg:pl-64">
        <div className="p-4 pt-16 lg:pt-4 lg:p-8 space-y-6">
          <DashboardHeader title={activeTab} />
          {children}
        </div>
      </main>
    </div>
  )
}

