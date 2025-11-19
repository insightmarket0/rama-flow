import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

const DashboardFinanceiro = lazy(() => import("./pages/DashboardFinanceiro"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Pedidos = lazy(() => import("./pages/Pedidos"));
const Condicoes = lazy(() => import("./pages/Condicoes"));
const Contas = lazy(() => import("./pages/Contas"));
const ContasFixas = lazy(() => import("./pages/ContasFixas"));
const Fornecedores = lazy(() => import("./pages/Fornecedores"));
const Quotations = lazy(() => import("./pages/Quotations"));
const QuotationForm = lazy(() => import("./pages/QuotationForm"));
const QuotationDetail = lazy(() => import("./pages/QuotationDetail"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-background">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span>Carregando interface...</span>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Navigate to="/dashboard-financeiro" replace />} />
            <Route
              path="/dashboard-financeiro"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <DashboardFinanceiro />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pedidos"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Pedidos />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/condicoes"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Condicoes />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contas"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Contas />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contas-fixas"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ContasFixas />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fornecedores"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Fornecedores />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/quotations"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Quotations />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/quotations/new"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <QuotationForm />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/quotations/:id/edit"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <QuotationForm />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/quotations/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <QuotationDetail />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
