"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import TripPlansList from "../components/TripPlansList";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import ErrorMessage from "../components/ErrorMessage";
import Link from "next/link";

export default function TripsPage() {
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";
  const [hasError, setHasError] = useState(false);

  const handleStorageError = () => {
    try {
      // Test localStorage access
      localStorage.setItem("storage_test", "test");
      localStorage.removeItem("storage_test");
      setHasError(false);
      return true;
    } catch (error) {
      console.error("localStorage is not available:", error);
      setHasError(true);
      return false;
    }
  };

  // Check localStorage on component mount
  React.useEffect(() => {
    handleStorageError();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: isDarkMode ? "#121212" : "#f5f5f5",
        pb: 10,
      }}
    >
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4, pt: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 2,
              bgcolor: isDarkMode ? "#1e1e1e" : "#fff",
              boxShadow: isDarkMode
                ? "0 4px 20px rgba(0,0,0,0.4)"
                : "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mb: 1,
                fontWeight: 700,
                color: isDarkMode ? "white" : "inherit",
              }}
            >
              Rencana Perjalanan
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Lihat dan kelola semua rencana perjalanan yang telah Anda buat.
            </Typography>

            <Divider sx={{ mb: 4 }} />

            {hasError ? (
              <Box sx={{ my: 4 }}>
                <ErrorMessage
                  message="Tidak dapat mengakses penyimpanan lokal browser. Fitur ini memerlukan akses ke localStorage untuk menyimpan rencana perjalanan Anda."
                  onRetry={handleStorageError}
                />
              </Box>
            ) : (
              <TripPlansList />
            )}

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button
                component={Link}
                href="/"
                variant="outlined"
                color="primary"
                sx={{
                  mt: 2,
                  borderColor: isDarkMode ? "rgba(255,255,255,0.3)" : undefined,
                  color: isDarkMode ? "rgba(255,255,255,0.8)" : undefined,
                  "&:hover": {
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.5)"
                      : undefined,
                    bgcolor: isDarkMode ? "rgba(255,255,255,0.05)" : undefined,
                  },
                }}
              >
                Kembali ke Beranda
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
