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

const Condicoes = () => {
  const conditions = [
    { name: "À Vista", installments: 1, interval: 0, downPayment: 100 },
    { name: "30/60", installments: 2, interval: 30, downPayment: 0 },
    { name: "30/60/90", installments: 3, interval: 30, downPayment: 0 },
    { name: "30/60/90/120", installments: 4, interval: 30, downPayment: 0 },
    { name: "Entrada + 2x", installments: 2, interval: 30, downPayment: 50 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Condições de Pagamento</h1>
          <p className="text-muted-foreground mt-1">Configure as formas de pagamento</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Nova Condição
        </Button>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Condições Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Nº de Parcelas</TableHead>
                <TableHead>Intervalo (dias)</TableHead>
                <TableHead>Entrada (%)</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conditions.map((condition, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{condition.name}</TableCell>
                  <TableCell>{condition.installments}</TableCell>
                  <TableCell>{condition.interval}</TableCell>
                  <TableCell>{condition.downPayment}%</TableCell>
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

export default Condicoes;
