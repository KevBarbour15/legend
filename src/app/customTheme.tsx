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
            color: "#dfcfc0",
            "--TextField-brandBorderColor": "#dfcfc0",
            "--TextField-brandBorderHoverColor": "#234055",
            "--TextField-brandBorderFocusedColor": "#f4f4f4",
            "& label": {
              color: "#dfcfc0",
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
            color: "#dfcfc0",
            "&::before": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            "&::placeholder": {
              color: "#f4f4f4",
              opacity: 1,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          sizeMedium: {
            color: "#dfcfc0",
          },
        },
      },
    },
  });

export default customTheme;
