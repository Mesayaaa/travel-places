"use client";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Inter } from "next/font/google";
import { responsiveFontSizes } from "@mui/material/styles";

const inter = Inter({ subsets: ["latin"] });

let theme = createTheme({
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: {
      fontSize: "3rem",
      fontWeight: 800,
      background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
      textAlign: "center",
      marginBottom: "1rem",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      textShadow: "2px 4px 8px rgba(0,0,0,0.1)",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    body1: {
      lineHeight: 1.7,
    },
  },
  palette: {
    primary: {
      main: "#4ECDC4",
      light: "#7EDCD6",
      dark: "#3B9B95",
    },
    secondary: {
      main: "#FF6B6B",
      light: "#FF9B9B",
      dark: "#CC5555",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease-in-out",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 24px",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
