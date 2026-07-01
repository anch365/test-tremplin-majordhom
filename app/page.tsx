import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Image de fond floutée */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <img
          src="./salon.png"
          alt="Une image de fond d'un salon chaleureux"
          className="w-full h-full object-cover"
        />

        {/* Voile noir pour la lisibilité */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="flex flex-col items-start py-10 px-4 lg:py-6">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-xl font-bold text-white px-8 drop-shadow-lg lg:text-4xl">
            CONTACTEZ L&apos;AGENCE
          </h1>

          <ContactForm />
        </div>
      </div>
    </main>
  );
}
