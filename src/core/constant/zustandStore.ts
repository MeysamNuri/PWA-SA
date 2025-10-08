import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChequesDateFilterType } from '@/core/types/dateFilterTypes';
import type { INearDueChequesSubTotalOutput } from '@/features/Cheques/types';

interface ChequeFilterState {
    dataFilter: ChequesDateFilterType;
    setDataFilter: (value: ChequesDateFilterType) => void;
}

// export const useChequeFilterStore = create<ChequeFilterState>((set) => ({
//     dataFilter: ChequesDateFilterType.Next30DaysDate, // default value
//     setDataFilter: (value) => set({ dataFilter: value }),
// }));
export const useChequeFilterStore = create<ChequeFilterState>()(
    persist(
        (set) => ({
            dataFilter: ChequesDateFilterType.Next30DaysDate, // default value
            setDataFilter: (value) => set({ dataFilter: value }),
        }),
        {
            name: 'dataFilter-storage',
        }
    )
);

interface ChequesState {
    items: INearDueChequesSubTotalOutput | null; // Replace 'any' with your actual type
    setItems: (items: INearDueChequesSubTotalOutput) => void;
};

export const useChequesStore = create<ChequesState>()(
    persist(
        (set) => ({
            items: null,
            setItems: (value) => set({ items: value }),
        }),
        {
            name: 'cheques-items-storage',
        }
    )
);