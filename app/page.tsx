import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Image de fond floutée */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <img
          src="/salon.png"
          alt="Une image de fond d'un salon chaleureux"
          className="h-fit w-full"
        />

        {/* Voile noir pour la lisibilité */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="flex flex-col items-center py-10 px-4 lg:px-12 lg:py-6 ">
          <h1 className="text-2xl font-bold text-white px-4 drop-shadow-lg lg:px-8 lg:text-4xl ">
            CONTACTEZ L&apos;AGENCE
          </h1>

          <ContactForm />
      </div>
    </main>
  );
}
