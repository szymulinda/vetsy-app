import { Navbar } from '@/components/gabinet/navbar'
import { SearchBar } from '@/components/szukaj/search-bar'
import { SearchResults } from '@/components/szukaj/search-results'
import { fetchClinicsForSearch } from '@/lib/szukaj/fetch-clinics'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<{ query?: string; city?: string }>
}

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const query = typeof sp.query === 'string' ? sp.query : ''
  const city = typeof sp.city === 'string' ? sp.city : ''

  const clinics = await fetchClinicsForSearch(query, city)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SearchBar defaultQuery={query} defaultCity={city} />
      <main>
        <SearchResults clinics={clinics} query={query} city={city} />
      </main>
    </div>
  )
}
