import React, { useState } from "react";
import { User, Phone, Car, Save, ShieldCheck, Sparkles, Quote, LogOut, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useInstaladorStore } from "../../store/useInstaladorStore";

const MOTIVACIONAIS = [
  "Mais um dia salvando a pátria (e os fogões)!",
  "Se der vazamento, a culpa é do estagiário.",
  "Sorria, você está sendo bem pago (ou não).",
  "A fita teflon é sua melhor amiga hoje.",
  "Missão dada é missão instalada!",
  "Chave inglesa na mão e paz no coração."
];

export default function InstaladorPerfil() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const perfil = useInstaladorStore(state => state.perfil);
  const atualizarPerfil = useInstaladorStore(state => state.atualizarPerfil);

  // Estado temporário para edição (para não atualizar global a cada tecla)
  const [draft, setDraft] = useState(perfil);

  // Sincroniza draft quando entra em modo de edição
  const handleEdit = () => {
    setDraft(perfil);
    setIsEditing(true);
  };

  const handleSave = () => {
    atualizarPerfil(draft);
    setIsSaved(true);
    toast.success("Perfil atualizado com sucesso!");
    setTimeout(() => {
      setIsSaved(false);
      setIsEditing(false);
    }, 1500);
  };

  const randomizeQuote = () => {
    const random = MOTIVACIONAIS[Math.floor(Math.random() * MOTIVACIONAIS.length)];
    setDraft({ ...draft, frase: random });
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#F8F9FA] text-[#1A1C1E] selection:bg-purple-200">
      
      <main className="flex-1 px-6 pt-6 flex flex-col gap-6 pb-40">
        
        {/* Avatar Section */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-400 p-1 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-4xl border-2 border-transparent">
              {perfil.avatar}
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-black text-gray-900">{perfil.nome || "Seu Nome Aqui"}</h2>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 flex items-center justify-center gap-1 mt-1">
              <ShieldCheck className="w-3 h-3" /> Instalador Master
            </span>
          </div>
        </div>

        {/* Informações do Perfil */}
        {isEditing ? (
          <div className="bg-white rounded-3xl p-6 flex flex-col gap-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50 mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Nome de Exibição
              </label>
              <input 
                value={draft.nome}
                onChange={e => setDraft({...draft, nome: e.target.value})}
                placeholder="Ex: Roberto Silva"
                className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Celular Corporativo
              </label>
              <input 
                value={draft.celular}
                onChange={e => setDraft({...draft, celular: e.target.value})}
                placeholder="Ex: (11) 99999-9999"
                className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" /> Placa do Veículo (Van)
              </label>
              <input 
                value={draft.placa}
                onChange={e => setDraft({...draft, placa: e.target.value})}
                placeholder="Ex: ABC-1234"
                className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:border-purple-500 transition-colors uppercase"
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 flex flex-col gap-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50 mt-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Nome de Exibição
              </label>
              <span className="text-sm font-bold text-gray-900">{perfil.nome || "Não definido"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Celular Corporativo
              </label>
              <span className="text-sm font-bold text-gray-900">{perfil.celular || "Não definido"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" /> Placa do Veículo (Van)
              </label>
              <span className="text-sm font-bold text-gray-900 uppercase">{perfil.placa || "Não definido"}</span>
            </div>
          </div>
        )}

        {/* Frase Motivacional */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-6 flex flex-col gap-4 border border-purple-100/50">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-widest text-purple-600 flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5" /> Frase do Dia (Home)
            </label>
            {isEditing && (
              <button 
                onClick={randomizeQuote}
                className="text-purple-500 bg-white shadow-sm p-1.5 rounded-xl hover:text-purple-700 transition-colors active:scale-95"
                title="Gerar frase aleatória"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
          {isEditing ? (
            <textarea 
              value={draft.frase}
              onChange={e => setDraft({...draft, frase: e.target.value})}
              className="bg-white/50 border border-white px-4 py-3 rounded-2xl text-sm font-bold text-gray-800 focus:outline-none focus:border-purple-300 transition-colors resize-none h-20 text-center flex items-center justify-center leading-relaxed"
            />
          ) : (
            <div className="px-4 py-3 text-sm font-bold text-gray-800 text-center leading-relaxed italic">
              "{perfil.frase}"
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing ? (
          <div className="flex flex-col gap-3 mt-4">
            <button 
              onClick={handleSave}
              className={`w-full h-14 rounded-2xl font-bold text-sm flex justify-center items-center gap-2 shadow-xl transition-all duration-300 active:scale-95 ${
                isSaved 
                  ? 'bg-green-500 text-white shadow-green-500/20' 
                  : 'bg-[#1A1C1E] text-white shadow-black/20'
              }`}
            >
              {isSaved ? <ShieldCheck className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {isSaved ? 'Alterações Salvas!' : 'Salvar Perfil'}
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="w-full h-12 rounded-2xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-4">
            <button 
              onClick={handleEdit}
              className="w-full h-14 rounded-2xl bg-white border border-gray-200 font-bold text-sm flex justify-center items-center gap-2 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors active:scale-95"
            >
              <Edit2 className="w-4 h-4" /> Editar Configurações
            </button>
          </div>
        )}

        <button className="flex items-center justify-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest py-4 hover:bg-red-50 rounded-2xl transition-colors mt-2">
          <LogOut className="w-4 h-4" /> Sair do Aplicativo
        </button>

      </main>

    </div>
  );
}
