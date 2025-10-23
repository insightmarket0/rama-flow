import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Contas = () => {
  const accounts = [
    { date: "2025-10-25", supplier: "Fornecedor ABC", order: "#001", value: "R$ 5.500,00", status: "Pendente" },
    { date: "2025-10-27", supplier: "Fornecedor XYZ", order: "#002", value: "R$ 3.200,00", status: "Pendente" },
    { date: "2025-10-22", supplier: "Fornecedor 123", order: "#003", value: "R$ 8.750,00", status: "Atrasado" },
    { date: "2025-10-20", supplier: "Fornecedor DEF", order: "#004", value: "R$ 2.100,00", status: "Pago" },
    { date: "2025-11-02", supplier: "Fornecedor GHI", order: "#005", value: "R$ 4.300,00", status: "Pendente" },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Pago":
        return "default";
      case "Atrasado":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Contas a Pagar</h1>
        <p className="text-muted-foreground mt-1">Acompanhe e gerencie seus pagamentos</p>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Contas a Pagar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vencimento</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Pedido</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{account.date}</TableCell>
                  <TableCell>{account.supplier}</TableCell>
                  <TableCell>{account.order}</TableCell>
                  <TableCell>{account.value}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(account.status)}>
                      {account.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {account.status !== "Pago" && (
                      <Button variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar como Pago
                      </Button>
                    )}
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

export default Contas;
