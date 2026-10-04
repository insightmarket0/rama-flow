import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Servico = {
  id: string;
  cliente: string;
  telefone: string;
  endereco: string;
  tipo: string;
  valor: string;
  horario: string;
  data: string; // YYYY-MM-DD
  status: 'pendente' | 'concluido';
  tecnico: string;
};

type AgendaStore = {
  servicos: Servico[];
  addServico: (servico: Servico) => void;
  updateStatus: (id: string, status: 'pendente' | 'concluido') => void;
  deleteServico: (id: string) => void;
};

export const useAgendaStore = create<AgendaStore>()(
  persist(
    (set) => ({
      servicos: [],
      addServico: (servico) => set((state) => ({ servicos: [...state.servicos, servico] })),
      updateStatus: (id, status) => set((state) => ({
        servicos: state.servicos.map(s => s.id === id ? { ...s, status } : s)
      })),
      deleteServico: (id) => set((state) => ({
        servicos: state.servicos.filter(s => s.id !== id)
      }))
    }),
    {
      name: 'agenda-storage-v3', // name of item in the storage (must be unique)
    }
  )
);

// Sincronização entre abas em tempo real
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'agenda-storage-v3') {
      useAgendaStore.persist.rehydrate();
    }
  });
}
