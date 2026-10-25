import type { Database } from '@/lib/supabase/database.types'

export type ClinicServiceUi = {
  id: string
  name: string
  category: string | null
  duration: string
  price: string
}

type ServiceRow = Database['public']['Tables']['services']['Row']

export function mapServiceRows(rows: ServiceRow[]): ClinicServiceUi[] {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    duration: `${row.duration_minutes} min`,
    price: `${row.price} PLN`,
  }))
}
