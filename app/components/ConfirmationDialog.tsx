"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useTheme } from "../context/ThemeContext";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: "300px",
          maxWidth: "400px",
          bgcolor: isDarkMode ? "#1e1e1e" : "#ffffff",
          boxShadow: isDarkMode
            ? "0 10px 30px rgba(0,0,0,0.5)"
            : "0 10px 30px rgba(0,0,0,0.2)",
        },
      }}
    >
      <DialogTitle sx={{ pt: 3, pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningAmberIcon color="warning" />
          <Typography
            variant="h6"
            component="span"
            fontWeight={600}
            color="text.primary"
          >
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="inherit"
          sx={{
            borderRadius: 1,
            color: isDarkMode ? "#e0e0e0" : "inherit",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.3)"
              : "rgba(0,0,0,0.23)",
            "&:hover": {
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.5)"
                : "rgba(0,0,0,0.5)",
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.05)"
                : undefined,
            },
          }}
        >
          Batal
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{
            borderRadius: 1,
            boxShadow: isDarkMode ? "0 2px 8px rgba(211, 47, 47, 0.5)" : "none",
            "&:hover": {
              boxShadow: isDarkMode
                ? "0 4px 12px rgba(211, 47, 47, 0.7)"
                : "0 2px 8px rgba(211, 47, 47, 0.3)",
            },
          }}
        >
          Hapus
        </Button>
      </DialogActions>
    </Dialog>
  );
}
