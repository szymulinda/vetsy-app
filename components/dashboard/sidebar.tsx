"use client"

import { Calendar, Grid3X3, Users, Settings, LogOut, PawPrint, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isOpen: boolean
  onToggle: () => void
  clinicName: string
}

const navItems = [
  { id: "kalendarz", label: "Kalendarz", icon: Calendar },
  { id: "uslugi", label: "Usługi", icon: Grid3X3 },
  { id: "pacjenci", label: "Pacjenci", icon: Users },
  { id: "ustawienia", label: "Ustawienia", icon: Settings },
]

export function DashboardSidebar({ activeTab, onTabChange, isOpen, onToggle, clinicName }: SidebarProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-[5.25rem] z-50 lg:hidden"
        onClick={onToggle}
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden" 
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-white border-r border-stone-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 bg-emerald-600 rounded-xl">
              <PawPrint className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold text-emerald-700">Vetsy</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onTabChange(item.id)
                      if (window.innerWidth < 1024) onToggle()
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    )}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-stone-100">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex items-center justify-center size-9 bg-stone-100 rounded-full">
              <PawPrint className="size-4 text-stone-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-900 truncate">{clinicName}</p>
              <p className="text-xs text-stone-500">Administrator</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-4 mt-2 text-stone-600 hover:text-stone-900 hover:bg-stone-50"
          >
            <LogOut className="size-4" />
            Wyloguj
          </Button>
        </div>
      </aside>
    </>
  )
}
