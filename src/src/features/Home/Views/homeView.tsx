import { Box } from '@mui/material';
import useHomeHooks from '../Hooks/homeHooks';
import useTopProductsData from '../Hooks/topProductsHooks';
import { useHomeCustomizationSettings } from '@/features/HomeCustomization/Hooks/useHomeCustomizationSettings';
import type { HomeCustomizationItem } from '@/features/HomeCustomization/types';
import { motion } from 'framer-motion';
import type {
  PageNameItem
} from '../types';
import AjaxLoadingComponent from '@/core/components/ajaxLoadingComponent';
import { getComponentMap } from '../Hooks/componentMapHook';


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
              if (!componentEntry || !isComponentEnabled(pageName)) return;
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