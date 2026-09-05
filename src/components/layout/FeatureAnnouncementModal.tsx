import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function FeatureAnnouncementModal() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only show for these specific users
    const isTargetUser = user?.email?.toLowerCase().includes("rogerio") || 
                         user?.email?.toLowerCase() === "livia@hotmail.com";
                         
    if (!isTargetUser) return;

    // Check if they already dismissed it
    const hasSeen = localStorage.getItem("hasSeenFeatureAnnouncement_v1");
    if (!hasSeen) {
      // Small delay for better UX
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleDismiss = () => {
    localStorage.setItem("hasSeenFeatureAnnouncement_v1", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) handleDismiss();
    }}>
      <DialogContent className="bg-[#1A1A1D] border-white/10 text-white max-w-lg shadow-2xl p-0 overflow-hidden sm:rounded-2xl">
        <div className="bg-gradient-to-br from-[#00FF00]/20 via-[#1A1A1D] to-[#1A1A1D] p-8 border-b border-white/5">
          <div className="bg-[#00FF00]/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-[#00FF00]" />
          </div>
          <DialogTitle className="text-2xl font-light text-white mb-2">
            Novidades no Módulo Comercial
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            Atualizamos toda a estrutura de Pedidos e Financeiro para te dar mais controle e agilidade!
          </DialogDescription>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="bg-white/5 p-2 rounded-lg mt-1">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Recadastre Fornecedores e Condições</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Para gerar os novos Pedidos de Compra de forma automatizada, por favor, acesse a aba <strong>Fornecedores</strong> e a aba de <strong>Condições de Pagamento</strong> e preencha os dados corretamente.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-white/5 p-2 rounded-lg mt-1">
                <TrendingUp className="h-5 w-5 text-[#00FF00]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Nova Análise Financeira e Agenda</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Agora você tem um dashboard completo de <strong>Análise Financeira</strong>. Quando você criar um Pedido, o sistema automaticamente gera as parcelas e joga na nova <strong>Agenda de Pagamentos</strong> para você projetar seu fluxo de caixa nas próximas semanas!
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-black/20 border-t border-white/5">
          <Button 
            onClick={handleDismiss}
            className="w-full bg-[#00FF00] text-black hover:bg-[#00FF00]/80 font-bold h-12 rounded-xl text-sm"
          >
            Entendido! Começar a usar <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
