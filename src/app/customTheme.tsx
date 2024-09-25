import { createTheme, Theme } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";

// Define the customTheme function
const customTheme = (outerTheme: Theme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    typography: {
      fontFamily: '"Hypatia Sans Pro"',
      fontSize: 16,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            //color: "#dfcfc0",
            color: "#f4f4f4",
            "--TextField-brandBorderColor": "#bc9952",
            "--TextField-brandBorderHoverColor": "#dfcfc0",
            "--TextField-brandBorderFocusedColor": "#bc9952",
            "& label": {
              color: "#f4f4f4",
            },
            "& label.Mui-focused": {
              color: "var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            color: "#f4f4f4",
            "&::before": {
              borderBottom: "1px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "1px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "1px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            "&::placeholder": {
              color: "#bc9952",
              opacity: 1,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          sizeMedium: {
            color: "#f4f4f4",
          },
        },
      },
    },
  });

export default customTheme;
