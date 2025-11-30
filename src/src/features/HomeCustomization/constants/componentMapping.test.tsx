import { describe, it, expect } from "vitest";
import {
  COMPONENT_MAPPING,
  CARD_TYPE_MAPPING,

} from "./componentMapping"; // ← update path
import type { ComponentType, CardType } from "./componentMapping"; // ← update path
describe("COMPONENT_MAPPING", () => {
  it("should have correct component values", () => {
    expect(COMPONENT_MAPPING.salesrevenue).toBe("dynamicCards");
    expect(COMPONENT_MAPPING.availablefunds).toBe("dynamicCards");
    expect(COMPONENT_MAPPING.debitcredit).toBe("dynamicCards");
    expect(COMPONENT_MAPPING.cheques).toBe("dynamicCards");

    expect(COMPONENT_MAPPING.unsettledinvoices).toBe("unsettledInvoices");

    expect(COMPONENT_MAPPING.topNMostsoldproducts).toBe("reports");
    expect(COMPONENT_MAPPING.topNMostrevenuableproducts).toBe("reports");

    expect(COMPONENT_MAPPING.topcustomers).toBe("topCustomers");
    expect(COMPONENT_MAPPING.topsellers).toBe("topSellers");

    expect(COMPONENT_MAPPING.currencyrates).toBe("currencies");
  });

  it("should have no unexpected keys", () => {
    const expectedKeys = [
      "salesrevenue",
      "availablefunds",
      "debitcredit",
      "cheques",
      "unsettledinvoices",
      "topNMostsoldproducts",
      "topNMostrevenuableproducts",
      "topcustomers",
      "topsellers",
      "currencyrates",
    ];

    expect(Object.keys(COMPONENT_MAPPING)).toEqual(expectedKeys);
  });

  it("ComponentType should accept only mapped values", () => {
    const allowed: ComponentType[] = [
      "dynamicCards",
      "unsettledInvoices",
      "reports",
      "topCustomers",
      "topSellers",
      "currencies",
    ];

    expect(allowed.includes(COMPONENT_MAPPING.salesrevenue)).toBe(true);
  });
});

describe("CARD_TYPE_MAPPING", () => {
  it("should map each card type to correct card titles", () => {
    expect(CARD_TYPE_MAPPING.salesrevenue).toEqual([
      "فروش امروز",
      "فروش دیروز",
    ]);

    expect(CARD_TYPE_MAPPING.availablefunds).toEqual([
      "مانده صندوق",
      "مانده بانک",
    ]);

    expect(CARD_TYPE_MAPPING.debitcredit).toEqual([
      "بستانکاران",
      "بدهکاران",
    ]);

    expect(CARD_TYPE_MAPPING.cheques).toEqual([
      "چک‌های پرداختی",
      "چک‌های دریافتی",
    ]);
  });

  it("CardType should include only valid card type keys", () => {
    const expectedCardTypes: CardType[] = [
      "salesrevenue",
      "availablefunds",
      "debitcredit",
      "cheques",
    ];

    expect(Object.keys(CARD_TYPE_MAPPING)).toEqual(expectedCardTypes);
  });
});
