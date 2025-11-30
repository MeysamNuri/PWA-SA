import type { ExchangeRateItem } from "../types";
import useCurrencyRates from "./APIHooks/useCurrencyRates";

type APIData = ExchangeRateItem[] | { exchangeRateItem?: ExchangeRateItem[] } | undefined;

export default function useCurrencyTableData() {
    const { data, isPending } = useCurrencyRates();
    const rawItems: APIData = data?.Data;

    // Safely extract ExchangeRateItem array
    const rates: ExchangeRateItem[] = Array.isArray(rawItems)
        ? rawItems
        :  [];

    const filtered = rates.filter((r) =>
        ["UsdDollar", "SekeEmaami", "GoldGram18"].includes(r.name)
    );

    const tableData = filtered.map((item) => ({
        name: item.name,
        title: item.title,
        price: formatPrice(item.price),
        time: formatTime(item.sourceCreated),
        rateOfChange: Number(item.rateOfChange) || 0,
    }));

    return {
        currencyTableData: tableData,
        currencyLoading: isPending,
    };
}

/* --------------------------
   Helpers
--------------------------- */

function formatPrice(value: number | string | undefined): string {
  const num = Number(value);
  if (Number.isNaN(num)) return "-";
  return Math.round(num / 10).toLocaleString("en-US"); // <-- change to en-US
}


function formatTime(date: Date | string | undefined): string {
  if (!date) return "-";

  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "-";

  const h = d.getUTCHours().toString().padStart(2, "0");
  const m = d.getUTCMinutes().toString().padStart(2, "0");

  return `${h}:${m}`;
}
