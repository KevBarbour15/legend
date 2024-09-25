import { createTheme, Theme } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";

// Define the customTheme function
const customTheme = (outerTheme: Theme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    typography: {
      fontFamily: '"Bigola Display"',
      fontSize: 16,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            //color: "#dfcfc0",
            color: "#f4f4f4",
            "--TextField-brandBorderColor": "#dfcfc0",
            "--TextField-brandBorderHoverColor": "#dfcfc0",
            "--TextField-brandBorderFocusedColor": "#bc9952",
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
              color: "#dfcfc0",
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
