import { createTheme, PaletteMode } from "@mui/material/styles";

export const getAppTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#10b981",
        light: "#f59e0b",
        contrastText: mode === "dark" ? "#ffffff" : "#000000",
      },
      secondary: {
        main: "#3b82f6",
        contrastText: "#ffffff",
      },
      background: {
        default: mode === "dark" ? "#000000" : "#f8fafc",
        paper: mode === "dark" ? "#0a0a0a" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#f8fafc" : "#1e293b",
        secondary: mode === "dark" ? "#94a3b8" : "#475569",
      },
      divider: mode === "dark" ? "#262626" : "#e2e8f0",
      success: {
        main: "#10b981",
      },
      error: {
        main: "#ef4444",
      },
      warning: {
        main: "#f59e0b",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 9999,
            padding: "8px 24px",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: "inherit",
          },
        },
      },
    },
  });

