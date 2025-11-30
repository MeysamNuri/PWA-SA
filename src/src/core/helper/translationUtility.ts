import translations from "@/core/constant/errorMessaeg.json";
import type { TranslationDictionary } from "../types/translationInterface";

export const getTranslation = (key: string): string => {
    const dictionary: TranslationDictionary = translations;
    return dictionary[key] || `Translation not found for key: ${key}`;
};

export function toPersianNumber(input: string | number): string {
    return String(input).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)]);
}
