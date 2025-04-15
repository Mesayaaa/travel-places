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

    window.addEventListener("storage", handleStorageChange);

    // Cleanup function
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Load saved plans from localStorage
    const loadPlans = () => {
      const savedPlans: TripPlan[] = [];

      // Find all keys that start with tripPlan_
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("tripPlan_")) {
          try {
            const planData = JSON.parse(localStorage.getItem(key) || "");
            savedPlans.push({
              ...planData,
              startDate: planData.startDate,
              endDate: planData.endDate,
              createdAt: planData.createdAt,
            });
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
      setIsLoading(false);
    };

    // Small delay to ensure localStorage is updated
    const timer = setTimeout(() => {
      loadPlans();
    }, 100);

    return () => clearTimeout(timer);
  }, [refreshKey]);

  const handleDeletePlan = (planId: number) => {
    setPlanToDelete(planId);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (planToDelete !== null) {
      localStorage.removeItem(`tripPlan_${planToDelete}`);
      setPlans(plans.filter((plan) => plan.id !== planToDelete));
      setDialogOpen(false);
      setPlanToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setPlanToDelete(null);
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
          <Typography>Memuat rencana perjalanan...</Typography>
        </Box>
      ) : (
        <>
          {plans.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">
                Belum ada rencana perjalanan. Buat rencana baru untuk memulai.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {plans.map((plan) => (
                <Grid item xs={12} md={6} key={plan.id}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      border: "1px solid rgba(0,0,0,0.08)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
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
                        >
                          {plan.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleDeletePlan(plan.id)}
                          sx={{ color: "text.secondary" }}
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
                          sx={{ color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(plan.startDate)}
                          {plan.endDate ? ` - ${formatDate(plan.endDate)}` : ""}
                        </Typography>
                      </Stack>

                      <Divider sx={{ my: 1.5 }} />

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <PlaceIcon
                            fontSize="small"
                            sx={{ mr: 1, color: "text.secondary" }}
                          />
                          Destinasi ({plan.places.length})
                        </Typography>

                        <Box sx={{ ml: 4 }}>
                          {plan.places.map((place) => (
                            <Chip
                              key={place.id}
                              label={place.name}
                              size="small"
                              sx={{ m: 0.5, ml: 0, mt: 0 }}
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
                          >
                            <PeopleIcon
                              fontSize="small"
                              sx={{ mr: 1, color: "text.secondary" }}
                            />
                            Bersama
                          </Typography>
                          <Box sx={{ ml: 4 }}>
                            {plan.companions.map((companion) => (
                              <Chip
                                key={companion}
                                label={companion}
                                size="small"
                                sx={{ m: 0.5, ml: 0, mt: 0 }}
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
                          >
                            <AccountBalanceWalletIcon
                              fontSize="small"
                              sx={{ mr: 1, color: "text.secondary" }}
                            />
                            Budget:{" "}
                            <Box
                              component="span"
                              sx={{ ml: 1, fontWeight: "normal" }}
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
                            bgcolor: "rgba(0,0,0,0.02)",
                            p: 1.5,
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
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
    </Box>
  );
}
