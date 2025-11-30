import { Box } from '@mui/material';
import Reports from '../Components/Reports';
import DynamicCard from '../Components/DynamicCards';
import Currencies from '../Components/Currencies';
import useHomeHooks from '../Hooks/homeHooks';
import useTopProductsData from '../Hooks/topProductsHooks';
import UnsettledInvoices from '../Components/UnsettledInvoices';
import TopCustomersAndSellers from '../Components/TopCustomersSellers';
import { useHomeCustomizationSettings } from '@/features/HomeCustomization/Hooks/useHomeCustomizationSettings';
import type { HomeCustomizationItem } from '@/features/HomeCustomization/types';
import { motion } from 'framer-motion';
import React from 'react';
import type {
  // ICardsData,
  PageNameItem
} from '../types';
import AjaxLoadingComponent from '@/core/components/ajaxLoadingComponent';

type ComponentEntry = {
  Component: React.ComponentType<any>;
  props: Record<string, any>;
};

type ComponentMap = Record<PageNameItem, ComponentEntry>;

const getComponentMap = (props: ReturnType<typeof useHomeHooks>): ComponentMap => ({
  salesrevenue: {
    Component: DynamicCard,
    props: {
      id: 'salesrevenue',
      cardsData: props.cardsData,
      open: props.open,
      handleClickOpen: props.handleClickOpen,
      handleClose: props.handleClose,
    },
  },
  availablefunds: {
    Component: DynamicCard,
    props: {
      id: 'availablefunds',
      cardsData: props.cardsData,
      open: props.open,
      handleClickOpen: props.handleClickOpen,
    },
  },
  debitcredit: {
    Component: DynamicCard,
    props: {
      id: 'debitcredit',
      cardsData: props.cardsData,
      open: props.open,
      handleClickOpen: props.handleClickOpen,
      handleClose: props.handleClose,
    },
  },
  cheques: {
    Component: DynamicCard,
    props: {
      id: 'cheques',
      cardsData: props.cardsData,
      open: props.open,
      handleClickOpen: props.handleClickOpen,
      handleClose: props.handleClose,
    },
  },
  topNMostsoldproducts: {
    Component: Reports,
    props: { id: 'topNMostsoldproducts' },
  },
  topNMostrevenuableproducts: {
    Component: Reports,
    props: { id: 'topNMostrevenuableproducts' },
  },
  currencyrates: {
    Component: Currencies,
    props: {
      currencyTableData: props.currencyTableData,
      currencyLoading: props.currencyLoading,
      handleCurrencyRatesClick: props.handleCurrencyRatesClick,
    },
  },
  unsettledinvoices: {
    Component: UnsettledInvoices,
    props: {
      data: props.unsettledInvoicesData?.Data,
      isLoading: props.unsettledInvoicesLoading,
      isError: props.unsettledInvoicesError,
      open: props.open,
      handleClickOpen: props.handleClickOpen,
      handleClose: props.handleClose,
    },
  },
  topcustomers: {
    Component: TopCustomersAndSellers,
    props: {
      open: props.open,
      handleClickOpen: props.handleClickOpen,
      handleClose: props.handleClose,
      isTopSeller: false,
    },
  },
  topsellers: {
    Component: TopCustomersAndSellers,
    props: {
      open: props.open,
      handleClickOpen: props.handleClickOpen,
      handleClose: props.handleClose,
      isTopSeller: true,
    },
  },
});


export default function HomeView() {
  const { isComponentEnabled } = useHomeCustomizationSettings();
  
  const hookProps = useHomeHooks();
  const { loading: reportsLoading } = useTopProductsData();
  const {
    parsedSortItems,
    currencyLoading,
    unsettledInvoicesLoading,
    availablefundsLoading,
    nearChequesLoading,
    pageNameDataLoading,
    salesRevenueLoading } = hookProps;


  const loading = [
    currencyLoading,
    unsettledInvoicesLoading,
    reportsLoading,
    availablefundsLoading,
    salesRevenueLoading,
    nearChequesLoading,
    pageNameDataLoading
  ].every(Boolean);

  if (loading) return <AjaxLoadingComponent />
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        m: 0,
        p: '8px',
        position: "relative"
      }}
    >

      <Box sx={{ overflowY: 'auto', pb: '20px' }}>
        {
            parsedSortItems?.map((item: HomeCustomizationItem, index) => {
              const pageName = item.pageName as PageNameItem;
              const map = getComponentMap(hookProps);
              const componentEntry = map[pageName];
              if (!componentEntry || !isComponentEnabled(pageName)) {
                return null;
              }
              const { Component, props } = componentEntry;
              return (
                <motion.div
                  key={item.pageId}
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                >
                  <Component
                    {...props}
                    key={item.pageName}
                  />
                </motion.div>
              );
            }) 
        }
      </Box>
    </Box>
  );
}