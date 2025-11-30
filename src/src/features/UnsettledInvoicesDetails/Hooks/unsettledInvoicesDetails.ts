import { useState } from 'react';
import useUnsettledInvoicesDetails from './APIHooks/useUnsettledInvoicesDetails';
import type { UnsettledInvoicesDataDetails } from '../types';
import { DateFilterType } from '@/core/types/dateFilterTypes';

const useUnsettledInvoicesDetailsHooks = () => {
    const [expandedCard, setExpandedCard] = useState<number | null>(0); // First card expanded by default
    const [selectedDaysType, setSelectedDaysType] = useState<string>(DateFilterType.Last7Days);

    const { data, isPending, isError } = useUnsettledInvoicesDetails(selectedDaysType);

    const invoices: UnsettledInvoicesDataDetails[] = data?.Data || [];

    // Sort invoices by invoice date (newest first)
    const sortedInvoices = [...invoices].sort((a, b) =>
        new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
    );

    const infoOBJ = {
        path: "/unsettled-invoices-details",
        title: "",
        description: "لیست فاکتورهایی که هنوز به طور کامل تسویه نشده‌اند"
    };

    const handleDaysChange = (newDays: string) => {
        setSelectedDaysType(newDays);
    };

    const dateFilterOptions = [
        { label: 'دیروز', value: DateFilterType.Yesterday },
        { label: '۷روز گذشته', value: DateFilterType.Last7Days },
        { label: '۳۰روز گذشته', value: DateFilterType.Last30Days },
    ];

    return {
        setExpandedCard,
        expandedCard,
        sortedInvoices,
        isPending,
        isError,
        invoices,
        infoOBJ,
        selectedDaysType,
        handleDaysChange,
        dateFilterOptions
    };
};

export default useUnsettledInvoicesDetailsHooks;

