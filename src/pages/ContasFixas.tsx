import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmartContractDialog } from "@/components/recurring-expenses/SmartContractDialog";
import { TaxDialog } from "@/components/recurring-expenses/TaxDialog";
import { PaymentManagementTab } from "@/components/recurring-expenses/PaymentManagementTab";
import { ContractManagementTab } from "@/components/recurring-expenses/ContractManagementTab";
import { TaxManagementTab } from "@/components/recurring-expenses/TaxManagementTab";
import { PaymentHistoryTab } from "@/components/recurring-expenses/PaymentHistoryTab";
import { useSmartContracts } from "@/hooks/useSmartContracts";
import { useSmartContractInstallments } from "@/hooks/useSmartContractInstallments";

export default function ContasFixas() {
  const [activeTab, setActiveTab] = useState("payments");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taxDialogOpen, setTaxDialogOpen] = useState(false);
  const [taxDialogPreset, setTaxDialogPreset] = useState<"mensal" | "anual" | "esporadico" | undefined>();
  const [editingContract, setEditingContract] = useState<any>(null);

  const { smartContracts = [], isLoading: loadingExpenses, deleteSmartContract } = useSmartContracts();
  const { 
    upcomingInstallments = [], 
    pastInstallments = [], 
    paidInstallmentsHistory = [],
    isLoadingHistory,
    isLoading: loadingInstallments, 
    markAsPaid,
    updateInstallmentValue,
    createInstallment,
    deleteInstallment
  } = useSmartContractInstallments();

  const handleEditContract = (contract: any) => {
    setEditingContract(contract);
    if (contract.category === 'impostos') {
      setTaxDialogOpen(true);
    } else {
      setDialogOpen(true);
    }
  };

  const handleDeleteContract = async (id: string) => {
    if (confirm("Tem certeza que deseja remover esta conta fixa?")) {
      await deleteSmartContract.mutateAsync(id);
    }
  };

  return (
    <>
      <div className="animate-in fade-in duration-700 pb-10 w-full">
        <div className="mb-3">
          <p className="text-gray-500 font-medium text-xs tracking-widest uppercase">Visão Estratégica das Despesas Fixas da Empresa</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mb-6">
            <TabsList className="grid w-full grid-cols-4 sm:w-[600px] bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-lg p-1 h-9">
              <TabsTrigger value="payments" className="rounded-md data-[state=active]:bg-[#00FF00]/10 data-[state=active]:text-[#00FF00] text-xs h-full transition-all">Painel de Pagamentos</TabsTrigger>
              <TabsTrigger value="management" className="rounded-md data-[state=active]:bg-[#00FF00]/10 data-[state=active]:text-[#00FF00] text-xs h-full transition-all">Gestão de Contratos</TabsTrigger>
              <TabsTrigger value="taxes" className="rounded-md data-[state=active]:bg-[#00FF00]/10 data-[state=active]:text-[#00FF00] text-xs h-full transition-all">Gestão Tributária</TabsTrigger>
              <TabsTrigger value="history" className="rounded-md data-[state=active]:bg-[#00FF00]/10 data-[state=active]:text-[#00FF00] text-xs h-full transition-all">Histórico & Dados</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="payments" className="space-y-6 mt-6">
            <PaymentManagementTab 
              smartContracts={smartContracts}
              upcomingInstallments={upcomingInstallments}
              loadingInstallments={loadingInstallments}
              markAsPaid={markAsPaid}
              updateInstallmentValue={updateInstallmentValue}
              createInstallment={createInstallment}
            />
          </TabsContent>

          <TabsContent value="management" className="space-y-6 mt-6">
             <ContractManagementTab 
               smartContracts={smartContracts} 
               loadingExpenses={loadingExpenses}
               onEditContract={handleEditContract}
               onDelete={handleDeleteContract}
             />
          </TabsContent>

          <TabsContent value="taxes" className="space-y-6 mt-6">
             <TaxManagementTab 
               smartContracts={smartContracts}
               onEdit={handleEditContract}
               onAddNew={(preset) => { 
                 setEditingContract(null); 
                 setTaxDialogPreset(preset);
                 setTaxDialogOpen(true); 
               }}
               onDelete={handleDeleteContract}
               pastInstallments={pastInstallments}
               upcomingInstallments={upcomingInstallments}
               createInstallment={createInstallment}
               markAsPaid={markAsPaid}
             />
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6 mt-6">
             <PaymentHistoryTab 
               paidInstallmentsHistory={paidInstallmentsHistory}
               isLoadingHistory={isLoadingHistory}
               onDelete={deleteInstallment.mutateAsync}
             />
          </TabsContent>
        </Tabs>
      </div>

      <SmartContractDialog 
        open={dialogOpen} 
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingContract(null);
        }}
        contractToEdit={editingContract}
      />

      <TaxDialog 
        open={taxDialogOpen} 
        onOpenChange={(open) => {
          setTaxDialogOpen(open);
          if (!open) {
            setEditingContract(null);
            setTaxDialogPreset(undefined);
          }
        }}
        taxToEdit={editingContract}
        presetRecurrence={taxDialogPreset}
      />
    </>
  );
}
