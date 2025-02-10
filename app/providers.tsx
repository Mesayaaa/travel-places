"use client";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Inter } from "next/font/google";
import { responsiveFontSizes } from "@mui/material/styles";

const inter = Inter({ subsets: ["latin"] });

let theme = createTheme({
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: {
      fontSize: "2rem",
      fontWeight: 800,
      background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
      textAlign: "center",
      marginBottom: "0.5rem",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      textShadow: "2px 4px 8px rgba(0,0,0,0.1)",
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: {
      color: "#666",
      fontWeight: 400,
      fontSize: "1rem",
    },
  },
  palette: {
    primary: {
      main: "#4ECDC4",
    },
    secondary: {
      main: "#FF6B6B",
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
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          "&:hover": {
            transform: "none",
            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
          },
          transition: "all 0.3s ease-in-out",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: "1rem",
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
