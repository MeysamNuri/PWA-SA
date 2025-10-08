import { NumberConverter } from "@/core/helper/numberConverter";
import {
    Grid,
    Typography,
    useTheme,
} from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
    InfoRow,
    Label,
    Value
} from './MainCard.styles';
import moment from "moment-jalaali";
import type { IRowData } from '../../models/mainCardTypes'

const RowGrid: React.FC<IRowData> = ({ rowSize, title, unit,
    value,
    valueColor,
    headerColor,
    type,
    showArrow,
    isPositiveChange
}) => {
    const theme = useTheme();
    const str = value?.toString().split("T")[0];
    const isDate = /^\d{4}-\d{2}-\d{2}$/.test(str);
    const isSection = type === 'section';

    if (isSection) {
        return (
            <Grid size={rowSize}>
                <InfoRow sx={{ border: 'none' }}>
                    <Label style={{
                        color: valueColor || theme.palette.error.main,
                        fontWeight: 'bold',
                        fontSize: '14px',
                        paddingBottom: '4px',
                        marginBottom: '8px'
                    }}>
                        {title}
                    </Label>
                </InfoRow>
            </Grid>
        );
    }

    return (
        <Grid size={rowSize}>
            <InfoRow>
                <Label style={{ color: headerColor ?? "" }}>{title}
                    {showArrow ? isPositiveChange ? <ArrowUpwardIcon sx={{ fontSize: '12px' }} /> : <ArrowDownwardIcon sx={{ fontSize: '12px' }} /> : ""}

                </Label>
                <Value>
                    <Typography component="span" style={{ color: valueColor ?? "" }}>
                        {
                            isDate ?
                                NumberConverter.latinToArabic(moment(value).format('jYYYY/jMM/jDD').toString())
                                :
                                NumberConverter.latinToArabic(value?.toLocaleString('fa-IR'))

                        }

                    </Typography>
                    <span style={{
                        fontSize: '12px',
                        color: theme.palette.text.disabled,
                        marginRight: '5px',
                    }}>
                        {unit}
                    </span>
                </Value>
            </InfoRow>
        </Grid>
    )
}

export default RowGrid;
