"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"
import { toast } from "sonner"
import { useRef, useTransition } from "react"
import { updateClinicSettings } from "@/app/dashboard/[clinicId]/actions"

export function SettingsView({
  clinic,
  clinicId,
}: {
  clinic: { name: string; address: string; phone: string; email: string }
  clinicId: string
}) {
  const nameRef = useRef<HTMLInputElement | null>(null)
  const addressRef = useRef<HTMLInputElement | null>(null)
  const phoneRef = useRef<HTMLInputElement | null>(null)
  const [isPending, startTransition] = useTransition()

  const onSave = () => {
    const name = nameRef.current?.value ?? ""
    const addressCombined = addressRef.current?.value ?? ""
    const phone = phoneRef.current?.value ?? ""
    startTransition(async () => {
      const res = await updateClinicSettings(clinicId, { name, addressCombined, phone })
      if (res.ok) {
        toast.success("Zapisano zmiany pomyślnie!")
      } else {
        toast.error(res.error || "Nie udało się zapisać zmian.")
      }
    })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg text-stone-900">Dane kliniki</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clinic-name" className="text-stone-700">Nazwa kliniki</Label>
            <Input
              id="clinic-name"
              defaultValue={clinic.name}
              className="rounded-xl border-stone-200 focus:border-emerald-500"
              ref={nameRef}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="text-stone-700">Adres</Label>
            <Input
              id="address"
              defaultValue={clinic.address}
              className="rounded-xl border-stone-200 focus:border-emerald-500"
              ref={addressRef}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-stone-700">Telefon</Label>
            <Input
              id="phone"
              defaultValue={clinic.phone}
              className="rounded-xl border-stone-200 focus:border-emerald-500"
              ref={phoneRef}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-stone-700">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={clinic.email}
              className="rounded-xl border-stone-200 focus:border-emerald-500"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg text-stone-900">Godziny pracy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weekday-start" className="text-stone-700">Dni robocze - od</Label>
              <Input
                id="weekday-start"
                type="time"
                defaultValue="08:00"
                className="rounded-xl border-stone-200 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekday-end" className="text-stone-700">Dni robocze - do</Label>
              <Input
                id="weekday-end"
                type="time"
                defaultValue="20:00"
                className="rounded-xl border-stone-200 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="saturday-start" className="text-stone-700">Sobota - od</Label>
              <Input
                id="saturday-start"
                type="time"
                defaultValue="09:00"
                className="rounded-xl border-stone-200 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="saturday-end" className="text-stone-700">Sobota - do</Label>
              <Input
                id="saturday-end"
                type="time"
                defaultValue="14:00"
                className="rounded-xl border-stone-200 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <span>Niedziela:</span>
            <span className="font-medium">Zamknięte</span>
          </div>
        </CardContent>
      </Card>

      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl" onClick={onSave} disabled={isPending}>
        <Save className="size-4" />
        Zapisz zmiany
      </Button>
    </div>
  )
}
