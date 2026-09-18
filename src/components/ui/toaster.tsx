import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { Sparkles, CheckCircle2 } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const isDestructive = variant === "destructive";
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-center justify-center gap-3 w-full backdrop-blur-sm bg-black/10 py-2 px-6 rounded-full border border-white/5 shadow-2xl">
              <div className={`shrink-0 flex items-center justify-center ${isDestructive ? 'text-red-400' : 'text-[#00FF00]'}`}>
                {isDestructive ? <Sparkles className="w-4 h-4 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" /> : <CheckCircle2 className="w-4 h-4 drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]" />}
              </div>
              <div className="flex items-center gap-2">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription className="text-gray-400 ml-1 font-normal">{description}</ToastDescription>}
              </div>
            </div>
            {action}
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
