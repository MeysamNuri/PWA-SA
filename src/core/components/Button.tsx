import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface IButton {
    isFormValid?: boolean,
    isPending?: boolean,
    title: string
}
const ButtonComponent: React.FC<IButton> = ({ isFormValid, isPending, title }) => {
    const { palette } = useTheme();

    return (
        <Button
            fullWidth
            type="submit"
            className="submit-button"
            disabled={!isFormValid}
            loading={isPending}
            sx={{
                mt: 1,
              
                borderRadius: "12px",
                backgroundColor: !isFormValid
                    ? palette.button?.light
                    : palette.button?.main,
                color: !isFormValid
                    ? palette.text?.disabled
                    : palette.primary?.contrastText,
            }}
        >
            {title}
        </Button>
    )


}

export default ButtonComponent;
