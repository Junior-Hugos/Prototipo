import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-4xl font-extrabold text-text-primary mb-4">Coleta inteligente de recicláveis</h2>
          <p className="text-text-secondary text-lg mb-8">
            Conectamos doadores, voluntários e cooperativas para organizar coletas, otimizar rotas e promover a economia circular.
          </p>
          <div className="flex gap-4">
            <Link href="/cadastro" className="btn-primary">Cadastrar agora</Link>
            <Link href="/solicitar" className="btn-secondary">Solicitar coleta</Link>
          </div>
        </div>
        <div className="flex justify-center">
          {/* Você pode substituir esta imagem por uma que combine mais com o novo design */}
          <Image
            src="https://images.unsplash.com/photo-1593113598332-CD288d649414?auto=format&fit=crop&w=900&q=80"
            alt="Coleta recicláveis"
            width={900}
            height={600}
            className="rounded-2xl shadow-xl w-full max-w-md"
          />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-primary-light rounded-2xl">
            <h3 className="font-semibold text-lg text-primary-dark mb-2">Cadastro Simples</h3>
            <p className="text-text-secondary">Perfis para doadores, voluntários e cooperativas.</p>
          </div>
          <div className="p-6 bg-primary-light rounded-2xl">
            <h3 className="font-semibold text-lg text-primary-dark mb-2">Solicitação de Coleta</h3>
            <p className="text-text-secondary">Formulário rápido para agendar sua retirada.</p>
          </div>
          <div className="p-6 bg-primary-light rounded-2xl">
            <h3 className="font-semibold text-lg text-primary-dark mb-2">Gestão Completa</h3>
            <p className="text-text-secondary">Acompanhe o status, gerencie rotas e participe.</p>
          </div>
        </div>
      </section>
    </>
  );
}