"use client";

import { useState } from "react";

// --- TIPOS E ÍCONES PARA O MODAL ---
type TestResult = {
  testName: string;
  status: "success" | "error" | "warning";
  message: string;
};

const CheckCircle = () => <span className="text-green-500 text-xl">✔</span>;
const XCircle = () => <span className="text-red-500 text-xl">✖</span>;
const AlertCircle = () => <span className="text-yellow-500 text-xl">⚠</span>;

export default function TestesPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState<string | null>(null);

  // Estados do Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportResults, setReportResults] = useState<TestResult[]>([]);

  // Função auxiliar para adicionar logs na tela
  const addLog = (msg: string, type: "info" | "success" | "error" | "warning" = "info") => {
    const time = new Date().toLocaleTimeString();
    const prefix = type === "error" ? "❌" : type === "success" ? "✅" : type === "warning" ? "⚠️" : "ℹ️";
    setLogs((prev) => [`[${time}] ${prefix} ${msg}`, ...prev]);
  };

  // ==========================================
  // MÓDULO 1: COLETAS
  // ==========================================

  const testCreate = async () => {
    setLoading(true);
    addLog("--- Testando Rota: Solicitar Coleta (POST) ---");
    try {
      const payload = {
        tipoMaterial: "Teste Automatizado",
        quantidade: 99,
        data: new Date().toISOString().split("T")[0],
      };
      // Certifique-se que a rota /api/coletas existe
      const res = await fetch("/api/coletas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        addLog(`Coleta criada! ID: ${data.id}`, "success");
        setLastId(data.id);
        return { success: true, id: data.id, msg: "Coleta criada com sucesso" };
      } else {
        addLog(`Falha ao criar: ${data.message}`, "error");
        return { success: false, msg: data.message };
      }
    } catch (error) {
      addLog(`Erro de conexão: ${String(error)}`, "error");
      return { success: false, msg: "Erro de conexão" };
    } finally { setLoading(false); }
  };

  const testList = async () => {
    setLoading(true);
    addLog("--- Testando Rota: Ver Coletas (GET) ---");
    try {
      const res = await fetch("/api/coletas");
      const data = await res.json();
      if (res.ok) {
        addLog(`API respondeu com ${data.length} coletas.`, "success");
        return { success: true, msg: "Listagem OK" };
      } else {
        addLog(`Falha ao listar: ${data.message}`, "error");
        return { success: false, msg: "Falha na listagem" };
      }
    } catch (error) {
      addLog(`Erro de conexão: ${String(error)}`, "error");
      return { success: false, msg: "Erro de conexão" };
    } finally { setLoading(false); }
  };

  const testUpdate = async (idToUse?: string) => {
    const id = idToUse || lastId;
    if (!id) {
      addLog("Nenhum ID para atualizar.", "error");
      return { success: false, msg: "ID não fornecido" };
    }
    setLoading(true);
    addLog(`--- Testando Ação: Concluir Coleta (PUT) ID: ${id} ---`);
    try {
      const res = await fetch("/api/coletas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, status: "CONCLUIDA" }),
      });
      const data = await res.json();
      if (res.ok) {
        addLog(`Status atualizado para: ${data.status}`, "success");
        return { success: true, msg: "Status atualizado" };
      } else {
        addLog(`Falha ao atualizar: ${data.message}`, "error");
        return { success: false, msg: "Erro ao atualizar" };
      }
    } catch (error) {
      addLog(`Erro de conexão: ${String(error)}`, "error");
      return { success: false, msg: "Erro de conexão" };
    } finally { setLoading(false); }
  };

  const testDelete = async (idToUse?: string) => {
    const id = idToUse || lastId;
    if (!id) {
      addLog("Nenhum ID para excluir.", "error");
      return { success: false, msg: "ID não fornecido" };
    }
    setLoading(true);
    addLog(`--- Testando Ação: Excluir Coleta (DELETE) ---`);
    try {
      const res = await fetch("/api/coletas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });
      if (res.ok) {
        addLog("Coleta excluída com sucesso!", "success");
        setLastId(null);
        return { success: true, msg: "Registro deletado" };
      } else {
        const data = await res.json();
        addLog(`Falha ao excluir: ${data.message}`, "error");
        return { success: false, msg: "Erro ao deletar" };
      }
    } catch (error) {
      addLog(`Erro de conexão: ${String(error)}`, "error");
      return { success: false, msg: "Erro de conexão" };
    } finally { setLoading(false); }
  };

  // ==========================================
  // MÓDULO 2: CONFIGURAÇÕES
  // ==========================================
  
  const testProfileUpdate = async () => {
    setLoading(true);
    addLog("--- Testando Rota: Configurações (PUT Usuário) ---");
    try {
      const payload = { cidade: "Cidade Teste API" };
      
      // AJUSTE CRÍTICO: Rota corrigida para /api/user/profile
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (res.ok) {
        addLog(`Perfil atualizado! Nova cidade: ${data.user.cidade}`, "success");
        return { success: true, msg: "Perfil atualizado" };
      } else {
        addLog(`Falha ao atualizar perfil: ${data.message || data.error}`, "error");
        return { success: false, msg: "Erro ao editar perfil" };
      }
    } catch (error) {
      addLog(`Erro de conexão: ${String(error)}`, "error");
      return { success: false, msg: "Erro de conexão" };
    } finally { setLoading(false); }
  };

  // ==========================================
  // MÓDULO 3: CAMPANHAS
  // ==========================================

  const testCreateCampaign = async () => {
    setLoading(true);
    addLog("--- Testando Rota: Criar Campanha (POST) ---");
    try {
      const payload = {
        titulo: "Campanha Teste Auto",
        descricao: "Teste Diagnostico"
      };
      const res = await fetch("/api/campanhas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        addLog(`Campanha criada com sucesso! ID: ${data.id}`, "success");
        return { status: "success", msg: "Campanha criada" };
      } else if (res.status === 401) {
        addLog(`Acesso Negado (401): ${data.message}`, "warning");
        return { status: "warning", msg: "Segurança Ativa: Doador bloqueado" };
      } else {
        addLog(`Erro ao criar campanha: ${data.message}`, "error");
        return { status: "error", msg: data.message };
      }
    } catch (error) {
      addLog(`Erro de conexão: ${String(error)}`, "error");
      return { status: "error", msg: "Erro de conexão" };
    } finally { setLoading(false); }
  };

  const testListCampaigns = async () => {
    setLoading(true);
    addLog("--- Testando Rota: Listar Campanhas (GET) ---");
    try {
      const res = await fetch("/api/campanhas");
      const data = await res.json();
      if (res.ok) {
        addLog(`Listagem recebida. Total: ${data.length}`, "success");
        return { success: true, msg: "Listagem campanhas OK" };
      } else {
        addLog(`Erro ao listar campanhas: ${data.message}`, "error");
        return { success: false, msg: "Erro listagem campanhas" };
      }
    } catch (error) {
      addLog(`Erro de conexão: ${String(error)}`, "error");
      return { success: false, msg: "Erro de conexão" };
    } finally { setLoading(false); }
  };

  // ==========================================
  // AUTOMAÇÃO COM RELATÓRIO
  // ==========================================

  const runFullCycle = async () => {
    setLogs([]);
    setReportResults([]);
    addLog("=== INICIANDO CHECKUP GERAL DE TODO O SISTEMA ===");
    
    const results: TestResult[] = [];

    // 1. Coletas (Ciclo CRUD)
    const resCreate = await testCreate();
    results.push({ 
        testName: "1. Criar Coleta (Backend)", 
        status: resCreate.success ? "success" : "error", 
        message: resCreate.msg 
    });

    const tempId = resCreate.id;

    if (tempId) {
        await new Promise(r => setTimeout(r, 400));
        const resList = await testList();
        results.push({ testName: "2. Listar Dados", status: resList.success ? "success" : "error", message: resList.msg });

        await new Promise(r => setTimeout(r, 400));
        const resUpdate = await testUpdate(tempId);
        results.push({ testName: "3. Atualizar Status", status: resUpdate.success ? "success" : "error", message: resUpdate.msg });

        await new Promise(r => setTimeout(r, 400));
        const resDelete = await testDelete(tempId);
        results.push({ testName: "4. Limpeza (Delete)", status: resDelete.success ? "success" : "error", message: resDelete.msg });
    } else {
        results.push({ testName: "Testes Dependentes", status: "error", message: "Cancelados (Falha na criação)" });
    }

    // 2. Perfil
    await new Promise(r => setTimeout(r, 400));
    const resProfile = await testProfileUpdate();
    results.push({ testName: "5. Configurações de Usuário", status: resProfile.success ? "success" : "error", message: resProfile.msg });

    // 3. Campanhas
    await new Promise(r => setTimeout(r, 400));
    const resCampCreate = await testCreateCampaign();
    // Aqui usamos 'as any' porque o status pode ser 'warning', que definimos no tipo lá em cima
    results.push({ testName: "6. Segurança Campanhas", status: resCampCreate.status as any, message: resCampCreate.msg });

    addLog("=== CHECKUP FINALIZADO ===", "success");
    
    // Abre o Modal com os resultados
    setReportResults(results);
    setShowReportModal(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Diagnóstico Completo</h1>
        <p className="text-gray-500">Validação de rotas para: Coletas, Campanhas e Configurações.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Painel de Controle */}
        <div className="space-y-6">
          
          {/* Grupo Coletas */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-700 mb-3 border-b pb-2">📦 Menu: Coletas</h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => testCreate()} disabled={loading} className="btn-test bg-blue-50 text-blue-700 hover:bg-blue-100">
                1. Solicitar (POST)
              </button>
              <button onClick={testList} disabled={loading} className="btn-test bg-purple-50 text-purple-700 hover:bg-purple-100">
                2. Ver Lista (GET)
              </button>
              <button onClick={() => testUpdate()} disabled={loading || !lastId} className="btn-test bg-orange-50 text-orange-700 hover:bg-orange-100 disabled:opacity-50">
                3. Concluir (PUT)
              </button>
              <button onClick={() => testDelete()} disabled={loading || !lastId} className="btn-test bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50">
                4. Excluir (DELETE)
              </button>
            </div>
          </div>

          {/* Grupo Campanhas e Config */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-700 mb-3 border-b pb-2">📢 Menu: Campanhas</h2>
              <div className="space-y-2">
                <button onClick={testCreateCampaign} disabled={loading} className="w-full btn-test bg-teal-50 text-teal-700 hover:bg-teal-100">
                  Criar (POST)
                </button>
                <button onClick={testListCampaigns} disabled={loading} className="w-full btn-test bg-teal-50 text-teal-700 hover:bg-teal-100">
                  Listar (GET)
                </button>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-700 mb-3 border-b pb-2">⚙️ Menu: Config</h2>
              <button 
                onClick={testProfileUpdate} 
                disabled={loading}
                className="w-full btn-test bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Atualizar Perfil
              </button>
              <p className="text-[10px] text-gray-400 mt-2">*Muda a cidade temporariamente.</p>
            </div>
          </div>

          {/* Botão Geral */}
          <div className="bg-green-600 p-5 rounded-xl shadow-md text-white text-center">
             <h2 className="font-bold text-lg mb-2">Teste Automático Completo</h2>
             <p className="text-green-100 text-sm mb-4">Executa Coletas &rarr; Perfil &rarr; Campanhas.</p>
             <button 
               onClick={runFullCycle} 
               disabled={loading}
               className="w-full bg-white text-green-700 py-3 rounded-lg font-bold hover:bg-green-50 transition-all active:scale-95 shadow-sm"
             >
               RODAR DIAGNÓSTICO GERAL 🚀
             </button>
          </div>

        </div>

        {/* Terminal de Logs */}
        <div className="bg-gray-900 rounded-xl p-4 h-[600px] overflow-y-auto font-mono text-sm shadow-inner flex flex-col">
          <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
            <span className="text-gray-400 font-semibold">Terminal de Respostas</span>
            <button onClick={() => setLogs([])} className="text-xs text-gray-500 hover:text-white px-2 py-1 bg-gray-800 rounded">Limpar</button>
          </div>
          
          <div className="flex-1 space-y-2">
            {logs.length === 0 && (
              <div className="text-gray-600 italic text-center mt-32 flex flex-col items-center">
                <span>Aguardando comandos...</span>
              </div>
            )}
            {logs.map((log, index) => (
              <div key={index} className="animate-in fade-in slide-in-from-left-2 break-all">
                <span className={
                  log.includes("❌") ? "text-red-400" : 
                  log.includes("✅") ? "text-green-400" : 
                  log.includes("⚠️") ? "text-yellow-400" :
                  "text-blue-300"
                }>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- MODAL DE RELATÓRIO FINAL --- */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Header do Modal */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Relatório de Diagnóstico</h3>
              <span className="text-xs font-mono text-gray-400">{new Date().toLocaleTimeString()}</span>
            </div>

            {/* Lista de Resultados */}
            <div className="p-6 space-y-4">
              {reportResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {result.status === 'success' && <CheckCircle />}
                    {result.status === 'error' && <XCircle />}
                    {result.status === 'warning' && <AlertCircle />}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${
                        result.status === 'success' ? 'text-gray-800' : 
                        result.status === 'error' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {result.testName}
                    </p>
                    <p className="text-xs text-gray-500">{result.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer com Botão Concluir */}
            <div className="p-6 pt-0">
              <button 
                onClick={() => setShowReportModal(false)}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all"
              >
                Concluir Diagnóstico
              </button>
            </div>

          </div>
        </div>
      )}
      
      {/* Estilos inline para os botões */}
      <style jsx>{`
        .btn-test {
          @apply py-2 px-3 rounded-lg font-medium text-sm text-left transition-colors flex justify-between items-center w-full;
        }
      `}</style>
    </div>
  );
}