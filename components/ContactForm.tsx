"use client"

import { useState } from 'react'
import { submitContact, type ActionResult } from '@/actions/contact'

export default function ContactForm() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [message, setMessage] = useState('')
  const [demandeVisite, setDemandeVisite] = useState(false)
  const [etreRappele, setEtreRappele] = useState(false)
  const [plusPhotos, setPlusPhotos] = useState(false)
  const [disponibilites, setDisponibilites] = useState<{id: number, jour: string, creneau: string}[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<ActionResult | null>(null)

  const ajouterDisponibilite = () => {
    const nouvelle = {
      id: Date.now(),
      jour: 'Lundi',
      creneau: 'Matin (9h-12h)',
    }
    setDisponibilites(prev => [...prev, nouvelle])
  }

  const supprimerDisponibilite = (id: number) => {
    setDisponibilites(prev => prev.filter(d => d.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    const formData = new FormData()
    formData.append('nom', nom)
    formData.append('email', email)
    formData.append('telephone', telephone)
    formData.append('message', message)
    formData.append('demandeVisite', String(demandeVisite))
    formData.append('etreRappele', String(etreRappele))
    formData.append('plusPhotos', String(plusPhotos))
    formData.append('disponibilites', JSON.stringify(disponibilites))

    const actionResult = await submitContact(formData)
    setResult(actionResult)

    if (actionResult.success) {
      setNom('')
      setEmail('')
      setTelephone('')
      setMessage('')
      setDemandeVisite(false)
      setEtreRappele(false)
      setPlusPhotos(false)
      setDisponibilites([])
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
      {result && (
        <div className={`p-4 rounded-lg text-center font-medium ${
          result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {result.message}
        </div>
      )}

      {/* Section 1 : Coordonnées */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vos Coordonnées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
            <input id="nom" type="text" value={nom} onChange={e => setNom(e.target.value)}
              placeholder="Votre nom" required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="vous@exemple.com" required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input id="telephone" type="tel" value={telephone} onChange={e => setTelephone(e.target.value)}
              placeholder="06 12 34 56 78"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
          </div>
        </div>
      </section>

      {/* Section 2 : Message */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Votre Message</h2>
        <textarea value={message} onChange={e => setMessage(e.target.value)}
          placeholder="Bonjour, je souhaiterais..."
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" />
      </section>

      {/* Section 3 : Options */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Options</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" checked={demandeVisite} onChange={e => setDemandeVisite(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded" />
            <div>
              <p className="font-medium">Demande de visite</p>
              <p className="text-sm text-gray-500">Je souhaite programmer une visite</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" checked={etreRappele} onChange={e => setEtreRappele(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded" />
            <div>
              <p className="font-medium">Être rappelé</p>
              <p className="text-sm text-gray-500">Un conseiller me rappelle dans la journée</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" checked={plusPhotos} onChange={e => setPlusPhotos(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded" />
            <div>
              <p className="font-medium">Plus de photos</p>
              <p className="text-sm text-gray-500">Recevoir plus de photos du bien</p>
            </div>
          </label>
        </div>
      </section>

      {/* Section 4 : Disponibilités */}
      {demandeVisite && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Disponibilités</h2>
          {disponibilites.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {disponibilites.map(d => (
                <span key={d.id} className="px-3 py-2 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-2">
                  {d.jour} - {d.creneau}
                  <button type="button" onClick={() => supprimerDisponibilite(d.id)} className="w-4 h-4 bg-blue-200 rounded-full text-xs">✕</button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={ajouterDisponibilite}
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50">
              + AJOUTER
            </button>
          </div>
        </section>
      )}

      <button type="submit" disabled={isSubmitting}
        className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50">
        {isSubmitting ? 'Envoi en cours...' : 'ENVOYER'}
      </button>
    </form>
  )
}