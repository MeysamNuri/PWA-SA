import React, { useCallback, useMemo } from "react";
import { Box, useTheme } from "@mui/material";
import {
    InfoRow,
    HeaderCard,
    StyledCardContent,
    BodyStyledCardContent,
    HeaderInfoRow,
    Label,
    Value,
    BodyCard
} from './totalCard.styles';
import { useNavigate } from 'react-router'
import { Grid } from "@mui/system";
import ArrowLeft from "@/core/assets/icones/arrow-left.svg"
import type { IChequesNearDueTotal } from "../types";
import { NumberConverter } from "@/core/helper/numberConverter";

interface IChequeTotalCard {
    data?: IChequesNearDueTotal;
    chequeStatus: string,
    selectedChip?: string | null,
    path?: string
}

const ChequeTotalCard: React.FC<IChequeTotalCard> = ({ data, chequeStatus, path }) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const handleChecksTotal = useCallback(() => {
        if (path) {
            navigate(path,{state:{itemsData:data}});
        }
    }, [navigate, path, data]);

    const isPayable = chequeStatus === "Payable";

    const chequesQuantity = useMemo(() =>
        NumberConverter.latinToArabic(
            (isPayable ? data?.payableChequesQuantity : data?.receivableChequesQuantity)?.toString() ?? ""
        ), [isPayable, data]
    );

    const chequesAmount = useMemo(() => {
        const amount = isPayable
            ? data?.formattedPayableChequesAmount
            : data?.formattedReceivableChequesAmount;
        return NumberConverter.latinToArabic(amount ? amount : "");
    }, [isPayable, data]);

    const chequesAmountUOM = isPayable
        ? data?.payableChequesAmountUOM ?? "-"
        : data?.receivableChequesAmountUOM ?? "-";

    return (
        <Box onClick={handleChecksTotal}>
            <HeaderCard>
                <StyledCardContent>
                    <HeaderInfoRow>
                        <Label style={{ color: theme.palette.text.primary, fontSize: 16 }}>
                            {isPayable ? " همه چک های پرداختی" : " همه چک های دریافتی"}
                        </Label>
                        <Value>
                            <img src={ArrowLeft} alt="arrow left" />
                        </Value>
                    </HeaderInfoRow>
                </StyledCardContent>
            </HeaderCard>
            <BodyCard>
                <BodyStyledCardContent>
                    <Grid size={12}>
                        <InfoRow>
                            <Label>تعداد چک ها</Label>
                            <Value>
                                {chequesQuantity}
                                <span>عدد</span>
                            </Value>
                        </InfoRow>
                    </Grid>
                </BodyStyledCardContent>
                <BodyStyledCardContent>
                    <Grid size={12}>
                        <InfoRow>
                            <Label>جمع مبالغ چک ها</Label>
                            <Value>
                                {chequesAmount}
                                <span>{chequesAmountUOM}</span>
                            </Value>
                        </InfoRow>
                    </Grid>
                </BodyStyledCardContent>
            </BodyCard>
        </Box>
    );
};

export default ChequeTotalCard;