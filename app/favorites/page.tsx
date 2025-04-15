"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Chip,
  useTheme,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  IconButton as MuiIconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Skeleton,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useFavorites } from "../context/FavoritesContext";
import { useRouter } from "next/navigation";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { Place } from "../data/places";

export default function FavoritesPage() {
  const theme = useMuiTheme();
  const router = useRouter();
  const { favorites, removeFromFavorites } = useFavorites();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const isDarkMode = theme.palette.mode === "dark";

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRemoveFavorite = (place: Place) => {
    setSelectedPlace(place);
    setOpenDialog(true);
  };

  const handleConfirmRemove = () => {
    if (selectedPlace) {
      removeFromFavorites(selectedPlace.id);
      setOpenDialog(false);
      setSelectedPlace(null);
    }
  };

  const handleViewDetails = (place: Place) => {
    router.push(`/trip/${place.id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const filteredFavorites = favorites.filter((place) =>
    place.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: isDarkMode
            ? "rgba(18, 18, 18, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: isDarkMode
            ? "0 2px 10px rgba(0, 0, 0, 0.5)"
            : "0 2px 10px rgba(0, 0, 0, 0.1)",
          borderBottom: `1px solid ${
            isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)"
          }`,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <MuiIconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            sx={{
              mr: 2,
              color: isDarkMode ? "white" : "text.primary",
              backgroundColor: isDarkMode
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
              "&:hover": {
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(0, 0, 0, 0.1)",
              },
              borderRadius: 2,
              p: 1,
              transition: "all 0.2s ease",
            }}
          >
            <ArrowBackIcon />
          </MuiIconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                color: isDarkMode ? "white" : "text.primary",
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              Favorit Saya
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Chip
              icon={<FavoriteIcon sx={{ fontSize: 16 }} />}
              label={`${favorites.length} Favorit`}
              color="primary"
              sx={{
                backgroundColor: isDarkMode
                  ? "rgba(25, 118, 210, 0.3)"
                  : "primary.light",
                color: isDarkMode ? "white" : "primary.dark",
                fontWeight: "bold",
                boxShadow: isDarkMode
                  ? "0 2px 8px rgba(25, 118, 210, 0.3)"
                  : "0 2px 8px rgba(25, 118, 210, 0.2)",
                "& .MuiChip-icon": {
                  color: isDarkMode ? "white" : "primary.main",
                },
                display: { xs: "none", sm: "flex" },
              }}
            />
            <Chip
              icon={<FavoriteIcon sx={{ fontSize: 16 }} />}
              label={favorites.length}
              color="primary"
              sx={{
                backgroundColor: isDarkMode
                  ? "rgba(25, 118, 210, 0.3)"
                  : "primary.light",
                color: isDarkMode ? "white" : "primary.dark",
                fontWeight: "bold",
                boxShadow: isDarkMode
                  ? "0 2px 8px rgba(25, 118, 210, 0.3)"
                  : "0 2px 8px rgba(25, 118, 210, 0.2)",
                "& .MuiChip-icon": {
                  color: isDarkMode ? "white" : "primary.main",
                },
                display: { xs: "flex", sm: "none" },
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ pt: 8 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "white",
                  mb: 3,
                }}
              >
                Temukan semua perjalanan yang telah Anda tandai sebagai favorit
              </Typography>

              <TextField
                fullWidth
                variant="outlined"
                placeholder="Cari favorit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  mb: 4,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.08)"
                      : "white",
                    boxShadow: isDarkMode
                      ? "0 2px 8px rgba(0, 0, 0, 0.2)"
                      : "0 2px 8px rgba(0, 0, 0, 0.05)",
                    "&:hover": {
                      backgroundColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.12)"
                        : "white",
                    },
                    "&.Mui-focused": {
                      backgroundColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.12)"
                        : "white",
                      boxShadow: isDarkMode
                        ? "0 0 0 2px rgba(25, 118, 210, 0.5)"
                        : "0 0 0 2px rgba(25, 118, 210, 0.2)",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {favorites.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "50vh",
                  textAlign: "center",
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <FavoriteIcon
                    sx={{
                      fontSize: 80,
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(0, 0, 0, 0.1)",
                      mb: 2,
                    }}
                  />
                </motion.div>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    color: isDarkMode ? "white" : "text.primary",
                  }}
                >
                  Belum Ada Favorit
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode
                      ? "rgba(255, 255, 255, 0.7)"
                      : "text.secondary",
                    maxWidth: "400px",
                  }}
                >
                  Anda belum memiliki perjalanan favorit. Mulai jelajahi dan
                  tambahkan perjalanan ke favorit Anda!
                </Typography>
              </Box>
            ) : (
              <AnimatePresence>
                <Grid container spacing={3}>
                  {filteredFavorites.map((place) => (
                    <Grid item xs={12} sm={6} md={4} key={place.id}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5 }}
                      >
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 2,
                            overflow: "hidden",
                            boxShadow: isDarkMode
                              ? "0 4px 20px rgba(0, 0, 0, 0.4)"
                              : "0 4px 20px rgba(0, 0, 0, 0.1)",
                            transition:
                              "transform 0.3s ease, box-shadow 0.3s ease",
                            backgroundColor: isDarkMode
                              ? "rgba(255, 255, 255, 0.05)"
                              : "white",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              boxShadow: isDarkMode
                                ? "0 8px 30px rgba(0, 0, 0, 0.5)"
                                : "0 8px 30px rgba(0, 0, 0, 0.2)",
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="200"
                            image={place.image}
                            alt={place.name}
                            sx={{
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                          />
                          <CardContent
                            sx={{
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                              gap: 1.5,
                              backgroundColor: isDarkMode
                                ? "rgba(255, 255, 255, 0.05)"
                                : "white",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                              }}
                            >
                              <Typography
                                variant="h6"
                                component="h2"
                                sx={{
                                  fontWeight: "bold",
                                  color: isDarkMode ? "white" : "text.primary",
                                }}
                              >
                                {place.name}
                              </Typography>
                              <IconButton
                                onClick={() => handleRemoveFavorite(place)}
                                sx={{
                                  color: "error.main",
                                  backgroundColor: isDarkMode
                                    ? "rgba(211, 47, 47, 0.1)"
                                    : "rgba(211, 47, 47, 0.05)",
                                  "&:hover": {
                                    backgroundColor: isDarkMode
                                      ? "rgba(211, 47, 47, 0.2)"
                                      : "rgba(211, 47, 47, 0.1)",
                                  },
                                }}
                              >
                                <FavoriteIcon />
                              </IconButton>
                            </Box>

                            {place.address && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <LocationOnIcon
                                  sx={{
                                    fontSize: 16,
                                    color: isDarkMode
                                      ? "rgba(255, 255, 255, 0.7)"
                                      : "text.secondary",
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: isDarkMode
                                      ? "rgba(255, 255, 255, 0.7)"
                                      : "text.secondary",
                                  }}
                                >
                                  {place.address}
                                </Typography>
                              </Box>
                            )}

                            {place.openingHours && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <AccessTimeIcon
                                  sx={{
                                    fontSize: 16,
                                    color: isDarkMode
                                      ? "rgba(255, 255, 255, 0.7)"
                                      : "text.secondary",
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: isDarkMode
                                      ? "rgba(255, 255, 255, 0.7)"
                                      : "text.secondary",
                                  }}
                                >
                                  {place.openingHours}
                                </Typography>
                              </Box>
                            )}

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mt: "auto",
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: "bold",
                                  color: "primary.main",
                                }}
                              >
                                {place.priceRange}
                              </Typography>
                              <Chip
                                label={`${place.rating} ⭐`}
                                size="small"
                                sx={{
                                  backgroundColor: isDarkMode
                                    ? "rgba(255, 255, 255, 0.1)"
                                    : "rgba(25, 118, 210, 0.1)",
                                  color: isDarkMode ? "white" : "primary.main",
                                }}
                              />
                            </Box>

                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => handleViewDetails(place)}
                              sx={{
                                mt: 2,
                                textTransform: "none",
                                fontWeight: "bold",
                                borderRadius: 1,
                                py: 1,
                                backgroundColor: isDarkMode
                                  ? "primary.main"
                                  : "primary.main",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: isDarkMode
                                    ? "primary.dark"
                                    : "primary.dark",
                                  boxShadow: isDarkMode
                                    ? "0 4px 12px rgba(25, 118, 210, 0.4)"
                                    : "0 4px 12px rgba(25, 118, 210, 0.3)",
                                },
                              }}
                            >
                              Lihat Detail
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </AnimatePresence>
            )}
          </motion.div>
        </Container>
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: isDarkMode ? "rgba(18, 18, 18, 0.95)" : "white",
            backdropFilter: "blur(10px)",
            boxShadow: isDarkMode
              ? "0 4px 20px rgba(0, 0, 0, 0.5)"
              : "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Hapus dari Favorit?
        </DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin menghapus {selectedPlace?.name} dari daftar
            favorit?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Batal</Button>
          <Button
            onClick={handleConfirmRemove}
            color="error"
            variant="contained"
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
