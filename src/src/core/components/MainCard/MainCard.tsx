import {
    Box,
    Grid
} from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router'
import moment from 'moment-jalaali';
import {
    useMemo
} from 'react';
import {
    BodyCard,
    HeaderCard,
    StyledCardContent,
    BodyStyledCardContent,
    HeaderInfoRow,
    Label,
    Value,
} from './MainCard.styles';
import RowGrid from './RowGrid';
import { NumberConverter } from '@/core/helper/numberConverter';
import type { IMainCardPropsBase } from '../../types/mainCardTypes';


// Move iconMap outside the component to avoid recreation on each render
const bankIconMap: { [key: string]: string } = {
    ملت: 'mellat.png',
    ملي: 'meli.png',
    صادرات: 'saderat.png',
    تجارت: 'tejarat.png',
    مسكن: 'maskan.png',
    پاسارگاد: 'pasargad.png',
    پارسيان: 'parsian.png',
    'رفاه كارگران': 'refah.png',
    سپه: 'sepah.png',
    'اقتصاد نوين': 'eghtesadnovin.png',
    شهر: 'shahr.png',
    رسالت: 'resalat.png',
    آينده: 'ayandeh.png',
    سرمايه: 'sarmayeh.png',
    گردشگري: 'gardeshgari.png',
    سامان: 'saman.png',
    سينا: 'sina.png',
    قوامين: 'Ghavamin.png',
    كشاورزي: 'keshavarzi.png',
    مهرايران: 'mehr.png',
    'پست بانک': 'post-bank.png',
    'ايران زمين': 'iranzamin.png',
    'توسعه تعاون': 'tosee-taavon.png',
    'كار آفرين': 'karafarin.png',
};

const getBankIcon = (bankName: string): string => {
    const fileName = bankIconMap[bankName] || 'default.png';
    return `${import.meta.env.BASE_URL}images/bankicon/${fileName}`;
};


const MainCard: React.FC<IMainCardPropsBase> = ({ ...props }) => {
    const { rows,
        isCollapsible,
        path,
        headerTitle,
        headerIcon,
        headerUnit,
        footer,
        bankName,
        headerValue,
        shownRows,
        isExpanded: controlledExpanded,
        onToggle } = props

    const theme = useTheme();
    const navigate = useNavigate();

    // Use controlled state if provided, otherwise use internal state
    const expanded = controlledExpanded;

    // Memoize bankLogo to avoid unnecessary recalculations
    const bankLogo = useMemo(() => getBankIcon(bankName ?? ""), [bankName]);
    // // Extract date string and check if it's a date
    const str = props.headerValue?.toString().split('T')[0] ?? '';
    const isDate = /^\d{4}-\d{2}-\d{2}$/.test(str);

    // // Handle row collapsing logic
    const visibleRows = useMemo(() => {
        if (isCollapsible && !expanded) {
            let shown = 0;
            let sectionCount = 0;
            return rows.filter((row) => {
                // Handle section headers
                if (row.type === 'section') {
                    sectionCount++;
                    // Only show the first section when collapsed
                    return sectionCount === 1;
                }
                // Count regular rows
                if (row.rowSize === 6 || row.rowSize === 12) {
                    shown++;
                    return shown <= (shownRows ?? 2);
                }
                return true;
            });
        }
        return rows;
    }, [isCollapsible, expanded, rows, shownRows]);


    const handleNavigate = () => {
        if (path) {
            navigate(path);
        }
    };

    const handleToggle = () => {
        if (onToggle) {
            onToggle();
        }
    };

    return (
        <Box>
            <HeaderCard
                onClick={handleNavigate}
                sx={
                    isCollapsible && expanded
                        ? {
                            border: '1px solid gray',
                            borderBottom: `2px solid ${theme.palette.divider}`,
                        }
                        : undefined
                }
            >
                <StyledCardContent>
                    <HeaderInfoRow>
                        <Box
                            sx={{
                                display: 'flex',
                                alignContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {bankName && <img width={25} src={bankLogo} alt={bankName} />}
                            <Label style={{ color: theme.palette.primary.dark }}>{headerTitle}</Label>
                        </Box>
                        <Value>
                            {isDate
                                ? moment(headerValue).format('jYYYY/jMM/jDD')
                                : typeof headerValue === 'number'
                                    ? NumberConverter.latinToArabic(
                                        Math.floor(headerValue).toLocaleString('fa-IR')
                                    )
                                    : NumberConverter.latinToArabic(headerValue ?? "")}
                            {headerUnit && (
                                <span
                                    style={{
                                        fontSize: '12px',
                                        color: theme.palette.text.disabled,
                                        marginRight: '5px',
                                    }}
                                >
                                    {headerUnit}
                                </span>
                            )}
                            {headerIcon && <img src={headerIcon} alt="icon" />}
                        </Value>
                    </HeaderInfoRow>
                </StyledCardContent>
            </HeaderCard>
            <BodyCard
                onClick={handleToggle}
                sx={
                    isCollapsible && expanded
                        ? {
                            border: '1px solid gray',
                            borderTop: `2px solid ${theme.palette.divider}`,
                        }
                        : undefined
                }
            >
                <BodyStyledCardContent>
                    <Grid container rowSpacing={1} spacing={1}>
                        {visibleRows.map((row, idx) => (
                            <RowGrid
                                key={idx}
                                rowSize={row.rowSize ?? 12}
                                title={row.title}
                                value={row.value}
                                unit={row.unit}
                                valueColor={row.valueColor}
                                headerColor={row.headerColor}
                                isPositiveChange={row.isPositiveChange}
                                showArrow={row.showArrow}
                                type={row.type}
                            />
                        ))}
                    </Grid>
                </BodyStyledCardContent>
                {footer && isCollapsible && expanded && <Box sx={{ padding: '10px 15px', borderTop: `1px solid ${theme.palette.divider}` }}>{footer}</Box>}

            </BodyCard>
        </Box>
    );
};

export default MainCard;
