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
import { useMemo, useEffect } from "react";
import {
  applyLowEndOptimizations,
  isDataSaverEnabled,
  isLowEndDevice,
} from "./utils/deviceUtils";

const inter = Inter({ subsets: ["latin"] });

// Komponen untuk menerapkan optimasi perangkat low-end
function DeviceOptimizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Terapkan optimasi untuk perangkat low-end
    applyLowEndOptimizations();

    // Terapkan optimasi Data Saver jika diaktifkan
    if (isDataSaverEnabled()) {
      document.body.classList.add("data-saver");
    }

    // Terapkan optimasi tambahan untuk perangkat low-end
    if (isLowEndDevice()) {
      // Kurangi jumlah efek visual
      const optimizeForLowEnd = () => {
        // Nonaktifkan scroll animations
        window.scrollTo = (options) => {
          if (typeof options === "object") {
            window.scrollTo(options.left || 0, options.top || 0);
          } else {
            window.scrollTo(arguments[0] || 0, arguments[1] || 0);
          }
          return undefined;
        };

        // Nonaktifkan intersection observer jika ada banyak elemen
        const allElements = document.querySelectorAll("*");
        if (allElements.length > 500) {
          // Website terlalu berat, nonaktifkan observer yang tidak perlu
          const cleanup = (node: Element) => {
            const clone = node.cloneNode(true);
            if (node.parentNode) {
              node.parentNode.replaceChild(clone, node);
            }
          };

          // Clean up heavy components
          document.querySelectorAll(".heavy-component").forEach(cleanup);
        }
      };

      // Jalankan setelah page load selesai
      if (document.readyState === "complete") {
        optimizeForLowEnd();
      } else {
        window.addEventListener("load", optimizeForLowEnd);
        return () => window.removeEventListener("load", optimizeForLowEnd);
      }
    }
  }, []);

  return <>{children}</>;
}

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
          <TripProvider>
            <DeviceOptimizationProvider>{children}</DeviceOptimizationProvider>
          </TripProvider>
        </FavoritesProvider>
      </AppThemeProvider>
    </CustomThemeProvider>
  );
}
