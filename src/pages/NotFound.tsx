import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent">
        <span className="text-2xl font-bold">404</span>
      </div>

      <div className="mt-6 max-w-md space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Página não encontrada
          </h1>
          <p className="text-muted-foreground">
            A rota <span className="font-medium">{location.pathname}</span> não existe ou foi movida. Verifique o endereço ou volte para o painel.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ir para o Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              Página inicial
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
