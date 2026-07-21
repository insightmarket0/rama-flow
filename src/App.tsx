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
const MeuDia = lazy(() => import("./pages/MeuDia"));
const RankingEquipe = lazy(() => import("./pages/RankingEquipe"));
const Equipe = lazy(() => import("./pages/Equipe"));
const PortalExpedicao = lazy(() => import("./pages/PortalExpedicao"));
const Metas = lazy(() => import("./pages/Metas"));
const MuralAlinhamento = lazy(() => import("./pages/MuralAlinhamento"));
const Lembretes = lazy(() => import("./pages/Lembretes"));
const MuralAjustes = lazy(() => import("./pages/MuralAjustes"));
const Playbooks = lazy(() => import("./pages/Playbooks"));
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
const ChatPage = lazy(() => import("./pages/Chat"));
const PainelDivergencias = lazy(() => import("./pages/PainelDivergencias"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
            <Route path="/" element={<Navigate to="/meu-dia" replace />} />
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
              path="/meu-dia"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <MeuDia />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/playbooks"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Playbooks />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/metas"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Metas />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mural-alinhamento"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <MuralAlinhamento />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/lembretes"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Lembretes />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mural-ajustes"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <MuralAjustes />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ranking-equipe"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <RankingEquipe />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipe"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Equipe />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/expedicao"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PortalExpedicao />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/divergencias"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PainelDivergencias />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ChatPage />
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
