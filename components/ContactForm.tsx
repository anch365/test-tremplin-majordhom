"use client";

import { useState } from "react";
import { submitContact, type ActionResult } from "@/actions/contact";

type Disponibilite = {
  id: number;
  jour: string;
  heure: string;
  minutes: string;
};

const JOURS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];
const HEURES = [
  "7h",
  "8h",
  "9h",
  "10h",
  "11h",
  "12h",
  "13h",
  "14h",
  "15h",
  "16h",
  "17h",
  "18h",
  "19h",
  "20h",
];
const MINUTES = ["00", "15", "30", "45"];

export default function ContactForm() {
  const [civilite, setCivilite] = useState<"Mme" | "M">("Mme");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState("");
  const [option, setOption] = useState<"visite" | "rappel" | "photos">(
    "visite",
  );
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>([]);
  const [jourDispo, setJourDispo] = useState("Lundi");
  const [heureDispo, setHeureDispo] = useState("9h");
  const [minutesDispo, setMinutesDispo] = useState("00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);

  const ajouterDisponibilite = () => {
    setDisponibilites((prev) => [
      ...prev,
      {
        id: Date.now(),
        jour: jourDispo,
        heure: heureDispo,
        minutes: minutesDispo,
      },
    ]);
  };

  const supprimerDisponibilite = (id: number) => {
    setDisponibilites((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);
    const formData = new FormData();
    formData.append("nom", `${prenom} ${nom}`);
    formData.append("email", email);
    formData.append("telephone", telephone);
    formData.append("message", message);
    formData.append("demandeVisite", String(option === "visite"));
    formData.append("etreRappele", String(option === "rappel"));
    formData.append("plusPhotos", String(option === "photos"));
    formData.append("disponibilites", JSON.stringify(disponibilites));
    const actionResult = await submitContact(formData);
    setResult(actionResult);
    if (actionResult.success) {
      setNom("");
      setPrenom("");
      setEmail("");
      setTelephone("");
      setMessage("");
      setCivilite("Mme");
      setOption("visite");
      setDisponibilites([]);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl items-center">
      {/* Message de résultat */}
      {result && (
        <div
          className={`mb-6 p-4 rounded-lg text-center font-medium ${
            result.success
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {result.message}
        </div>
      )}

      {/* LIGNE : 2 colonnes sur desktop, 1 colonne sur mobile */}
      <div className="flex flex-col mb-8 gap-6 lg:flex-row">
        
        {/* ===== COLONNE GAUCHE : VOS COORDONNÉES ===== */}
        <div className="flex flex-col gap-4 text-white shadow-sm p-8 lg:1/2">
          <h2 className="text-lg  font-bold sm:text-xl">VOS COORDONNÉES</h2>

          {/* Civilité : Mme / M côte à côte */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="civilite"
                value="Mme"
                checked={civilite === "Mme"}
                onChange={() => setCivilite("Mme")}
                className="w-4 h-4 text-orange-500"
              />
              <span className="text-white font-medium">Mme</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="civilite"
                value="M"
                checked={civilite === "M"}
                onChange={() => setCivilite("M")}
                className="w-4 h-4 text-orange-500"
              />
              <span className="text-white font-medium">M</span>
            </label>
          </div>

          {/* Nom et Prénom côte à côte sur desktop */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4 text-gray-600">
            <div className="flex-1">
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:border-transparent outline-none bg-white"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:border-transparent outline-none bg-white"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4 text-gray-600">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse mail"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-full focus:ring-2 bg-white"
            />
          </div>

          {/* Téléphone */}
          <div className="mb-4 text-gray-600">
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="Téléphone"
              className="w-full px-4 py-3 border border-gray-200 rounded-full focus:ring-2 bg-white"
            />
          </div>
        </div>

        {/* ===== COLONNE DROITE : VOTRE MESSAGE ===== */}
        <div className="text-white rounded-xl shadow-sm p-8 lg:p-5 lg:w-1/2">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6">
            VOTRE MESSAGE
          </h2>

          {/* Options en radio buttons */}
          <div className="gap-3 mb-5 lg:flex lg:flex-wrap">
            <label className="flex items-center gap-3 p-3 rounded-full ">
              <input
                type="radio"
                name="option"
                value="visite"
                checked={option === "visite"}
                onChange={() => setOption("visite")}
                className="w-4 h-4 text-orange-500"
              />
              <span className="font-medium">Demande de visite</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-full">
              <input
                type="radio"
                name="option"
                value="rappel"
                checked={option === "rappel"}
                onChange={() => setOption("rappel")}
                className="w-4 h-4 text-orange-500"
              />
              <span className="font-medium">Être rappelé</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-full">
              <input
                type="radio"
                name="option"
                value="photos"
                checked={option === "photos"}
                onChange={() => setOption("photos")}
                className="w-4 h-4 text-orange-500"
              />
              <span className="font-medium">Plus de photos</span>
            </label>
          </div>

          {/* Zone de message */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Votre message"
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-4xl focus:ring-2 focus:border-transparent outline-none bg-white resize-none text-gray-600"
          />
        </div>
      </div>

      {/* ===== DISPONIBILITÉS POUR UNE VISITE ===== */}
      {option === "visite" && (
        <div className="p-5 sm:p-8 rounded-xl shadow-sm mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6">
            DISPONIBILITÉS POUR UNE VISITE
          </h2>

          {/* Sélecteurs : empilés sur mobile, en ligne sur desktop */}
          <div className="flex flex-col items-stretch sm:items-end gap-3 mb-5 sm:gap-4 sm:flex-row">
            <div className="flex-1 sm:flex-none">
              <label className="block text-xs text-gray-500 mb-1 sm:hidden">
                Jour
              </label>
              <select
                value={jourDispo}
                onChange={(e) => setJourDispo(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 border border-gray-200 rounded-full bg-white outline-none focus:ring-2 text-gray-600"
              >
                {JOURS.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 sm:flex-none">
              <label className="block text-xs text-gray-500 mb-1 sm:hidden">
                Heure
              </label>
              <select
                value={heureDispo}
                onChange={(e) => setHeureDispo(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 border border-gray-200 rounded-full bg-white outline-none focus:ring-2 text-gray-600"
              >
                {HEURES.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 sm:flex-none">
              <label className="block text-xs text-gray-500 mb-1 sm:hidden">
                Minutes
              </label>
              <select
                value={minutesDispo}
                onChange={(e) => setMinutesDispo(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 border border-gray-200 rounded-full bg-white outline-none focus:ring-2 text-gray-600"
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={ajouterDisponibilite}
              className="w-full sm:w-auto px-6 py-3 bg-purple-800 text-white font-semibold rounded-full"
            >
              AJOUTER DISPO
            </button>
          </div>

          {/* Liste des dispos ajoutées */}
          {disponibilites.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {disponibilites.map((d) => (
                <span
                  key={d.id}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm"
                >
                  {d.jour} à {d.heure}
                  {d.minutes}
                  <button
                    type="button"
                    onClick={() => supprimerDisponibilite(d.id)}
                    className="w-4 h-4 bg-orange-200 text-orange-600 rounded-full flex items-center justify-center text-xs hover:bg-orange-300"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== BOUTON ENVOYER ===== */}
      <div className="flex justify-center sm:justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-16 py-3 bg-orange-500 text-white font-bold text-base  rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 shadow-lg sm:w-auto sm:px-14 sm:text-lg"
        >
          {isSubmitting ? "Envoi..." : "ENVOYER"}
        </button>
      </div>
    </form>
  );
}
