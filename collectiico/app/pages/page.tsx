import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-4xl font-extrabold text-amber-800 mb-4">Coleta inteligente de recicláveis</h2>
          <p className="text-gray-700 mb-6">
            O Collectiico conecta doadores, voluntários e cooperativas para organizar coletas, otimizar rotas e reduzir emissões.
            Experimente o protótipo: cadastre-se e solicite uma coleta em poucos passos.
          </p>
          <div className="flex gap-3">
            <Link href="/cadastro" className="bg-amber-700 text-white px-5 py-3 rounded-lg">Cadastrar</Link>
            <Link href="/solicitar" className="border border-amber-700 text-amber-700 px-5 py-3 rounded-lg">Solicitar coleta</Link>
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=60"
            alt="Coleta recicláveis"
            width={900}
            height={600}
            className="rounded-xl shadow-lg w-full max-w-md"
          />
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Cadastro simples</h3>
            <p className="text-gray-600">Perfis para doadores, voluntários e cooperativas.</p>
          </div>
          <div className="p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Solicitação de coleta</h3>
            <p className="text-gray-600">Formulário rápido para agendar retirada de materiais.</p>
          </div>
          <div className="p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Otimização de rotas</h3>
            <p className="text-gray-600">Visualização de rotas planejadas para reduzir custos e CO₂.</p>
          </div>
        </div>
      </section>
    </>
  );
}