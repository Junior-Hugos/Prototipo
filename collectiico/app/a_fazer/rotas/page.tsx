"use client";
import { useEffect, useState } from 'react';
import { Coleta, Doador, Usuario, Voluntario } from '@prisma/client';

type ColetaDetalhada = Coleta & {
  doador: Doador & {
    usuario: Pick<Usuario, 'nome' | 'endereco'>;
  };
  voluntario: (Voluntario & {
    usuario: Pick<Usuario, 'nome'>;
  }) | null;
};

export default function RotasPage() {
  const [coletas, setColetas] = useState<ColetaDetalhada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColetas = async () => {
      try {
        const res = await fetch('/api/coletas');
        if (!res.ok) {
          throw new Error('Erro ao buscar coletas.');
        }
        const data = await res.json();
        setColetas(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchColetas();
  }, []);

  if (isLoading) return <div className="text-center p-12">Carregando coletas...</div>;
  if (error) return <div className="text-center p-12 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-text-primary mb-2 text-center">Coletas Agendadas</h2>
      <p className="text-text-secondary mb-8 text-center">Abaixo estão todas as coletas solicitadas no sistema.</p>
      
      <div className="space-y-4">
        {coletas.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-2xl shadow-card">
            <p className="text-text-secondary">Nenhuma coleta agendada no momento.</p>
          </div>
        ) : (
          coletas.map(coleta => (
            <div key={coleta.id} className="p-5 bg-white rounded-2xl shadow-card">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold text-lg text-text-primary">{coleta.tipoMaterial}</span>
                  <span className="text-text-secondary"> ({coleta.quantidade} Kg/Vol)</span>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  coleta.status === 'SOLICITADA' ? 'bg-primary-light text-primary-dark' : 'bg-green-100 text-green-800'
                }`}>
                  {coleta.status}
                </span>
              </div>
              <div className="border-t border-border-light my-3"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="block text-xs text-text-secondary">Doador</span>
                  <span className="font-medium">{coleta.doador.usuario.nome}</span>
                </div>
                <div>
                  <span className="block text-xs text-text-secondary">Endereço</span>
                  <span className="font-medium">{coleta.doador.usuario.endereco || 'Não informado'}</span>
                </div>
                 <div>
                  <span className="block text-xs text-text-secondary">Voluntário</span>
                  <span className="font-medium">{coleta.voluntario?.usuario.nome || 'Aguardando'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}