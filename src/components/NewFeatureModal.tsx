import { useEffect, useState } from "react";
import { X, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const NewFeatureModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const hasSeenIntro = localStorage.getItem("hasSeenFinancialDashboardIntro");
        if (!hasSeenIntro) {
            // Small delay to ensure smooth entrance animation if desired, 
            // or just show immediately.
            const timer = setTimeout(() => setIsOpen(true), 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("hasSeenFinancialDashboardIntro", "true");
    };

    const handleNavigate = () => {
        handleClose();
        // Redirect to the dashboard financeiro as per plan. 
        // If the user is already there, it just closes the modal which fits the "Introduction" flow.
        navigate("/dashboard-financeiro");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with glassmorphism effect */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className="relative z-50 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]/90 p-0 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">

                {/* Absolute Background Effects for "Premium" feel */}
                <div className="absolute top-0 left-0 h-32 w-full bg-gradient-to-b from-emerald-500/10 to-transparent opacity-50 pointer-events-none" />
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

                {/* Header Section */}
                <div className="relative flex flex-col items-center pt-8 px-6 text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/50">
                        <Rocket className="h-8 w-8 text-emerald-400" />
                    </div>

                    <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
                        Chegou o Novo <span className="text-emerald-400">Dashboard Financeiro</span>
                    </h2>

                    <p className="mb-6 text-base text-gray-300 leading-relaxed max-w-sm">
                        Agora você tem controle total. Acompanhe seus faturamentos do Mercado Livre, Shopee e outros em gráficos detalhados e em tempo real.
                    </p>
                </div>

                {/* Optional Visual Element / Mockup placeholder if desired, 
            but kept simple as per request for "Texto curto e persuasivo" */}

                {/* Footer Actions */}
                <div className="flex flex-col gap-3 bg-white/5 px-6 py-6 border-t border-white/5">
                    <Button
                        onClick={handleNavigate}
                        className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02]"
                    >
                        Conhecer Agora
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={handleClose}
                        className="w-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Dispensar
                    </Button>
                </div>

                {/* Close Icon Top Right */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};
