"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Chip,
  Grid,
  Divider,
  Autocomplete,
  Snackbar,
  Alert,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Place, places } from "../data/places";
import { useForm, Controller } from "react-hook-form";
import { useTrip } from "../context/TripContext";
import { useTheme } from "../context/ThemeContext";

interface TripPlanModalProps {
  open: boolean;
  onClose: () => void;
}

type FormData = {
  tripName: string;
  startDate: string;
  endDate: string;
  budget: string;
  notes: string;
};

export default function TripPlanModal({ open, onClose }: TripPlanModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      tripName: "",
      startDate: "",
      endDate: "",
      budget: "",
      notes: "",
    },
  });

  const {
    placesInTrip,
    tripName,
    setTripName,
    clearCurrentTrip,
    removePlaceFromTrip,
    hasError,
    errorMessage,
    clearError,
  } = useTrip();

  const { mode } = useTheme();
  const isDarkMode = mode === "dark";

  const [companions, setCompanions] = useState<string[]>([]);
  const [newCompanion, setNewCompanion] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRemovePlace = (placeId: number) => {
    removePlaceFromTrip(placeId);
  };

  const handleAddCompanion = () => {
    if (newCompanion && !companions.includes(newCompanion)) {
      setCompanions([...companions, newCompanion]);
      setNewCompanion("");
    }
  };

  const handleRemoveCompanion = (companion: string) => {
    setCompanions(companions.filter((c) => c !== companion));
  };

  const onSubmit = (data: FormData) => {
    if (placesInTrip.length === 0) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Tambahkan minimal satu tempat ke perjalanan");
      setSnackbarOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const tripPlan = {
        id: Date.now(),
        name: data.tripName,
        startDate: data.startDate,
        endDate: data.endDate,
        places: placesInTrip,
        companions,
        budget: data.budget,
        notes: data.notes,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(`tripPlan_${tripPlan.id}`, JSON.stringify(tripPlan));

      // Dispatch event to notify TripPlansList
      const event = new CustomEvent("tripPlanAdded");
      window.dispatchEvent(event);

      resetForm();
      clearCurrentTrip();
      onClose();

      setSnackbarSeverity("success");
      setSnackbarMessage("Rencana perjalanan berhasil disimpan!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error saving trip plan:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Gagal menyimpan rencana perjalanan");
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset();
    setCompanions([]);
    setNewCompanion("");
  };

  const isFormValid = (formData: FormData) => {
    return formData.tripName && formData.startDate && placesInTrip.length > 0;
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Show error from TripContext if present
  useEffect(() => {
    if (hasError) {
      setSnackbarSeverity("error");
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
      clearError();
    }
  }, [hasError, errorMessage, clearError]);

  useEffect(() => {
    if (open) {
      reset({
        tripName: tripName,
        startDate: "",
        endDate: "",
        budget: "",
        notes: "",
      });
    }
  }, [open, reset, tripName]);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="trip-plan-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: "80%", md: "70%" },
            maxWidth: "900px",
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: isDarkMode ? "#1e1e1e" : "background.paper",
            borderRadius: 2,
            boxShadow: isDarkMode
              ? "0 10px 40px rgba(0,0,0,0.5)"
              : "0 10px 40px rgba(0,0,0,0.2)",
            p: { xs: 2, sm: 3, md: 4 },
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: isDarkMode ? "#333" : "#f1f1f1",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: isDarkMode ? "#666" : "#888",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: isDarkMode ? "#888" : "#555",
              },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              id="trip-plan-modal-title"
              variant="h5"
              component="h2"
              sx={{ fontWeight: 700 }}
              color="text.primary"
            >
              Buat Rencana Perjalanan
            </Typography>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: isDarkMode ? "rgba(255,255,255,0.7)" : undefined,
                "&:hover": {
                  bgcolor: isDarkMode ? "rgba(255,255,255,0.1)" : undefined,
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1 }}
          >
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12}>
                <Controller
                  name="tripName"
                  control={control}
                  rules={{ required: "Nama perjalanan harus diisi" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nama Perjalanan"
                      placeholder="Contoh: Liburan Romantis ke BSD"
                      required
                      variant="outlined"
                      error={!!errors.tripName}
                      helperText={errors.tripName?.message}
                      InputLabelProps={{
                        sx: {
                          color: isDarkMode
                            ? "rgba(255,255,255,0.7)"
                            : undefined,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255,255,255,0.2)"
                              : undefined,
                          },
                          "&:hover fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255,255,255,0.3)"
                              : undefined,
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: isDarkMode
                            ? "rgba(255,255,255,0.9)"
                            : undefined,
                        },
                        "& .MuiFormHelperText-root": {
                          color: errors.tripName
                            ? undefined
                            : isDarkMode
                            ? "rgba(255,255,255,0.5)"
                            : undefined,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: "Tanggal mulai harus diisi" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Tanggal Mulai"
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                        sx: {
                          color: isDarkMode
                            ? "rgba(255,255,255,0.7)"
                            : undefined,
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarTodayIcon
                              fontSize="small"
                              sx={{
                                color: isDarkMode
                                  ? "rgba(255,255,255,0.7)"
                                  : undefined,
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      error={!!errors.startDate}
                      helperText={errors.startDate?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255,255,255,0.2)"
                              : undefined,
                          },
                          "&:hover fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255,255,255,0.3)"
                              : undefined,
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: isDarkMode
                            ? "rgba(255,255,255,0.9)"
                            : undefined,
                        },
                        "& .MuiFormHelperText-root": {
                          color: errors.startDate
                            ? undefined
                            : isDarkMode
                            ? "rgba(255,255,255,0.5)"
                            : undefined,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Tanggal Selesai"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarTodayIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: 600 }}
                  color="text.primary"
                >
                  Destinasi Perjalanan
                </Typography>
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
                  {placesInTrip.map((place) => (
                    <Chip
                      key={place.id}
                      label={place.name}
                      sx={{
                        m: 0.5,
                        color: isDarkMode ? "rgba(255,255,255,0.9)" : undefined,
                        borderColor: isDarkMode
                          ? "rgba(255,255,255,0.3)"
                          : undefined,
                      }}
                      color="primary"
                      variant="outlined"
                      onDelete={() => handleRemovePlace(place.id)}
                    />
                  ))}
                  {placesInTrip.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Belum ada tempat yang dipilih. Tambahkan destinasi dari
                      halaman utama.
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: 600 }}
                  color="text.primary"
                >
                  Dengan Siapa?
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1, sm: 1 }}
                  sx={{ mb: 1 }}
                >
                  <TextField
                    value={newCompanion}
                    onChange={(e) => setNewCompanion(e.target.value)}
                    placeholder="Nama teman/pasangan"
                    size="small"
                    fullWidth
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newCompanion) {
                        e.preventDefault();
                        handleAddCompanion();
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddCompanion}
                    disabled={!newCompanion}
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                      mt: { xs: 1, sm: 0 },
                    }}
                  >
                    Tambah
                  </Button>
                </Stack>

                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {companions.map((companion) => (
                    <Chip
                      key={companion}
                      label={companion}
                      onDelete={() => handleRemoveCompanion(companion)}
                      sx={{ m: 0.5 }}
                      icon={<FavoriteIcon fontSize="small" />}
                    />
                  ))}
                  {companions.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Tambahkan orang yang akan pergi bersama Anda
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="budget"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Perkiraan Budget"
                      placeholder="Contoh: 500.000"
                      InputProps={{
                        startAdornment: (
                          <Typography sx={{ mr: 1 }}>Rp</Typography>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Catatan"
                      placeholder="Tambahkan catatan atau hal penting lainnya"
                      multiline
                      rows={3}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: { xs: 3, sm: 4 },
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => resetForm()}
                sx={{
                  width: { xs: "100%", sm: "auto" },
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
                Reset
              </Button>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                  color: "#ffffff",
                  fontWeight: "bold",
                  "&:hover": {
                    background: "linear-gradient(45deg, #FF5252, #3AA99E)",
                    boxShadow: isDarkMode
                      ? "0 4px 20px rgba(78, 205, 196, 0.5)"
                      : "0 4px 20px rgba(78, 205, 196, 0.3)",
                  },
                }}
                disabled={isSubmitting || placesInTrip.length === 0}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  "Simpan Rencana Perjalanan"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Success notification */}
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
    </>
  );
}
