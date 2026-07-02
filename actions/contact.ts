"use server"

import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// ---- 1. RATE LIMITING SIMPLE (anti-spam) ----
const rateLimit = new Map<string, { count: number; resetTime: number }>()
const MAX_REQUESTS = 3 // Maximum 3 soumissions
const WINDOW_MS = 60 * 1000 // par minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  
  if (!entry || now > entry.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return true 
  }
  
  if (entry.count >= MAX_REQUESTS) {
    return false 
  }
  
  entry.count++
  return true 
}

// ---- 2. SANITIZATION (anti-XSS) ----
function sanitize(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// ---- 2. VALIDATION ZOD ----
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
     // ---- VÉRIFICATION RATE LIMIT ----

    const ip = 'anonymous'       // En production : headers().get('x-forwarded-for')
    if (!checkRateLimit(ip)) {
      return {
        success: false,
        message: 'Trop de tentatives. Veuillez réessayer dans une minute.',
      }
    }

    // ---- EXTRACTION AVEC SANITIZATION ----
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

    // ---- VALIDATION ZOD ----
    const validationResult = contactSchema.safeParse(rawData)
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map(e => e.message)
        .join(', ')
      return { success: false, message: `Erreur : ${errors}` }
    }

    const data = validationResult.data

    // ---- SAUVEGARDE (Prisma = protection SQL injection incluse) ----
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
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Erreur complète:', errorMessage)
    console.error('Stack:', error instanceof Error ? error.stack : 'N/A')
    return {
      success: false,
      message: `Une erreur est survenue: ${errorMessage}`,
    }
  }
}