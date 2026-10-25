"use client"

import { Plus, Pencil, Dog, Cat, Rabbit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Pet {
  id: string
  name: string
  species: string
  breed: string
  age: string
  weight: string
  image?: string
  icon: "dog" | "cat" | "rabbit"
}

const pets: Pet[] = [
  {
    id: "1",
    name: "Max",
    species: "Pies",
    breed: "Golden Retriever",
    age: "3 lata",
    weight: "32 kg",
    image: "/pets/max.jpg",
    icon: "dog",
  },
  {
    id: "2",
    name: "Luna",
    species: "Kot",
    breed: "Brytyjski Krótkowłosy",
    age: "2 lata",
    weight: "4.5 kg",
    image: "/pets/luna.jpg",
    icon: "cat",
  },
  {
    id: "3",
    name: "Bąbel",
    species: "Królik",
    breed: "Miniaturka",
    age: "1 rok",
    weight: "1.8 kg",
    image: "/pets/babel.jpg",
    icon: "rabbit",
  },
]

const IconMap = {
  dog: Dog,
  cat: Cat,
  rabbit: Rabbit,
}

function PetCard({ pet }: { pet: Pet }) {
  const Icon = IconMap[pet.icon]

  return (
    <div className="group relative rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-stone-200/50 hover:ring-emerald-200">
      <div className="absolute -top-2 -right-2 rounded-full bg-orange-50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Icon className="h-4 w-4 text-orange-400" />
      </div>
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 ring-4 ring-amber-50">
          <AvatarImage src={pet.image} alt={pet.name} />
          <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-emerald-50 text-2xl font-bold text-emerald-600">
            {pet.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h3 className="mt-4 text-lg font-bold text-stone-800">{pet.name}</h3>
        <p className="mt-1 text-sm text-stone-500">
          {pet.species}, {pet.breed}
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="rounded-full bg-stone-100 px-3 py-1">
            <span className="text-xs font-medium text-stone-600">{pet.age}</span>
          </div>
          <div className="rounded-full bg-stone-100 px-3 py-1">
            <span className="text-xs font-medium text-stone-600">{pet.weight}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
        >
          <Pencil className="mr-1.5 h-3.5 w-3.5" />
          Edytuj profil
        </Button>
      </div>
    </div>
  )
}

function AddPetCard() {
  return (
    <button
      type="button"
      className="group flex min-h-[280px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-stone-300 bg-white/50 p-6 transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-50/30"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 transition-colors group-hover:bg-emerald-100">
        <Plus className="h-8 w-8 text-stone-400 transition-colors group-hover:text-emerald-600" />
      </div>
      <span className="mt-4 text-sm font-medium text-stone-500 group-hover:text-emerald-600">
        Dodaj zwierzaka
      </span>
    </button>
  )
}

export function PetCards() {
  return (
    <section id="zwierzaki" className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-800 sm:text-2xl">
            Twoje Pupile
          </h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
            {pets.length} zwierząt
          </span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
          <AddPetCard />
        </div>
      </div>
    </section>
  )
}
