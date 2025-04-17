"use client";

import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTheme } from "../context/ThemeContext";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function ErrorMessage({
  message = "Terjadi kesalahan. Silakan coba lagi.",
  onRetry,
  showRetry = true,
}: ErrorMessageProps) {
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // Default retry action - refresh the page
      window.location.reload();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        textAlign: "center",
        bgcolor: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
        border: "1px solid",
        borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      }}
    >
      <ErrorOutlineIcon
        color="error"
        sx={{ fontSize: 48, mb: 2, opacity: 0.8 }}
      />
      <Typography variant="h6" gutterBottom color="error" fontWeight={500}>
        Terjadi Kesalahan
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: "500px", mx: "auto" }}
      >
        {message}
      </Typography>
      {showRetry && (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRetry}
          sx={{
            borderColor: isDarkMode ? "rgba(255,255,255,0.3)" : undefined,
            color: isDarkMode ? "rgba(255,255,255,0.8)" : undefined,
            "&:hover": {
              borderColor: isDarkMode ? "rgba(255,255,255,0.5)" : undefined,
              bgcolor: isDarkMode ? "rgba(255,255,255,0.05)" : undefined,
            },
          }}
        >
          Coba Lagi
        </Button>
      )}
    </Paper>
  );
}
