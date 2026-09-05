import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";

export function PaymentConditionsTab({ 
  conditions, 
  loading, 
  onCreate, 
  onUpdate, 
  onDelete 
}: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    installments: 1,
    interval_days: 30,
    down_payment_percent: 0
  });

  const handleSave = async () => {
    if (!formData.name) return toast.error("O nome é obrigatório");
    
    try {
      if (editingId) {
        await onUpdate({ id: editingId, ...formData });
      } else {
        await onCreate(formData);
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: "", installments: 1, interval_days: 30, down_payment_percent: 0 });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleEdit = (cond: any) => {
    setFormData({
      name: cond.name,
      installments: cond.installments,
      interval_days: cond.interval_days,
      down_payment_percent: cond.down_payment_percent || 0
    });
    setEditingId(cond.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-light text-white">Condições de Pagamento</h2>
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-white/10 text-white hover:bg-white/20 border border-white/20 font-semibold"
          >
            + Nova Condição
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-white/5 bg-[#111111]/80 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-gray-400 font-medium">Nome</TableHead>
              <TableHead className="text-gray-400 font-medium">Nº de Parcelas</TableHead>
              <TableHead className="text-gray-400 font-medium">Agenda (dias)</TableHead>
              <TableHead className="text-gray-400 font-medium">Entrada (%)</TableHead>
              <TableHead className="text-gray-400 font-medium text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAdding && (
              <TableRow className="border-white/5 bg-white/5">
                <TableCell>
                  <Input 
                    value={formData.name}
                    onChange={e => setFormData(p => ({...p, name: e.target.value}))}
                    placeholder="Ex: 3x Parcelado"
                    className="h-8 bg-black/40 border-white/10 text-white text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number"
                    min="1"
                    value={formData.installments}
                    onChange={e => setFormData(p => ({...p, installments: parseInt(e.target.value) || 1}))}
                    className="h-8 w-20 bg-black/40 border-white/10 text-white text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number"
                    min="0"
                    value={formData.interval_days}
                    onChange={e => setFormData(p => ({...p, interval_days: parseInt(e.target.value) || 0}))}
                    className="h-8 w-20 bg-black/40 border-white/10 text-white text-sm"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    value={formData.down_payment_percent}
                    onChange={e => setFormData(p => ({...p, down_payment_percent: parseInt(e.target.value) || 0}))}
                    className="h-8 w-20 bg-black/40 border-white/10 text-white text-sm"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0 text-[#00FF00] hover:text-[#00FF00] hover:bg-[#00FF00]/10">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setIsAdding(false); setEditingId(null); }} className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            
            {loading ? (
              <TableRow className="border-white/5">
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500 mx-auto" />
                </TableCell>
              </TableRow>
            ) : conditions.length === 0 && !isAdding ? (
              <TableRow className="border-white/5">
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Nenhuma condição cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              conditions.map((cond: any) => (
                <TableRow key={cond.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium text-white">{cond.name}</TableCell>
                  <TableCell className="text-gray-300">{cond.installments}</TableCell>
                  <TableCell className="text-gray-300">Cada {cond.interval_days} dias</TableCell>
                  <TableCell className="text-gray-300">{cond.down_payment_percent || 0}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                        onClick={() => handleEdit(cond)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => {
                          if (confirm("Deletar esta condição?")) onDelete(cond.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
