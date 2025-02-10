"use client";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: {
      fontSize: {
        xs: "2rem",
        sm: "2.5rem",
        md: "3.5rem",
      },
      fontWeight: 800,
      background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
      textAlign: "center",
      marginBottom: { xs: "0.5rem", sm: "0.75rem", md: "1rem" },
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      textShadow: "2px 4px 8px rgba(0,0,0,0.1)",
    },
    h2: {
      fontWeight: 600,
      fontSize: {
        xs: "1.5rem",
        sm: "1.75rem",
        md: "2rem",
      },
    },
    h5: {
      color: "#666",
      fontWeight: 400,
      fontSize: {
        xs: "1rem",
        sm: "1.1rem",
        md: "1.25rem",
      },
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
          borderRadius: {
            xs: 12,
            sm: 16,
            md: 16,
          },
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          "&:hover": {
            transform: {
              xs: "none",
              md: "translateY(-8px)",
            },
            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
          },
          transition: "all 0.3s ease-in-out",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: {
            xs: "1rem",
            sm: "1.5rem",
            md: "2rem",
          },
          paddingRight: {
            xs: "1rem",
            sm: "1.5rem",
            md: "2rem",
          },
          paddingTop: {
            xs: "1rem",
            sm: "1.5rem",
            md: "2rem",
          },
          paddingBottom: {
            xs: "2rem",
            sm: "3rem",
            md: "4rem",
          },
        },
      },
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
