"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Divider,
  IconButton,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PlaceIcon from "@mui/icons-material/Place";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import RefreshIcon from "@mui/icons-material/Refresh";
import { format, parse } from "date-fns";
import { Place } from "../data/places";
import ConfirmationDialog from "./ConfirmationDialog";
import { useTheme } from "../context/ThemeContext";
import { TRIP_UPDATED_EVENT_NAME } from "../context/TripContext";

interface TripPlan {
  id: number;
  name: string;
  startDate: string | null;
  endDate: string | null;
  places: Place[];
  companions: string[];
  budget: string;
  notes: string;
  createdAt: string;
}

export default function TripPlansList() {
  const [plans, setPlans] = useState<TripPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    // Set up storage event listener to update when plans change
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith("tripPlan_")) {
        handleRefresh();
      }
    };

    const handleTripUpdated = () => {
      handleRefresh();
    };

    const handleTripPlanAdded = () => {
      handleRefresh();
      setSnackbarSeverity("success");
      setSnackbarMessage("Rencana perjalanan baru telah ditambahkan!");
      setSnackbarOpen(true);
    };

    // Listen for storage changes (from other tabs)
    window.addEventListener("storage", handleStorageChange);

    // Listen for custom events (from this tab)
    window.addEventListener(TRIP_UPDATED_EVENT_NAME, handleTripUpdated);
    window.addEventListener("tripPlanAdded", handleTripPlanAdded);

    // Cleanup function
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(TRIP_UPDATED_EVENT_NAME, handleTripUpdated);
      window.removeEventListener("tripPlanAdded", handleTripPlanAdded);
    };
  }, []);

  useEffect(() => {
    // Load saved plans from localStorage
    const loadPlans = () => {
      try {
        const savedPlans: TripPlan[] = [];

        // Find all keys that start with tripPlan_
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("tripPlan_")) {
            try {
              const planData = JSON.parse(localStorage.getItem(key) || "");
              if (validatePlanData(planData)) {
                savedPlans.push({
                  ...planData,
                  startDate: planData.startDate,
                  endDate: planData.endDate,
                  createdAt: planData.createdAt,
                });
              } else {
                console.warn(`Invalid plan data format for key: ${key}`);
              }
            } catch (error) {
              console.error("Error parsing saved plan:", error);
            }
          }
        }

        // Sort by creation date, newest first
        savedPlans.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        setPlans(savedPlans);
      } catch (error) {
        console.error("Error loading plans:", error);
        setSnackbarSeverity("error");
        setSnackbarMessage("Gagal memuat rencana perjalanan");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure localStorage is updated
    const timer = setTimeout(() => {
      loadPlans();
    }, 100);

    return () => clearTimeout(timer);
  }, [refreshKey]);

  // Validate plan data to avoid errors
  const validatePlanData = (data: any): boolean => {
    return (
      data &&
      typeof data === "object" &&
      typeof data.id === "number" &&
      typeof data.name === "string" &&
      Array.isArray(data.places)
    );
  };

  const handleDeletePlan = (planId: number) => {
    setPlanToDelete(planId);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (planToDelete !== null) {
      try {
        localStorage.removeItem(`tripPlan_${planToDelete}`);
        setPlans(plans.filter((plan) => plan.id !== planToDelete));
        setSnackbarSeverity("success");
        setSnackbarMessage("Rencana perjalanan berhasil dihapus");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error deleting plan:", error);
        setSnackbarSeverity("error");
        setSnackbarMessage("Gagal menghapus rencana perjalanan");
        setSnackbarOpen(true);
      } finally {
        setDialogOpen(false);
        setPlanToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setPlanToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      // Check if the date is in ISO format or YYYY-MM-DD format
      if (dateString.includes("T")) {
        // ISO format
        return format(new Date(dateString), "dd MMM yyyy");
      } else {
        // YYYY-MM-DD format
        return format(
          parse(dateString, "yyyy-MM-dd", new Date()),
          "dd MMM yyyy"
        );
      }
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString; // Return the original string if formatting fails
    }
  };

  // If there are no plans and not loading, show empty state message
  if (!isLoading && plans.length === 0) {
    return (
      <Box>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            component="h3"
            sx={{ fontWeight: 600, color: "primary.main" }}
          >
            Rencana Perjalanan Anda
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            variant="outlined"
            size="small"
            sx={{
              borderColor: isDarkMode ? "rgba(255,255,255,0.3)" : undefined,
              color: isDarkMode ? "rgba(255,255,255,0.8)" : undefined,
              "&:hover": {
                borderColor: isDarkMode ? "rgba(255,255,255,0.5)" : undefined,
                bgcolor: isDarkMode ? "rgba(255,255,255,0.05)" : undefined,
              },
            }}
          >
            Refresh
          </Button>
        </Box>

        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: 2,
            bgcolor: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
          }}
        >
          <PlaceIcon
            sx={{ fontSize: 40, color: "text.secondary", opacity: 0.5, mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Belum ada rencana perjalanan
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: "500px", mx: "auto" }}
          >
            Tambahkan tempat ke favorit Anda, lalu masukkan ke dalam trip untuk
            membuat rencana perjalanan.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      {/* Header and refresh button always visible */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          component="h3"
          sx={{ fontWeight: 600, color: "primary.main" }}
        >
          Rencana Perjalanan Anda
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          variant="outlined"
          size="small"
          sx={{
            borderColor: isDarkMode ? "rgba(255,255,255,0.3)" : undefined,
            color: isDarkMode ? "rgba(255,255,255,0.8)" : undefined,
            "&:hover": {
              borderColor: isDarkMode ? "rgba(255,255,255,0.5)" : undefined,
              bgcolor: isDarkMode ? "rgba(255,255,255,0.05)" : undefined,
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {isLoading ? (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography color="text.secondary">
            Memuat rencana perjalanan...
          </Typography>
        </Box>
      ) : (
        <>
          {plans.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}></Box>
          ) : (
            <Grid container spacing={3}>
              {plans.map((plan) => (
                <Grid item xs={12} md={6} key={plan.id}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.08)",
                      bgcolor: isDarkMode ? "#1e1e1e" : "#ffffff",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: isDarkMode
                          ? "0 6px 20px rgba(0,0,0,0.3)"
                          : "0 6px 20px rgba(0,0,0,0.06)",
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="h4"
                          sx={{ fontWeight: 600, mb: 1 }}
                          color="text.primary"
                        >
                          {plan.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleDeletePlan(plan.id)}
                          sx={{
                            color: isDarkMode
                              ? "rgba(255,255,255,0.5)"
                              : "text.secondary",
                            "&:hover": {
                              bgcolor: isDarkMode
                                ? "rgba(255,255,255,0.05)"
                                : undefined,
                              color: isDarkMode
                                ? "rgba(255,255,255,0.8)"
                                : undefined,
                            },
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 2 }}
                      >
                        <CalendarTodayIcon
                          fontSize="small"
                          sx={{
                            color: isDarkMode
                              ? "rgba(255,255,255,0.6)"
                              : "text.secondary",
                          }}
                        />
                        <Typography
                          variant="body2"
                          color={
                            isDarkMode
                              ? "rgba(255,255,255,0.6)"
                              : "text.secondary"
                          }
                        >
                          {formatDate(plan.startDate)}
                          {plan.endDate ? ` - ${formatDate(plan.endDate)}` : ""}
                        </Typography>
                      </Stack>

                      <Divider
                        sx={{
                          my: 1.5,
                          borderColor: isDarkMode
                            ? "rgba(255,255,255,0.1)"
                            : undefined,
                        }}
                      />

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                          color="text.primary"
                        >
                          <PlaceIcon
                            fontSize="small"
                            sx={{
                              mr: 1,
                              color: isDarkMode
                                ? "rgba(255,255,255,0.6)"
                                : "text.secondary",
                            }}
                          />
                          Destinasi ({plan.places.length})
                        </Typography>

                        <Box sx={{ ml: 4 }}>
                          {plan.places.map((place) => (
                            <Chip
                              key={place.id}
                              label={place.name}
                              size="small"
                              sx={{
                                m: 0.5,
                                ml: 0,
                                mt: 0,
                                color: isDarkMode
                                  ? "rgba(255,255,255,0.9)"
                                  : undefined,
                                borderColor: isDarkMode
                                  ? "rgba(255,255,255,0.2)"
                                  : undefined,
                              }}
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>

                      {plan.companions.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                            color="text.primary"
                          >
                            <PeopleIcon
                              fontSize="small"
                              sx={{
                                mr: 1,
                                color: isDarkMode
                                  ? "rgba(255,255,255,0.6)"
                                  : "text.secondary",
                              }}
                            />
                            Bersama
                          </Typography>
                          <Box sx={{ ml: 4 }}>
                            {plan.companions.map((companion) => (
                              <Chip
                                key={companion}
                                label={companion}
                                size="small"
                                sx={{
                                  m: 0.5,
                                  ml: 0,
                                  mt: 0,
                                  color: isDarkMode
                                    ? "rgba(255,255,255,0.9)"
                                    : undefined,
                                  bgcolor: isDarkMode
                                    ? "rgba(255,255,255,0.06)"
                                    : undefined,
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}

                      {plan.budget && (
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ display: "flex", alignItems: "center" }}
                            color="text.primary"
                          >
                            <AccountBalanceWalletIcon
                              fontSize="small"
                              sx={{
                                mr: 1,
                                color: isDarkMode
                                  ? "rgba(255,255,255,0.6)"
                                  : "text.secondary",
                              }}
                            />
                            Budget:{" "}
                            <Box
                              component="span"
                              sx={{
                                ml: 1,
                                fontWeight: "normal",
                                color: isDarkMode
                                  ? "rgba(255,255,255,0.7)"
                                  : undefined,
                              }}
                            >
                              Rp {plan.budget}
                            </Box>
                          </Typography>
                        </Box>
                      )}

                      {plan.notes && (
                        <Box
                          sx={{
                            mt: 2,
                            bgcolor: isDarkMode
                              ? "rgba(255,255,255,0.03)"
                              : "rgba(0,0,0,0.02)",
                            p: 1.5,
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            color={
                              isDarkMode
                                ? "rgba(255,255,255,0.7)"
                                : "text.secondary"
                            }
                          >
                            {plan.notes}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus rencana perjalanan ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
