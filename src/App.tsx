import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Pedidos from "./pages/Pedidos";
import Condicoes from "./pages/Condicoes";
import Contas from "./pages/Contas";
import Fornecedores from "./pages/Fornecedores";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/pedidos" element={<MainLayout><Pedidos /></MainLayout>} />
          <Route path="/condicoes" element={<MainLayout><Condicoes /></MainLayout>} />
          <Route path="/contas" element={<MainLayout><Contas /></MainLayout>} />
          <Route path="/fornecedores" element={<MainLayout><Fornecedores /></MainLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
