"use client";

import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { Inter } from "next/font/google";
import { responsiveFontSizes } from "@mui/material/styles";
import { FavoritesProvider } from "./context/FavoritesContext";
import { TripProvider } from "./context/TripContext";
import {
  ThemeProvider as CustomThemeProvider,
  useTheme,
} from "./context/ThemeContext";
import { useMemo } from "react";

const inter = Inter({ subsets: ["latin"] });

function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useTheme();

  const theme = useMemo(() => {
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
        mode: mode,
        primary: {
          main: "#FF6B6B",
          light: "#FF8E8E",
          dark: "#E54B4B",
        },
        secondary: {
          main: "#4ECDC4",
          light: "#7EDCD6",
          dark: "#3B9B95",
        },
        background: {
          default: mode === "light" ? "#f8f9fa" : "#121212",
          paper: mode === "light" ? "#ffffff" : "#1e1e1e",
        },
        text: {
          primary:
            mode === "light"
              ? "rgba(0, 0, 0, 0.87)"
              : "rgba(255, 255, 255, 0.87)",
          secondary:
            mode === "light"
              ? "rgba(0, 0, 0, 0.6)"
              : "rgba(255, 255, 255, 0.6)",
        },
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              boxShadow:
                mode === "light"
                  ? "0 4px 20px rgba(0,0,0,0.08)"
                  : "0 4px 20px rgba(0,0,0,0.4)",
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
              transition: "all 0.2s ease-in-out",
            },
          },
        },
        MuiModal: {
          styleOverrides: {
            root: {
              backdropFilter: "blur(8px)",
            },
          },
        },
      },
    });

    return responsiveFontSizes(theme);
  }, [mode]);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CustomThemeProvider>
      <AppThemeProvider>
        <FavoritesProvider>
          <TripProvider>{children}</TripProvider>
        </FavoritesProvider>
      </AppThemeProvider>
    </CustomThemeProvider>
  );
}
