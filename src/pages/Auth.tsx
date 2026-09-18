import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, User, ArrowRight, CheckCircle2, TrendingUp, Package, CreditCard } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (session) {
          navigate("/meu-dia", { replace: true });
        } else {
          setCheckingSession(false);
        }
      } catch (error) {
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    };

    verifySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/meu-dia", { replace: true });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const extractErrorMessage = (error: unknown) => {
    if (typeof error === "object" && error !== null && "message" in error) {
      const message = (error as { message?: unknown }).message;
      if (typeof message === "string") {
        return message;
      }
    }
    return "Ocorreu um erro. Tente novamente.";
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Erro ao entrar",
            description: "E-mail ou senha incorretos.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro ao entrar",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Bem-vindo!",
          description: "Login realizado com sucesso.",
        });
        navigate("/meu-dia");
      }
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Erro ao cadastrar",
            description: "Este e-mail já está cadastrado.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro ao cadastrar",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        const user = data.user;
        if (user?.id) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({ 
              user_id: user.id, 
              full_name: fullName,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (profileError) {
            toast({
              title: 'Erro ao salvar perfil',
              description: profileError.message,
              variant: 'destructive',
            });
          }
        }

        toast({
          title: "Conta criada!",
          description: "Você já pode fazer login.",
        });
        setIsLogin(true);
        setPassword("");
      }
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#050505] text-white overflow-hidden font-sans flex p-4 md:p-6 gap-6 selection:bg-[#00FF00] selection:text-black">
      
      {/* Decorative left barcode/lines */}
      <div className="hidden md:flex flex-col gap-1 w-4 h-full border-r-2 border-white/20 pr-4">
        <div className="w-1 h-32 bg-white"></div>
        <div className="w-2 h-16 bg-[#00FF00]"></div>
        <div className="w-0.5 h-64 bg-white/50"></div>
        <div className="w-1.5 h-full bg-white"></div>
      </div>

      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Massive Header Row */}
        <div className="flex justify-between items-end pb-4 border-b-[6px] border-white shrink-0">
          <h1 className="text-6xl md:text-[8rem] font-bold tracking-tighter leading-[0.8] uppercase">
            Sistema
          </h1>
          <h1 className="text-6xl md:text-[8rem] font-bold tracking-tighter leading-[0.8] uppercase text-[#00FF00]">
            RM01
          </h1>
        </div>

        {/* Tiny text info row below header */}
        <div className="flex justify-between items-start pt-2 pb-6 shrink-0">
          <div className="flex gap-12">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00FF00]">01</span>
            <p className="text-[10px] uppercase font-bold text-gray-400 max-w-xs leading-relaxed tracking-widest">
              Plataforma Centralizada pt.1<br/>
              Gestão Operacional, Expedição e Controle.
            </p>
          </div>
          <div className="flex gap-12 text-right">
            <p className="text-[10px] uppercase font-bold text-gray-400 max-w-xs leading-relaxed tracking-widest text-left">
              Acesso Restrito<br/>
              Colaboradores Autorizados.
            </p>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">V 2.0</span>
          </div>
        </div>

        {/* Main Grid Area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
          
          {/* Left Column: Form */}
          <div className="flex flex-col justify-between bg-[#0A0A0A] p-8 md:p-10 border-2 border-white/10 h-full relative group overflow-hidden">
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-8 h-8 border-l-2 border-b-2 border-[#00FF00] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex gap-4 mb-10 border-b-2 border-white/10 pb-4">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`text-xl font-bold tracking-widest uppercase transition-colors ${
                    isLogin ? "text-white" : "text-gray-600 hover:text-white"
                  }`}
                >
                  Autenticar
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`text-xl font-bold tracking-widest uppercase transition-colors ${
                    !isLogin ? "text-white" : "text-gray-600 hover:text-white"
                  }`}
                >
                  Registrar
                </button>
              </div>

              <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-[#00FF00] uppercase tracking-widest">01. Nome</Label>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="NOME COMPLETO"
                      className="bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 h-12 text-2xl font-light text-white placeholder:text-gray-700 focus-visible:ring-0 focus-visible:border-white transition-colors uppercase"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-[#00FF00] uppercase tracking-widest">{isLogin ? "01." : "02."} E-mail</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="CORPORATIVO@RAMA.COM"
                    className="bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 h-12 text-2xl font-light text-white placeholder:text-gray-700 focus-visible:ring-0 focus-visible:border-white transition-colors uppercase"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-[#00FF00] uppercase tracking-widest">{isLogin ? "02." : "03."} Senha</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-transparent border-0 border-b-2 border-white/20 rounded-none px-0 h-12 text-2xl font-light text-white placeholder:text-gray-700 focus-visible:ring-0 focus-visible:border-white transition-colors uppercase"
                    required
                    minLength={6}
                  />
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full h-14 bg-white hover:bg-[#00FF00] text-black font-extrabold text-xl uppercase tracking-[0.2em] rounded-none transition-colors"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>{isLogin ? "Acessar Sistema" : "Solicitar Acesso"}</>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Grid Information */}
          <div className="flex flex-col gap-6 h-full min-h-0">
            {/* Top Block */}
            <div className="flex-1 bg-[#00FF00] p-6 flex flex-col justify-between border-2 border-[#00FF00] text-black hover:bg-[#050505] hover:text-[#00FF00] transition-colors group">
               <div className="flex justify-between items-start">
                 <span className="text-sm font-bold uppercase tracking-widest">Módulo 01</span>
                 <Package className="h-8 w-8" />
               </div>
               <div>
                 <h2 className="text-4xl lg:text-5xl font-extrabold uppercase tracking-tighter leading-none mb-2">Expedição &<br/>Despachos</h2>
                 <p className="text-xs font-bold uppercase tracking-widest opacity-80">Controle de PLPs, Logística e SLAs Diários.</p>
               </div>
            </div>

            {/* Bottom Row */}
            <div className="flex-1 flex gap-6 min-h-0">
              <div className="w-1/2 bg-[#0A0A0A] p-6 flex flex-col justify-between border-2 border-white/20 hover:border-white transition-colors">
                <span className="text-xs font-bold text-[#00FF00] uppercase tracking-widest">Módulo 02</span>
                <div>
                  <h3 className="text-2xl font-bold uppercase tracking-tighter leading-none mb-2">Marketing</h3>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Ads & Campanhas</p>
                </div>
              </div>
              <div className="w-1/2 bg-white text-black p-6 flex flex-col justify-between border-2 border-white hover:bg-transparent hover:text-white transition-colors">
                <span className="text-xs font-bold uppercase tracking-widest opacity-50">Módulo 03</span>
                <div>
                  <h3 className="text-2xl font-bold uppercase tracking-tighter leading-none mb-2">Financeiro</h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-80">DRE & Conciliação</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;
