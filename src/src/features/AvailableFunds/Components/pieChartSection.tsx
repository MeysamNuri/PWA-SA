import { Box, Typography, Grid, Stack } from "@mui/material"
import { PieChart } from "@mui/x-charts/PieChart";
import { toPersianNumber } from "@/core/helper/translationUtility";
import { useTheme } from "@mui/material/styles";


interface IPichart {
    handlePieClick: any,
    bankPercentage: number,
    selectedSegment: string,
    fundPercentage: number,
    formatedBankDisplay: string,
    formatedfundDisplay: string,
    fundTotalBalanceUOM: string | undefined,
    bankTotalBalanceUOM: string | undefined,
    currencyTab: string
}

const PieChartSection: React.FC<IPichart> = ({ handlePieClick,
    bankPercentage,
    selectedSegment,
    formatedBankDisplay,
    formatedfundDisplay,
    bankTotalBalanceUOM,
    fundTotalBalanceUOM,
    fundPercentage,
    currencyTab }) => {
    const { palette } = useTheme();
    return (
        <Box sx={{ p: 2, mb: 2, borderRadius: "10px", border: "1px solid #ECEFF1" }}>
            <Grid container alignItems="center" justifyContent="center">
                <Grid>
                    <PieChart
                        onItemClick={handlePieClick}
                        series={[
                            {
                                data: [
                                    { id: 0, value: 75, color: "#92e6a7", label: 'بانک' },
                                    { id: 1, value: 20, color: "#ff5252", label: 'نقد' },
                                ],
                                innerRadius: 20,
                                outerRadius: 40,
                                paddingAngle: 0,
                                cornerRadius: 5,
                                startAngle: -90,
                                endAngle: 270,
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            },
                        ]}
                        width={100}
                        height={100}
                        margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                        sx={{
                            "& .MuiChartsLegend-root": { display: "none" },
                            "& .MuiChartsAxis-bottom": { display: "none" },
                            "& .MuiChartsAxis-left": { display: "none" },
                            cursor: 'pointer',
                        }}
                    >
                        <text
                            x={50}
                            y={50}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="black"
                            style={{ fontSize: "1rem", fontWeight: "bold" }}
                        >
                            %{toPersianNumber(selectedSegment === 'bank' ? bankPercentage?.toFixed(0) : fundPercentage?.toFixed(0))}

                        </text>
                    </PieChart>
                </Grid>
                <Grid size={12} >
                    <Stack spacing={1}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: palette.text.secondary }}>
                            <Box sx={{display:"inline-flex"}}>
                                <Typography variant="caption" sx={{pr:.5}}>
                                    {currencyTab === 'toman' ? bankTotalBalanceUOM : '$'}
                                </Typography>
                                <Typography variant="body2">
                                    {formatedBankDisplay}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Typography variant="body1">بانک</Typography>
                                <Typography variant="body1">%{toPersianNumber(bankPercentage.toFixed(0))}</Typography>
                                <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#92e6a7" }}></Box>
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: palette.text.secondary }}>
                              <Box sx={{display:"inline-flex"}}>
                                <Typography variant="caption" sx={{pr:.5}}>
                                    {currencyTab === 'toman' ? fundTotalBalanceUOM : '$'}
                                </Typography>
                                <Typography variant="body2">
                                 {formatedfundDisplay} 
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Typography variant="body1">نقد</Typography>
                                <Typography variant="body1">%{toPersianNumber(fundPercentage.toFixed(0))}</Typography>
                                <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ff5252" }}></Box>
                            </Box>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    )

}

export default PieChartSection

