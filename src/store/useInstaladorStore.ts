import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PerfilInstalador = {
  nome: string;
  celular: string;
  placa: string;
  avatar: string;
  frase: string;
};

type InstaladorStore = {
  perfil: PerfilInstalador;
  atualizarPerfil: (perfil: Partial<PerfilInstalador>) => void;
};

export const useInstaladorStore = create<InstaladorStore>()(
  persist(
    (set) => ({
      perfil: {
        nome: '',
        celular: '',
        placa: '',
        avatar: '👨‍🔧',
        frase: 'Mais um dia salvando a pátria (e os fogões)!'
      },
      atualizarPerfil: (novoPerfil) => set((state) => ({
        perfil: { ...state.perfil, ...novoPerfil }
      }))
    }),
    {
      name: 'instalador-profile-v1',
    }
  )
);

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'instalador-profile-v1') {
      useInstaladorStore.persist.rehydrate();
    }
  });
}
