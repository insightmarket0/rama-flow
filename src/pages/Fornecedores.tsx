import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Fornecedores = () => {
  const suppliers = [
    { name: "Fornecedor ABC", cnpj: "12.345.678/0001-00", email: "contato@abc.com.br", phone: "(11) 98765-4321", orders: 8, total: "R$ 125.000,00" },
    { name: "Fornecedor XYZ", cnpj: "98.765.432/0001-00", email: "contato@xyz.com.br", phone: "(11) 91234-5678", orders: 5, total: "R$ 85.000,00" },
    { name: "Fornecedor 123", cnpj: "11.222.333/0001-00", email: "contato@123.com.br", phone: "(11) 99999-8888", orders: 12, total: "R$ 200.000,00" },
    { name: "Fornecedor DEF", cnpj: "55.666.777/0001-00", email: "contato@def.com.br", phone: "(11) 97777-6666", orders: 3, total: "R$ 45.000,00" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fornecedores</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus fornecedores e histórico</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Novo Fornecedor
        </Button>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Total Comprado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.cnpj}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.orders}</TableCell>
                  <TableCell className="font-semibold text-secondary">{supplier.total}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Fornecedores;
