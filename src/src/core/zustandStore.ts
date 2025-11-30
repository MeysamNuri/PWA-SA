import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChequesDateFilterType } from '@/core/types/dateFilterTypes';
import type { INearDueChequesSubTotalOutput } from '@/features/Cheques/types';


interface ChequeFilterState {
    dataFilter: ChequesDateFilterType;
    setDataFilter: (value: ChequesDateFilterType) => void;
}

type readStatus="all" | "true" | "false"

interface IIsReadStatus{
    isRead:readStatus,
    setIsRead:(value:readStatus)=>void
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

interface InfoDetailsState {
    infoDetail: {
        path:string,
        title:string
    },
    setInfoDetails: (value: {
        path:string,
        title:string
    }) => void
}
export const useInfoModalStore = create<InfoDetailsState>((set) => ({
    infoDetail: {
        path:"",
        title:""
    }, // default value
    setInfoDetails: (value) => set({ infoDetail: value }),
}));

interface IUserSerial {
    userSerial: string | null,
    setUserSerial: (value: string) => void

}
// export const useUserSerialStore = create<IUserSerial>((set) => ({
//     userSerial: null, // default value
//     setUserSerial: (value) => set({ userSerial: value }),
// }));

export const useUserSerialStore = create<IUserSerial>()(
       persist(
        (set) => ({
            userSerial: null,
            setUserSerial: (value) => set({ userSerial: value }),
        }),
        {
            name: 'user-serial-number',
        }
    )
);
export const useIsreadNotice = create<IIsReadStatus>()(
    persist(
        (set) => ({
            isRead:"all", // default value
            setIsRead: (value) => set({ isRead: value }),
        }),
        {
            name: 'isRead-Status',
        }
    )
);