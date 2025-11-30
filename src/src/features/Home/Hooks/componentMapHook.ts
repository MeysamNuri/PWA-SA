import UnsettledInvoices from '../Components/UnsettledInvoices';
import TopCustomersAndSellers from '../Components/TopCustomersSellers';
import Reports from '../Components/Reports';
import DynamicCard from '../Components/DynamicCards';
import Currencies from '../Components/Currencies';
import useHomeHooks from '../Hooks/homeHooks';

import type { ComponentMap } from '../types';
export const getComponentMap = (props: ReturnType<typeof useHomeHooks>): ComponentMap => ({
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
