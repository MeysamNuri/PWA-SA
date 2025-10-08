import { Box } from '@mui/material';
import Reports from '../Components/Reports';
import DynamicCard from '../Components/DynamicCards';
import Currencies from '../Components/Currencies';
import useHomeHooks from '../Hooks/homeHooks';

export default function HomeView() {
    const {
        currencyTableData,
        currencyLoading,
        handleCurrencyRatesClick,
        cardsData } = useHomeHooks();
    return (
        <Box sx={{
            backgroundColor: "#ECEFF1",
            margin: 0,
            padding: "8px",
            minHeight: "100vh"
        }}>
            <Box sx={{
                overflowY: 'auto',
                paddingBottom: '20px',
            }}>
               <DynamicCard cardsData={cardsData} />
                <Reports />
                <Currencies
                    currencyTableData={currencyTableData}
                    currencyLoading={currencyLoading}
                    handleCurrencyRatesClick={handleCurrencyRatesClick} /> 
            </Box>
        </Box>
    );
}
