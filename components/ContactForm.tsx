"use client"

import { useState } from 'react'
import { submitContact, type ActionResult } from '@/actions/contact'

type Disponibilite = {
  id: number
  jour: string
  heure: string
  minutes: string
}

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const HEURES = Array.from({length: 14}, (_, i) => `${i + 7}h`)
const MINUTES = ['00', '15', '30', '45']

export default function ContactForm() {
  const [civilite, setCivilite] = useState<'Mme' | 'M'>('Mme')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [message, setMessage] = useState('')
  const [option, setOption] = useState<'visite' | 'rappel' | 'photos'>('visite')
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>([])
  const [jourDispo, setJourDispo] = useState('Lundi')
  const [heureDispo, setHeureDispo] = useState('9h')
  const [minutesDispo, setMinutesDispo] = useState('00')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<ActionResult | null>(null)

  const ajouterDisponibilite = () => {
    const nouvelle: Disponibilite = {
      id: Date.now(),
      jour: jourDispo,
      heure: heureDispo,
      minutes: minutesDispo,
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
    formData.append('nom', `${prenom} ${nom}`)
    formData.append('email', email)
    formData.append('telephone', telephone)
    formData.append('message', message)
    formData.append('demandeVisite', String(option === 'visite'))
    formData.append('etreRappele', String(option === 'rappel'))
    formData.append('plusPhotos', String(option === 'photos'))
    formData.append('disponibilites', JSON.stringify(disponibilites))

    const actionResult = await submitContact(formData)
    setResult(actionResult)

    if (actionResult.success) {
      setNom('')
      setPrenom('')
      setEmail('')
      setTelephone('')
      setMessage('')
      setCivilite('Mme')
      setOption('visite')
      setDisponibilites([])
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto">
      {result && (
        <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
          result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {result.message}
        </div>
      )}

      {/* Ligne : Coordonnées (gauche) + Message (droite) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* ===== COLONNE GAUCHE : VOS COORDONNÉES ===== */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">VOS COORDONNÉES</h2>
          
          {/* Civilité */}
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="civilite" value="Mme" checked={civilite === 'Mme'}
                onChange={() => setCivilite('Mme')}
                className="w-4 h-4 text-orange-500" />
              <span className="text-gray-700">Mme</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="civilite" value="M" checked={civilite === 'M'}
                onChange={() => setCivilite('M')}
                className="w-4 h-4 text-orange-500" />
              <span className="text-gray-700">M</span>
            </label>
          </div>

          {/* Nom */}
          <div className="mb-4">
            <input type="text" value={nom} onChange={e => setNom(e.target.value)}
              placeholder="Nom" required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-gray-50" />
          </div>

          {/* Prénom */}
          <div className="mb-4">
            <input type="text" value={prenom} onChange={e => setPrenom(e.target.value)}
              placeholder="Prénom" required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-gray-50" />
          </div>

          {/* Email */}
          <div className="mb-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Adresse mail" required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-gray-50" />
          </div>

          {/* Téléphone */}
          <div className="mb-4">
            <input type="tel" value={telephone} onChange={e => setTelephone(e.target.value)}
              placeholder="Téléphone"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-gray-50" />
          </div>
        </div>

        {/* ===== COLONNE DROITE : VOTRE MESSAGE ===== */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">VOTRE MESSAGE</h2>
          
          {/* Options en radio buttons */}
          <div className="space-y-3 mb-4">
            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer border border-gray-100">
              <input type="radio" name="option" value="visite" checked={option === 'visite'}
                onChange={() => setOption('visite')}
                className="w-4 h-4 text-orange-500" />
              <span className="text-gray-700 font-medium">Demande de visite</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer border border-gray-100">
              <input type="radio" name="option" value="rappel" checked={option === 'rappel'}
                onChange={() => setOption('rappel')}
                className="w-4 h-4 text-orange-500" />
              <span className="text-gray-700 font-medium">Être rappelé</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer border border-gray-100">
              <input type="radio" name="option" value="photos" checked={option === 'photos'}
                onChange={() => setOption('photos')}
                className="w-4 h-4 text-orange-500" />
              <span className="text-gray-700 font-medium">Plus de photos</span>
            </label>
          </div>

          {/* Zone de message */}
          <textarea value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Votre message"
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-gray-50 resize-none" />
        </div>
      </div>

      {/* ===== DISPONIBILITÉS POUR UNE VISITE ===== */}
      {option === 'visite' && (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">DISPONIBILITÉS POUR UNE VISITE</h2>
          
          {/* Sélecteurs */}
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <div>
              <select value={jourDispo} onChange={e => setJourDispo(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-orange-400">
                {JOURS.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div>
              <select value={heureDispo} onChange={e => setHeureDispo(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-orange-400">
                {HEURES.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <select value={minutesDispo} onChange={e => setMinutesDispo(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-orange-400">
                {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <button type="button" onClick={ajouterDisponibilite}
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors">
              AJOUTER DISPO
            </button>
          </div>

          {/* Liste des dispos ajoutées */}
          {disponibilites.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {disponibilites.map(d => (
                <span key={d.id} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm">
                  {d.jour} à {d.heure}{d.minutes}
                  <button type="button" onClick={() => supprimerDisponibilite(d.id)}
                    className="w-4 h-4 bg-orange-200 text-orange-600 rounded-full flex items-center justify-center text-xs hover:bg-orange-300">
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== BOUTON ENVOYER ===== */}
      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting}
          className="px-10 py-4 bg-orange-500 text-white font-bold text-lg rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 shadow-lg">
          {isSubmitting ? 'Envoi...' : 'ENVOYER'}
        </button>
      </div>
    </form>
  )
}