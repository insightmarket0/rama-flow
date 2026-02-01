export interface MarketplaceConfig {
    id: "mercadolivre" | "shopee" | "amazon" | "magalu";
    label: string;
    color: string;
    logo?: string;
}

export const MARKETPLACES: MarketplaceConfig[] = [
    {
        id: "mercadolivre",
        label: "Mercado Livre",
        color: "#FFE600",
    },
    {
        id: "shopee",
        label: "Shopee",
        color: "#FF5722",
    },
    {
        id: "amazon",
        label: "Amazon",
        color: "#F2F2F2",
    },
    {
        id: "magalu",
        label: "Magalu",
        color: "#0086FF",
    },
];
