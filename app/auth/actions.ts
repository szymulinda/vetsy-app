'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/auth?error=invalid_credentials')
  }

  revalidatePath('/', 'layout')

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth?error=invalid_credentials')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError || !profile) {
    redirect('/konto?error=access_denied')
  }

  if (profile.role === 'clinic_owner') {
    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (clinicError || !clinic?.id) {
      redirect('/konto?error=access_denied')
    }

    redirect(`/dashboard/${clinic.id}`)
  }

  if (profile.role === 'client') {
    redirect('/konto')
  }

  redirect('/konto?error=access_denied')
}

export async function signupClient(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = (formData.get('full_name') as string) || ''

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'client',
        full_name: fullName,
      },
    },
  })

  if (error) {
    redirect('/auth?error=signup_failed')
  }

  const userId = data.user?.id
  if (userId) {
    const trimmed = fullName.trim()
    if (trimmed) {
      for (let attempt = 0; attempt < 5; attempt++) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'client', full_name: trimmed })
          .eq('id', userId)

        if (!profileError) break

        await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)))
      }
    } else {
      // still ensure role is set for email/password signups
      for (let attempt = 0; attempt < 5; attempt++) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'client' })
          .eq('id', userId)

        if (!profileError) break

        await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)))
      }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/konto')
}

export async function signupClinic(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const clinicName = (formData.get('clinic_name') as string) || ''
  const ownerName = (formData.get('owner_name') as string) || ''

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'clinic_owner',
        clinic_name: clinicName,
        owner_name: ownerName,
      },
    },
  })

  if (error) {
    redirect('/auth?error=signup_failed')
  }

  const userId = data.user?.id
  if (!userId) {
    revalidatePath('/', 'layout')
    redirect('/auth?error=signup_failed')
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'clinic_owner' })
      .eq('id', userId)

    if (!profileError) {
      break
    }

    await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)))
  }

  const { error: clinicError } = await supabase.from('clinics').insert({
    owner_id: userId,
    name: 'Twój Nowy Gabinet',
    description:
      'Opis gabinetu jest jeszcze pusty. Przejdź do edycji profilu, aby go uzupełnić.',
    address: 'Do uzupełnienia',
    city: 'Do uzupełnienia',
    phone: 'Do uzupełnienia',
  })

  if (clinicError) {
    console.error('signupClinic: failed to insert clinic', clinicError)
  }

  revalidatePath('/', 'layout')

  const { data: clinic, error: clinicSelectError } = await supabase
    .from('clinics')
    .select('id')
    .eq('owner_id', userId)
    .single()

  if (clinicSelectError || !clinic?.id) {
    redirect('/konto?error=no_clinic')
  }

  redirect(`/dashboard/${clinic.id}`)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
