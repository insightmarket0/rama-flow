import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Pedidos from "./pages/Pedidos";
import Condicoes from "./pages/Condicoes";
import Contas from "./pages/Contas";
import Fornecedores from "./pages/Fornecedores";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/pedidos" element={<ProtectedRoute><MainLayout><Pedidos /></MainLayout></ProtectedRoute>} />
          <Route path="/condicoes" element={<ProtectedRoute><MainLayout><Condicoes /></MainLayout></ProtectedRoute>} />
          <Route path="/contas" element={<ProtectedRoute><MainLayout><Contas /></MainLayout></ProtectedRoute>} />
          <Route path="/fornecedores" element={<ProtectedRoute><MainLayout><Fornecedores /></MainLayout></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
