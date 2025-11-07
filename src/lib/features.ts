export const FEATURE_TAX_DESCRIPTION =
  typeof import.meta.env.VITE_ENABLE_TAX_DESCRIPTION === "string"
    ? import.meta.env.VITE_ENABLE_TAX_DESCRIPTION === "true"
    : false;
