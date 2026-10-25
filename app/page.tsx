import { Navbar } from "@/components/gabinet/navbar"
import HomePageClient from '@/components/home/home-page-client'

export default function VetsyLandingPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <HomePageClient />
    </div>
  )
}
