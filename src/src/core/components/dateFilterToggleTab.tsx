import { useTheme, ToggleButtonGroup, ToggleButton } from "@mui/material";


interface DateFilterToggleTab<T extends string> {
    value: T;
    onChange: (_event: React.MouseEvent<HTMLElement> | null, newDays: string | null) => void;
    options: { label: string; value: T }[];

}


const DateFilterToggleTab = <T extends string>({ value, onChange, options }: DateFilterToggleTab<T>) => {
    const { palette } = useTheme();
    return (
        <ToggleButtonGroup
            value={value}
            exclusive
            onChange={onChange}
            size="medium"
            sx={{
                background: 'white',
                borderRadius: "8px",
                border: "1px solid #E2E6E9",
                height: "20px",
                width: { sm: "250px", xs: "185px",md:"300px" },
                padding: "0px",
                whiteSpace: "nowrap",
                '& .MuiToggleButton-root': {
                    color: palette.mode === 'dark' ? '#E2E6E9' : '#565A62',
                    backgroundColor: palette.mode === 'dark' ? '#0D0D0D' : '#ECEFF1',
                    fontWeight: 500,
                    fontSize: "11px",
                    margin: "0px",
                    minHeight: "20px",
                    lineHeight: 1,
                    padding: 0,
                    transition: 'all 0.2s ease-in-out',
                    borderRadius: "8px",
                    '&.Mui-selected': {
                        backgroundColor: palette.mode === 'dark' ? '#242424' : '#FFFFFF',
                        color: palette.mode === 'dark' ? '#FD5C63' : '#E42628',
                        fontWeight: 600,

                        '&:hover': {
                            backgroundColor: palette.mode === 'dark' ? '#0D0D0D' : '#ffffff',


                        }
                    },
                    '&:hover': {
                        backgroundColor: palette.mode === 'dark' ? '#1A1A1A' : '#F5F5F5',


                    }
                }
            }}
        >
            {
                options?.map((option, index) => (
                    <ToggleButton
                        value={option.value}
                        sx={{
                            width: { sm: "100px", xs: "65px",md:"180px" },
                            direction: "rtl",
                            borderTopLeftRadius: index !== 2 ? "0px !important" : "8px",
                            borderBottomLeftRadius: index !== 2 ? "0px !important" : "8px",
                            borderBottomRightRadius: index !== 0 ? "0px !important" : "8px",
                            borderTopRightRadius: index !== 0 ? "0px !important" : "8px",
                            borderRight: index == options.length ? "none" : '1px solid #ffff',
                            borderLeft: index !== options.length ? "none" : '1px solid #ffff',
                        }}
                    >
                        {option.label}
                    </ToggleButton>


                ))
            }

        </ToggleButtonGroup>
    );
};



export default DateFilterToggleTab;

