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
        color: "#ffe600",
    },
    {
        id: "shopee",
        label: "Shopee",
        color: "#ee4d2d",
    },
    {
        id: "amazon",
        label: "Amazon",
        color: "#232f3e",
    },
    {
        id: "magalu",
        label: "Magalu",
        color: "#0086ff",
    },
];
