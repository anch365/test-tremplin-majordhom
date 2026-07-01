import ContactForm from '@/components/ContactForm'

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Image de fond floutée */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920')] bg-cover bg-center"
          style={{ filter: 'blur(8px)' }} />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Titre */}
          <h1 className="text-4xl font-bold text-white text-center mb-10 drop-shadow-lg">
            CONTACTEZ L&apos;AGENCE
          </h1>
          
          <ContactForm />
        </div>
      </div>
    </main>
  )
}