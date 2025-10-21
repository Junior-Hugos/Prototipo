"use client";
import { useState, FormEvent, useEffect } from 'react';
import { Campanha } from '@prisma/client';
import { useAuth } from '../../context/AuthContext';

type CampanhaComContagem = Campanha & {
  _count: { voluntarios: number }
};

export default function CampanhasPage() {
  const [campaigns, setCampaigns] = useState<CampanhaComContagem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  
  const { session } = useAuth();
  const podePostar = session?.tipo === 'VOLUNTARIO' || session?.tipo === 'EMPRESA';
  const eVoluntario = session?.tipo === 'VOLUNTARIO';

  useEffect(() => {
    const fetchCampanhas = async () => {
      try {
        const res = await fetch('/api/campanhas');
        const data = await res.json();
        setCampaigns(data);
      } catch (error) {
        console.error('Erro ao buscar campanhas', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampanhas();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/campanhas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: title, descricao: desc }),
      });
      const newCampaign = await res.json();
      setCampaigns(prev => [{...newCampaign, _count: { voluntarios: 0 }}, ...prev]);
      setTitle('');
      setDesc('');
    } catch (error) {
      alert('Erro ao criar campanha');
    }
  };

  const handleJoin = async (campanhaId: string) => {
    try {
      const res = await fetch(`/api/campanhas/${campanhaId}/join`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error((await res.json()).message);
      alert('Inscrição realizada com sucesso!');
      setCampaigns(prev => prev.map(c => 
        c.id === campanhaId ? { ...c, _count: { voluntarios: c._count.voluntarios + 1 } } : c
      ));
    } catch (error: any) {
      alert('Erro: ' + error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-text-primary mb-2 text-center">Campanhas</h2>
      <p className="text-text-secondary mb-8 text-center">Divulgue ações ou participe como voluntário.</p>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Coluna de Campanhas */}
        <div className="md:col-span-2 space-y-4">
          {isLoading ? <p>Carregando...</p> : (
            campaigns.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl shadow-card text-center">
                <p className="text-text-secondary">Nenhuma campanha ativa.</p>
              </div>
            ) : (
              campaigns.map(c => (
                <div key={c.id} className="p-5 bg-white rounded-2xl shadow-card">
                  <div className="font-semibold text-lg text-text-primary">{c.titulo}</div>
                  <p className="text-text-secondary text-sm my-2">{c.descricao}</p>
                  <div className="border-t border-border-light pt-3 mt-3 flex justify-between items-center">
                    <span className="text-sm text-primary font-medium">
                      {c._count.voluntarios} voluntário(s)
                    </span>
                    {eVoluntario && (
                      <button 
                        onClick={() => handleJoin(c.id)}
                        className="text-sm bg-primary-light text-primary font-medium px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors">
                        Quero Participar
                      </button>
                    )}
                  </div>
                </div>
              ))
            )
          )}
        </div>
        
        {/* Coluna de Criar Campanha */}
        {session && podePostar && (
          <div className="bg-white p-6 rounded-2xl shadow-card h-fit">
            <h3 className="font-semibold text-lg mb-4">Criar Campanha</h3>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <label className="text-sm font-medium mb-1">Título</label>
                <input
                  id="titulo"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1">Descrição</label>
                <textarea
                  id="desc"
                  rows={4}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn-primary w-full">Publicar</button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}