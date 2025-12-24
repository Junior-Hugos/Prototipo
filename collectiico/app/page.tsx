import Image from 'next/image';
import Link from 'next/link';
import imgSite from './assets/images/img_site.png';

export default function HomePage() {
  return (
    <>
      {/* Ajuste: Padding vertical menor no mobile (py-10) e maior no PC (md:py-16) */}
      <section className="max-w-6xl mx-auto px-6 py-10 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Ajuste: Texto centralizado no mobile, alinhado à esquerda no PC */}
        <div className="text-center md:text-left">
          {/* Ajuste: Fonte um pouco menor no mobile (3xl) para não estourar a tela */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
            Coleta inteligente de recicláveis
          </h2>
          <p className="text-text-secondary text-base md:text-lg mb-8">
            Conectamos doadores, voluntários e cooperativas para organizar coletas, otimizar rotas e promover a economia circular.
          </p>
          
          {/* Ajuste: Botões empilhados (flex-col) no mobile e lado a lado (sm:flex-row) no tablet/PC */}
          {/* w-full nos links garante área de toque grande no dedo */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/cadastro" className="btn-primary w-full sm:w-auto text-center block">Cadastrar agora</Link>
            <Link href="/solicitar" className="btn-secondary w-full sm:w-auto text-center block">Solicitar coleta</Link>
          </div>
        </div>

        <div className="flex justify-center mt-6 md:mt-0">
          <Image
            src={imgSite}
            alt="Coleta recicláveis"
            width={900}
            height={600}
            className="rounded-2xl shadow-xl w-full max-w-md h-auto" // h-auto garante a proporção correta
            priority // Melhora o carregamento da imagem principal (LCP)
          />
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        {/* Ajuste: grid-cols-1 explícito para mobile (1 coluna) */}
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-primary-light rounded-2xl border border-transparent hover:border-green-100 transition-colors">
            <h3 className="font-semibold text-lg text-primary-dark mb-2">Cadastro Simples</h3>
            <p className="text-text-secondary">Perfis para doadores, voluntários e cooperativas.</p>
          </div>
          <div className="p-6 bg-primary-light rounded-2xl border border-transparent hover:border-green-100 transition-colors">
            <h3 className="font-semibold text-lg text-primary-dark mb-2">Solicitação de Coleta</h3>
            <p className="text-text-secondary">Formulário rápido para agendar sua retirada.</p>
          </div>
          <div className="p-6 bg-primary-light rounded-2xl border border-transparent hover:border-green-100 transition-colors">
            <h3 className="font-semibold text-lg text-primary-dark mb-2">Gestão Completa</h3>
            <p className="text-text-secondary">Acompanhe o status, gerencie rotas e participe.</p>
          </div>
        </div>
      </section>
    </>
  );
}