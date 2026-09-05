import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Loader2, Save, X, Building2, TrendingUp, PackageSearch } from "lucide-react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/lib/format";
import { toast } from "sonner";
import { format } from "date-fns";


export function SupplierManagementTab({ 
  suppliers, 
  loadingSuppliers,
  orders,
  onCreate, 
  onUpdate, 
  onDelete 
}: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    email: "",
    phone: ""
  });

  const handleSave = async () => {
    if (!formData.name) return toast.error("O nome é obrigatório");
    if (!formData.cnpj) return toast.error("O CNPJ é obrigatório");
    
    try {
      if (editingId) {
        await onUpdate({ id: editingId, ...formData });
      } else {
        await onCreate(formData);
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: "", cnpj: "", email: "", phone: "" });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleEdit = (sup: any) => {
    setFormData({
      name: sup.name,
      cnpj: sup.cnpj,
      email: sup.email || "",
      phone: sup.phone || ""
    });
    setEditingId(sup.id);
    setIsAdding(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberto': return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[10px]">Aberto</Badge>;
      case 'faturado': return <Badge className="bg-[#00FF00]/10 text-[#00FF00] border-[#00FF00]/20 text-[10px]">Faturado</Badge>;
      case 'cancelado': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px]">Cancelado</Badge>;
      default: return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  // Pre-compute aggregates for suppliers
  const supplierStats = suppliers.map((sup: any) => {
    const supOrders = orders.filter((o: any) => o.supplier_id === sup.id);
    const totalOrders = supOrders.length;
    const totalSpent = supOrders.reduce((sum: number, o: any) => sum + Number(o.total_value || 0), 0);
    const activeOrders = supOrders.filter((o: any) => o.status === "aberto").length;
    
    return {
      ...sup,
      totalOrders,
      totalSpent,
      activeOrders
    };
  });



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-light text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#00FF00]" /> Fornecedores
          </h2>
          <p className="text-sm text-gray-400 mt-1">Gerencie sua base de fornecedores e análise de compras.</p>
        </div>
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-[#00FF00] text-black hover:bg-[#00FF00]/80 shadow-[0_0_15px_rgba(0,255,0,0.2)] font-semibold"
          >
            + Novo Fornecedor
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-white/5 bg-[#111111]/80 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-gray-400 font-medium">Nome / CNPJ</TableHead>
              <TableHead className="text-gray-400 font-medium">Contato</TableHead>
              <TableHead className="text-gray-400 font-medium">Pedidos Totais</TableHead>
              <TableHead className="text-gray-400 font-medium text-right">Valor Comprado</TableHead>
              <TableHead className="text-gray-400 font-medium text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAdding && (
              <TableRow className="border-white/5 bg-white/5">
                <TableCell>
                  <div className="space-y-2">
                    <Input 
                      value={formData.name}
                      onChange={e => setFormData(p => ({...p, name: e.target.value}))}
                      placeholder="Nome Fantasia/Razão Social"
                      className="h-8 bg-black/40 border-white/10 text-white text-sm"
                    />
                    <Input 
                      value={formData.cnpj}
                      onChange={e => setFormData(p => ({...p, cnpj: e.target.value}))}
                      placeholder="CNPJ"
                      className="h-8 bg-black/40 border-white/10 text-white text-sm"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Input 
                      value={formData.email}
                      onChange={e => setFormData(p => ({...p, email: e.target.value}))}
                      placeholder="E-mail"
                      type="email"
                      className="h-8 bg-black/40 border-white/10 text-white text-sm"
                    />
                    <Input 
                      value={formData.phone}
                      onChange={e => setFormData(p => ({...p, phone: e.target.value}))}
                      placeholder="Telefone"
                      className="h-8 bg-black/40 border-white/10 text-white text-sm"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-gray-500 text-sm italic pt-4" colSpan={2}>
                  Dados calculados após a criação.
                </TableCell>
                <TableCell className="text-right align-top pt-4">
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
            
            {loadingSuppliers ? (
              <TableRow className="border-white/5">
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500 mx-auto" />
                </TableCell>
              </TableRow>
            ) : supplierStats.length === 0 && !isAdding ? (
              <TableRow className="border-white/5">
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Nenhum fornecedor cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              supplierStats.map((sup: any) => (
                <TableRow 
                  key={sup.id} 
                  className="border-white/5 hover:bg-[#1A1A1D]/80 transition-all cursor-pointer group"
                  onClick={(e) => {
                    // Prevent opening dialog if clicking on actions
                    if ((e.target as HTMLElement).closest('button')) return;
                    setSelectedSupplier(sup);
                  }}
                >
                  <TableCell className="!py-1.5 !px-4">
                    <div className="font-medium text-white group-hover:text-[#00FF00] transition-colors">{sup.name}</div>
                    <div className="text-[10px] text-gray-500 leading-tight">{sup.cnpj}</div>
                  </TableCell>
                  <TableCell className="!py-1.5 !px-4">
                    <div className="text-xs text-gray-300">{sup.email || "Sem e-mail"}</div>
                    <div className="text-[10px] text-gray-500 leading-tight">{sup.phone || "Sem telefone"}</div>
                  </TableCell>
                  <TableCell className="!py-1.5 !px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium text-gray-400 bg-white/5 px-2 py-0.5 rounded-sm">
                        {sup.totalOrders} total
                      </span>
                      {sup.activeOrders > 0 && (
                        <span className="text-[10px] font-medium text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-sm">
                          {sup.activeOrders} aberto
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right !py-1.5 !px-4">
                    <span className="text-[#00FF00] text-sm font-medium">
                      {formatCurrencyBRL(sup.totalSpent)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right !py-1.5 !px-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                        onClick={() => handleEdit(sup)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => {
                          if (confirm("Deletar este fornecedor? Pedidos atrelados podem ser afetados.")) onDelete(sup.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <div className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 group-hover:text-[#00FF00] transition-colors"><path d="m9 18 6-6-6-6"/></svg>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedSupplier} onOpenChange={(open) => !open && setSelectedSupplier(null)}>
        <DialogContent className="bg-[#111111] border-white/10 text-white max-w-3xl shadow-2xl overflow-hidden p-0">
          <div className="bg-gradient-to-r from-[#1A1A1D] to-[#111111] border-b border-white/5 p-6 relative">
            <DialogHeader>
              <DialogTitle className="text-xl font-light text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#00FF00]" /> Histórico de Pedidos: {selectedSupplier?.name}
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
            {selectedSupplier && (() => {
              const supOrders = orders.filter((o: any) => o.supplier_id === selectedSupplier.id)
                .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              
              if (supOrders.length === 0) {
                return (
                  <div className="text-center py-10 text-gray-500">
                    <PackageSearch className="h-10 w-10 mx-auto mb-3 opacity-50 text-gray-400" />
                    Nenhum pedido registrado para este fornecedor.
                  </div>
                );
              }
              
              return (
                <div className="space-y-4">
                  {supOrders.map((order: any) => (
                    <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4 transition-all hover:bg-white/10">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold text-white">{order.order_number}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-xs text-gray-400 space-y-1">
                          <div>Data: {order.order_date ? format(new Date(`${order.order_date}T00:00:00`), "dd/MM/yyyy") : "-"}</div>
                          {order.invoice_number && <div>NF: {order.invoice_number}</div>}
                          {order.items && <div>{order.items.length} item(ns)</div>}
                        </div>
                      </div>
                      <div className="text-right flex flex-col justify-between">
                        <div className="text-xl font-light text-[#00FF00]">
                          {formatCurrencyBRL(order.total_value)}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">
                          {order.payment_condition?.name || "Condição não definida"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
