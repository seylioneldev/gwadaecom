import Header from "../components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Ici, on affiche le Header que tu viens de créer */}
      <Header />
      
      {/* Une petite zone temporaire pour montrer que le reste est vide */}
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <h2 className="text-2xl font-serif text-[#5d6e64] mb-4">Le site est en construction</h2>
        <p className="text-sm uppercase tracking-widest">Contenu à venir...</p>
      </div>
    </main>
  );
}