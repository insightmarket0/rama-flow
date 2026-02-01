import { BrandIcons } from "@/components/finance/BrandIcons";
import { LucideProps } from "lucide-react";

export interface MarketplaceConfig {
    id: "mercadolivre" | "shopee" | "amazon" | "magalu";
    label: string;
    color: string;
    logo?: string;
    icon: (props: LucideProps) => JSX.Element;
}

export const MARKETPLACES: MarketplaceConfig[] = [
    {
        id: "mercadolivre",
        label: "Mercado Livre",
        color: "#FFE600",
        icon: BrandIcons.MercadoLivre,
    },
    {
        id: "shopee",
        label: "Shopee",
        color: "#FF5722",
        icon: BrandIcons.Shopee,
    },
    {
        id: "amazon",
        label: "Amazon",
        color: "#F2F2F2",
        icon: BrandIcons.Amazon,
    },
    {
        id: "magalu",
        label: "Magalu",
        color: "#0086FF",
        icon: BrandIcons.Magalu,
    },
];
