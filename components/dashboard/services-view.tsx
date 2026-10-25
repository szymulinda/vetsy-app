"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"
import { createService, deleteService, updateService } from "@/app/dashboard/[clinicId]/actions"

interface Service {
  id: string
  name: string
  duration: number
  price: number
}

export function ServicesView({ services, clinicId }: { services: Service[]; clinicId: string }) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const editing = useMemo(
    () => services.find((s) => s.id === editingId) ?? null,
    [services, editingId]
  )
  const [name, setName] = useState("")
  const [duration, setDuration] = useState("")
  const [price, setPrice] = useState("")
  const [isPending, startTransition] = useTransition()

  const startCreate = () => {
    setEditingId(null)
    setName("")
    setDuration("")
    setPrice("")
    setOpen(true)
  }

  const startEdit = (service: Service) => {
    setEditingId(service.id)
    setName(service.name)
    setDuration(String(service.duration))
    setPrice(String(service.price))
    setOpen(true)
  }

  const onSubmit = () => {
    const d = Number(duration)
    const p = Number(price)
    if (!name.trim() || !Number.isFinite(d) || !Number.isFinite(p)) {
      toast.error("Uzupełnij poprawnie nazwę, czas i cenę.")
      return
    }
    startTransition(async () => {
      const res = editingId
        ? await updateService(clinicId, editingId, {
            name: name.trim(),
            durationMinutes: d,
            price: p,
          })
        : await createService(clinicId, {
            name: name.trim(),
            durationMinutes: d,
            price: p,
          })
      if (res.ok) {
        toast.success(editingId ? "Zapisano usługę." : "Dodano usługę.")
        setOpen(false)
      } else {
        toast.error(res.error || "Nie udało się zapisać usługi.")
      }
    })
  }

  const onDelete = (serviceId: string) => {
    startTransition(async () => {
      const res = await deleteService(clinicId, serviceId)
      if (res.ok) {
        toast.success("Usunięto usługę.")
      } else {
        toast.error(res.error || "Nie udało się usunąć usługi.")
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl" onClick={startCreate}>
          <Plus className="size-4" />
          Dodaj nową usługę
        </Button>
      </div>

      <Card className="rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50 hover:bg-stone-50">
              <TableHead className="font-semibold text-stone-700">Nazwa usługi</TableHead>
              <TableHead className="font-semibold text-stone-700">Czas trwania (min)</TableHead>
              <TableHead className="font-semibold text-stone-700">Cena (PLN)</TableHead>
              <TableHead className="font-semibold text-stone-700 text-right">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id} className="hover:bg-stone-50/50">
                <TableCell className="font-medium text-stone-900">{service.name}</TableCell>
                <TableCell className="text-stone-600">{service.duration}</TableCell>
                <TableCell className="text-stone-600">{service.price} zł</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl"
                      onClick={() => startEdit(service)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                      onClick={() => onDelete(service.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-stone-900">
                  {editing ? "Edytuj usługę" : "Dodaj usługę"}
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  Uzupełnij dane i zapisz zmiany.
                </p>
              </div>
              <Button variant="ghost" size="icon-sm" className="rounded-xl" onClick={() => setOpen(false)}>
                ✕
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-stone-700">Nazwa</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border-stone-200 focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-stone-700">Czas (min)</Label>
                  <Input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="rounded-xl border-stone-200 focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-stone-700">Cena (PLN)</Label>
                  <Input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="rounded-xl border-stone-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
                  Anuluj
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl" onClick={onSubmit} disabled={isPending}>
                  Zapisz
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
