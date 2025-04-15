import React, { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Place, places } from "../data/places";
import { useForm, Controller } from "react-hook-form";

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

  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [companions, setCompanions] = useState<string[]>([]);
  const [newCompanion, setNewCompanion] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleAddPlace = (place: Place | null) => {
    if (place && !selectedPlaces.find((p) => p.id === place.id)) {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  const handleRemovePlace = (placeId: number) => {
    setSelectedPlaces(selectedPlaces.filter((place) => place.id !== placeId));
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
    // Create the trip plan object
    const tripPlan = {
      id: Date.now(),
      name: data.tripName,
      startDate: data.startDate,
      endDate: data.endDate,
      places: selectedPlaces,
      companions,
      budget: data.budget,
      notes: data.notes,
      createdAt: new Date(),
    };

    // In a real application, you would save this to a database or local storage
    console.log("Trip plan saved:", tripPlan);
    localStorage.setItem(`tripPlan_${tripPlan.id}`, JSON.stringify(tripPlan));

    // Reset form and close modal
    resetForm();
    onClose();

    // Show success notification
    setSnackbarOpen(true);
  };

  const resetForm = () => {
    reset();
    setSelectedPlaces([]);
    setCompanions([]);
    setNewCompanion("");
  };

  const isFormValid = (formData: FormData) => {
    return formData.tripName && formData.startDate && selectedPlaces.length > 0;
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

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
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: { xs: 2, sm: 3, md: 4 },
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
            <IconButton onClick={onClose} size="small">
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
            <Grid container spacing={3}>
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
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarTodayIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      error={!!errors.startDate}
                      helperText={errors.startDate?.message}
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
                  sx={{ mb: 1, fontWeight: 600, color: "black" }}
                >
                  Pilih Destinasi
                </Typography>
                <Autocomplete
                  options={places}
                  getOptionLabel={(option) => option.name}
                  onChange={(_event, value) => handleAddPlace(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cari tempat"
                      placeholder="Ketik untuk mencari tempat"
                      variant="outlined"
                    />
                  )}
                />

                <Box sx={{ mt: 2 }}>
                  {selectedPlaces.map((place) => (
                    <Chip
                      key={place.id}
                      label={place.name}
                      onDelete={() => handleRemovePlace(place.id)}
                      sx={{ m: 0.5 }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                  {selectedPlaces.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Belum ada tempat yang dipilih
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: 600, color: "black" }}
                >
                  Dengan Siapa?
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
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
                  >
                    Tambah
                  </Button>
                </Stack>

                <Box>
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

              <Grid item xs={12} sm={6}>
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

            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={() => resetForm()}
                sx={{ mr: 2 }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #FF5252, #3AA99E)",
                  },
                }}
              >
                Simpan Rencana
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Success notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
        >
          Rencana perjalanan berhasil dibuat!
        </Alert>
      </Snackbar>
    </>
  );
}
