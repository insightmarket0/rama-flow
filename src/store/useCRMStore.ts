import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type InstallTicket = {
  id: string;
  customerName: string;
  whatsapp: string;
  address: string;
  orderType: string;
  product?: string;
  serviceRequested: string;
  price: string;
  paymentMethod: string;
  scheduledDate: string;
  scheduledTime?: string;
  technician: string;
  status: 'pending' | 'in_progress' | 'completed';
};

type CRMStore = {
  tickets: InstallTicket[];
  addTicket: (ticket: InstallTicket) => void;
  updateStatus: (id: string, status: InstallTicket['status']) => void;
  deleteTicket: (id: string) => void;
  updatePrice: (id: string, price: string) => void;
};

export const useCRMStore = create<CRMStore>()(
  persist(
    (set) => ({
      tickets: [],
      addTicket: (ticket) => set((state) => ({ tickets: [ticket, ...state.tickets] })),
      updateStatus: (id, status) => set((state) => ({
        tickets: state.tickets.map(t => t.id === id ? { ...t, status } : t)
      })),
      deleteTicket: (id) => set((state) => ({
        tickets: state.tickets.filter(t => t.id !== id)
      })),
      updatePrice: (id, price) => set((state) => ({
        tickets: state.tickets.map(t => t.id === id ? { ...t, price } : t)
      }))
    }),
    {
      name: 'crm-storage-v3',
    }
  )
);

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'crm-storage-v3') {
      useCRMStore.persist.rehydrate();
    }
  });
}
