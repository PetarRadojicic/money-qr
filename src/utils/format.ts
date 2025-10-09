export const formatCurrency = (value: number, currency: string = "USD"): string => {
  if (!Number.isFinite(value)) {
    return "0";
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    console.warn("Failed to format currency", error);
    return value.toFixed(2);
  }
};


