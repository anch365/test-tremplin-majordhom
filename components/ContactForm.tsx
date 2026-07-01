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
const MINUTES = ["0m", "10m", "15m", "20m", "25m", "30m", "35m", "40m", "45m"];

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

  const ajouterDisponibilite = (e: React.MouseEvent) => {
    e.preventDefault(); // ← Ajoute ça !!! Empêche tout comportement par défaut
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
    <form onSubmit={handleSubmit} className="w-full max-w-5xl items-start">
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

      <section className="flex flex-col mb-8 gap-6 lg:flex-row">

        {/* ===== COLONNE GAUCHE : VOS COORDONNÉES ===== */}

        <section className="flex flex-col gap-8 text-white shadow-sm p-8 lg:3/5">
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
          <div>
            <div className="flex flex-col gap-4 mb-4 text-gray-600 sm:flex-row ">
              <div className="flex-1">
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Nom"
                  required
                  className="w-full px-8 py-3 border border-gray-200 rounded-full focus:ring-2 focus:border-transparent outline-none bg-white"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Prénom"
                  required
                  className="w-full px-8 py-3 border border-gray-200 rounded-full focus:ring-2 focus:border-transparent outline-none bg-white"
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
                className="w-full px-8 py-3 border border-gray-200 rounded-full focus:ring-2 bg-white"
              />
            </div>

            {/* Téléphone */}
            <div className="mb-4 text-gray-600">
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="Téléphone"
                className="w-full px-8 py-3 border border-gray-200 rounded-full focus:ring-2 bg-white"
              />
            </div>
          </div>
        </section>

        {/* ===== COLONNE DROITE : VOTRE MESSAGE ===== */}
        <section className="text-white rounded-xl shadow-sm p-8 lg:p-5 lg:w-4/5">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6">
            VOTRE MESSAGE
          </h2>

          {/* Options en radio buttons */}
          <div className="gap-3 mb-5 font-thin lg:flex lg:flex-row">
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
            className="w-full px-8 py-3 border border-gray-200 rounded-4xl focus:ring-2 focus:border-transparent outline-none bg-white resize-none text-gray-600"
          />
        </section>
      </section>

      {/* ===== DISPONIBILITÉS POUR UNE VISITE ===== */}
      {option === "visite" && (
        <div className="p-5 sm:p-8 rounded-xl shadow-sm mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6">
            DISPONIBILITÉS POUR UNE VISITE
          </h2>

          <div className="flex flex-col items-stretch gap-3 mb-5 sm:gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 sm:flex-none">
              <label className="block text-xs text-gray-200 mb-1 sm:hidden">
                Jour
              </label>
              <select
                value={jourDispo}
                onChange={(e) => setJourDispo(e.target.value)}
                className="w-full sm:w-auto px-8 py-3 border border-gray-200 rounded-full bg-white outline-none focus:ring-2 text-gray-600"
              >
                {JOURS.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 sm:flex-none">
              <label className="block text-xs text-gray-200 mb-1 sm:hidden">
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
              <label className="block text-xs text-gray-200 mb-1 sm:hidden">
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

            {/* AJOUTER DISPO */}
            <span
              onClick={ajouterDisponibilite}
              className="cursor-pointer w-full sm:w-auto px-6 py-3 bg-purple-800 hover:bg-purple-600 text-white font-semibold rounded-full inline-block text-center"
            >
              AJOUTER DISPO
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full sm:w-auto px-10 py-3 bg-orange-400 text-white font-bold rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 shadow-lg text-center"
            >
              {isSubmitting ? "Envoi..." : "ENVOYER"}
            </button>
          </div>

          {/* Liste des dispos ajoutées */}
          {disponibilites.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {disponibilites.map((d) => (
                <span
                  key={d.id}
                  className="inline-flex items-center gap-16 px-4 py-2 bg-white/80 text-gray-600 rounded-full text-sm"
                >
                  {d.jour} à {d.heure}
                  {d.minutes}
                  <button
                    type="button"
                    onClick={() => supprimerDisponibilite(d.id)}
                    className="w-4 h-4 flex items-center justify-center text-xs font-extrabold"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </form>
  );
}
