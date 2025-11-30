import { Button, Box, useTheme } from "@mui/material";

interface ToggleTabProps<T extends string> {
    value: T;
    onChange: (value: T) => void;
    options: { label: string; value: T }[];
    variant?: 'date' | 'tab';
}
interface CustomToggleTabProps<T extends string> {
    value: T;
    onChange: (value: T) => void;
    options: { label: string; value: T }[];
    variant?: 'filter' | 'date';
}


const CustomToggleTab = <T extends string>({ value, onChange, options, variant = 'filter' }: CustomToggleTabProps<T>) => {
    const { palette } = useTheme();
    const isDateFilter = variant === 'date';

    return (
        <Box sx={{
            display: "flex",
            gap: 1,
            mt: 2,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            justifyContent: isDateFilter ? "flex-start" : "center",
            width: '100%',
            height: isDateFilter ? "32px" : "auto",
            borderRadius: "12px",
            textAlign: "center"
        }}>
            {options.map((option) => (
                <Button
                    key={option.value}
                    data-testid={`tab-${option.value}`}
                    variant={value === option.value ? "contained" : "outlined"}
                    onClick={() => onChange(option.value)}
                    sx={{
                        color: value === option.value ? palette.button?.main : palette.text?.secondary,
                        background: value === option.value ? (isDateFilter ? palette.success?.light : palette.background?.paper) : "transparent",
                        fontSize: { xs: 12, sm: 14 },
                        fontWeight: 400,
                        border: `1px solid ${palette.background.paper}`,
                        borderRadius: 2,
                        height: isDateFilter ? 32 : "38px",
                        width: isDateFilter ? { xs: '90px', sm: '105px' } : { xs: '160px', sm: '250px' },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingRight: '16px',
                        paddingLeft: '8px',
                        '&:hover': {
                            background: value === option.value
                                ? (isDateFilter ? palette.success?.light : palette.background?.paper)
                                : palette.action.hover,
                        }
                    }}
                >
                    {option.label}
                </Button>
            ))}
        </Box>
    );
};

const ToggleTab = <T extends string>({ value, onChange, options, variant = 'tab' }: ToggleTabProps<T>) => {
    const { palette } = useTheme();
    const isDateFilter = variant === 'date';

    return (
        <Box
            sx={{
                display: "flex",
                mt: 2,
                flexWrap: 'nowrap',
                justifyContent: "flex-end",
                width: '100%',
                marginBottom: '10px',
                ...(isDateFilter ? {} : {
                    border: `1px solid ${palette.background.paper}`,
                    borderRadius: '12px',
                    width: '100%',
                    justifyContent: 'stretch'
                })
            }}
        >
            {options.map((option, index) => (
                <Button
                    key={option.value}
                    data-testid={`tab-${option.value}`}
                    variant="outlined"
                    sx={{
                        color: value === option.value ? palette.button.main : palette.text.secondary,
                        background: value === option.value ? (isDateFilter ? palette.error.light : palette.background.paper) : palette.background.default,
                        fontSize: { xs: 14, sm: 16 },
                        fontWeight: 400,
                        border: "none",
                        borderRadius: isDateFilter ? 2 : (
                            index === 0
                                ? '12px 0 0 12px'
                                : index === options.length - 1
                                    ? '0 12px 12px 0'
                                    : '0'
                        ),
                        height: 32,
                        width: "50%",
                        minWidth: 'unset',
                        direction: 'rtl',
                        borderLeft: !isDateFilter && index !== 0 ? `1px solid ${palette.background.paper}` : 'none',
                        '&:hover': {
                            background: value === option.value
                                ? (isDateFilter ? palette.error.light : palette.background.paper)
                                : palette.action.hover,
                            boxShadow: 'none',
                        },
                    }}
                    onClick={() => onChange(option.value)}
                >
                    <span>{option.label}</span>
                </Button>
            ))}
        </Box>
    );
};

export default ToggleTab;
export { CustomToggleTab };
