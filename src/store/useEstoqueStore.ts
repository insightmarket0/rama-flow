import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EstoqueItem = {
  id: string;
  nome: string;
  quantidade: number;
  minimo: number;
  preco: number;
};

type EstoqueStore = {
  itens: EstoqueItem[];
  ultimaAtualizacao: string | null;
  solicitacaoAtiva: boolean;
  solicitacaoData: string | null;
  adicionarItem: (item: Omit<EstoqueItem, 'id'>) => void;
  atualizarQuantidade: (id: string, quantidade: number) => void;
  registrarAbastecimento: () => void;
  deduzirEstoque: (nome: string, qtd: number) => void;
  solicitarReposicao: () => void;
};

export const useEstoqueStore = create<EstoqueStore>()(
  persist(
    (set) => ({
      itens: [
        { id: '1', nome: 'Kit Gás 1 Metro', quantidade: 0, minimo: 2, preco: 150.00 },
        { id: '2', nome: 'Kit Gás 2 Metros', quantidade: 0, minimo: 2, preco: 180.00 },
        { id: '3', nome: 'Registro Baixa Pressão', quantidade: 0, minimo: 2, preco: 45.00 },
        { id: '4', nome: 'Mangueira Avulsa (m)', quantidade: 0, minimo: 5, preco: 25.00 },
        { id: '5', nome: 'Abraçadeira', quantidade: 0, minimo: 10, preco: 5.00 },
      ],
      ultimaAtualizacao: null,
      solicitacaoAtiva: false,
      solicitacaoData: null,
      adicionarItem: (item) => set((state) => ({ 
        itens: [...state.itens, { ...item, id: Math.random().toString() }] 
      })),
      atualizarQuantidade: (id, quantidade) => set((state) => ({
        itens: state.itens.map(i => i.id === id ? { ...i, quantidade } : i)
      })),
      registrarAbastecimento: () => set({ 
        ultimaAtualizacao: new Date().toISOString(),
        solicitacaoAtiva: false, // Ao abastecer, a solicitação some
        solicitacaoData: null
      }),
      deduzirEstoque: (nome, qtd) => set((state) => ({
        itens: state.itens.map(i => i.nome === nome ? { ...i, quantidade: Math.max(0, i.quantidade - qtd) } : i)
      })),
      solicitarReposicao: () => set({ 
        solicitacaoAtiva: true,
        solicitacaoData: new Date().toISOString()
      })
    }),
    {
      name: 'estoque-storage-v3', // bumped again for the new fields
    }
  )
);

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'estoque-storage-v3') {
      useEstoqueStore.persist.rehydrate();
    }
  });
}
