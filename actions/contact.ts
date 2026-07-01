"use server"

import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const contactSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  telephone: z.string().default(''),
  message: z.string().default(''),
  demandeVisite: z.boolean().default(false),
  etreRappele: z.boolean().default(false),
  plusPhotos: z.boolean().default(false),
  disponibilites: z.string().default('[]'),
})

export type ActionResult = {
  success: boolean
  message: string
}

export async function submitContact(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      nom: formData.get('nom') as string,
      email: formData.get('email') as string,
      telephone: formData.get('telephone') as string || '',
      message: formData.get('message') as string || '',
      demandeVisite: formData.get('demandeVisite') === 'true',
      etreRappele: formData.get('etreRappele') === 'true',
      plusPhotos: formData.get('plusPhotos') === 'true',
      disponibilites: formData.get('disponibilites') as string || '[]',
    }

    const validationResult = contactSchema.safeParse(rawData)

    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map(e => e.message)
        .join(', ')
      return { success: false, message: `Erreur : ${errors}` }
    }

    const data = validationResult.data

    await prisma.contact.create({
      data: {
        nom: data.nom,
        email: data.email,
        telephone: data.telephone ?? '',
        message: data.message ?? '',
        demandeVisite: data.demandeVisite ?? false,
        etreRappele: data.etreRappele ?? false,
        plusPhotos: data.plusPhotos ?? false,
        disponibilites: data.disponibilites ?? '[]',
      },
    })

    return {
      success: true,
      message: 'Message envoyé avec succès ! Nous vous recontacterons rapidement.',
    }
  } catch (error) {
    console.error('Erreur:', error)
    return {
      success: false,
      message: 'Une erreur est survenue. Veuillez réessayer.',
    }
  }
}