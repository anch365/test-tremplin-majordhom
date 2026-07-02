import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen flex py-16 md:px-8 lg:px-16">
      {/* image de fond floutée */}
      <section
        className=" justify-center  w-full md:rounded-4xl"
        style={{
          backgroundImage: "url('/salon.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* div filtre noir transparent sur l'image */}
        <div className="h-full w-full bg-black/55 flex flex-col gap-8  overflow-hidden px-4 py-8 md:rounded-4xl xl:px-16 xl:py-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg ">
            CONTACTEZ L&apos;AGENCE
          </h1>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
