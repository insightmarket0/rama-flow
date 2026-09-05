import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from "@/components/ui/accordion";
import { formatCurrencyBRL } from "@/lib/format";
import { Edit, Trash2, CheckCircle, PackageOpen, Loader2, Settings2 } from "lucide-react";
import { PaymentConditionsTab } from "./PaymentConditionsTab";

export function OrderManagementTab({ 
  orders, 
  loadingOrders, 
  onNew,
  onEdit, 
  onDelete,
  onUpdateStatus,
  paymentConditions,
  loadingConditions,
  onCreateCondition,
  onUpdateCondition,
  onDeleteCondition
}: any) {

  return (
    <div className="space-y-8">
      {/* Settings / Conditions Accordion */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="conditions" className="border-white/5 bg-[#111111]/80 backdrop-blur-sm rounded-xl px-6">
          <AccordionTrigger className="text-white hover:no-underline py-4">
            <div className="flex items-center gap-2 text-sm font-light">
              <Settings2 className="h-4 w-4 text-gray-400" /> 
              Configurar Condições de Pagamento
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <PaymentConditionsTab 
              conditions={paymentConditions}
              loading={loadingConditions}
              onCreate={onCreateCondition}
              onUpdate={onUpdateCondition}
              onDelete={onDeleteCondition}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-light text-white">Lista de Pedidos</h2>
          <Button 
            onClick={onNew}
            className="bg-[#00FF00] text-black hover:bg-[#00FF00]/80 shadow-[0_0_15px_rgba(0,255,0,0.2)] font-semibold rounded-full px-6"
          >
            + Novo Pedido
          </Button>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#111111]/80 backdrop-blur-sm overflow-hidden">
          <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-gray-400 font-medium">Nº do Pedido</TableHead>
              <TableHead className="text-gray-400 font-medium">Fornecedor</TableHead>
              <TableHead className="text-gray-400 font-medium text-right">Valor Total</TableHead>
              <TableHead className="text-gray-400 font-medium">Condição</TableHead>
              <TableHead className="text-gray-400 font-medium text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingOrders ? (
              <TableRow className="border-white/5">
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500 mx-auto" />
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow className="border-white/5">
                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                  <PackageOpen className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p>Nenhum pedido de compra registrado.</p>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: any) => (
                <TableRow key={order.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium text-white">{order.order_number}</TableCell>
                  <TableCell className="text-gray-300">{order.supplier?.name}</TableCell>
                  <TableCell className="text-right font-light text-white">{formatCurrencyBRL(order.total_value)}</TableCell>
                  <TableCell className="text-gray-300 text-sm">{order.payment_condition?.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                        onClick={() => onEdit(order)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => onDelete(order.id)}
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
    </div>
  );
}
