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
  AppBar,
  Toolbar,
  IconButton as MuiIconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Divider,
  Badge,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Slider,
  Drawer,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Popover,
  ListItemIcon as MuiListItemIcon,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DoneIcon from "@mui/icons-material/Done";
import StarIcon from "@mui/icons-material/Star";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import { useFavorites } from "../context/FavoritesContext";
import { useRouter } from "next/navigation";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { Place } from "../data/places";

// Define filter and sort types
type SortOption =
  | "name-asc"
  | "name-desc"
  | "rating-high"
  | "rating-low"
  | "price-high"
  | "price-low";
type PriceRange = "all" | "budget" | "moderate" | "luxury";
type PriceCategory = Exclude<PriceRange, "all">;
type RatingFilter = number | null;

interface FilterOptions {
  rating: RatingFilter;
  priceRange: PriceRange;
}

export default function FavoritesPage() {
  const theme = useMuiTheme();
  const router = useRouter();
  const { favorites, removeFromFavorites } = useFavorites();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const isDarkMode = theme.palette.mode === "dark";
  const [removingId, setRemovingId] = useState<string | number | null>(null);

  // Filter and sort states
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    rating: null,
    priceRange: "all",
  });
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleRemoveFavorite = (place: Place) => {
    setSelectedPlace(place);
    setOpenDialog(true);
  };

  const handleConfirmRemove = () => {
    if (selectedPlace) {
      setRemovingId(selectedPlace.id);
      setTimeout(() => {
        removeFromFavorites(selectedPlace.id);
        setOpenDialog(false);
        setSelectedPlace(null);
        setRemovingId(null);
      }, 300);
    }
  };

  const handleViewDetails = (place: Place) => {
    router.push(`/trip/${place.id}`);
  };

  const handleBack = () => {
    router.back();
  };

  // Handle filter and sort menu
  const openFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const closeFilterMenu = () => {
    setFilterAnchorEl(null);
  };

  const openSortMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const closeSortMenu = () => {
    setSortAnchorEl(null);
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    closeSortMenu();
  };

  const handleFilterChange = (newFilter: Partial<FilterOptions>) => {
    const updatedFilters = { ...filterOptions, ...newFilter };
    setFilterOptions(updatedFilters);

    // Check if any filter is applied
    const isAnyFilterApplied =
      updatedFilters.rating !== null || updatedFilters.priceRange !== "all";

    setIsFilterApplied(isAnyFilterApplied);
  };

  const resetFilters = () => {
    setFilterOptions({
      rating: null,
      priceRange: "all",
    });
    setIsFilterApplied(false);
    closeFilterMenu();
  };

  const applyFilters = () => {
    closeFilterMenu();
  };

  // Get price category
  const getPriceCategory = (priceRange: string): PriceCategory => {
    if (priceRange.includes("Rp") && priceRange.split(" - ").length > 1) {
      const prices = priceRange
        .replace(/Rp\s?/g, "")
        .split(" - ")
        .map((price) => parseInt(price.replace(/\./g, ""), 10));

      const avgPrice = (prices[0] + prices[1]) / 2;

      if (avgPrice < 50000) return "budget";
      if (avgPrice < 150000) return "moderate";
      return "luxury";
    }

    // Default category based on symbols
    const symbols = priceRange
      .split("")
      .filter((char) => char === "Rp" || char === "$").length;
    if (symbols <= 1) return "budget";
    if (symbols === 2) return "moderate";
    return "luxury";
  };

  // Filter places
  const filteredFavorites = favorites
    .filter((place) =>
      place.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((place) => {
      // Apply rating filter
      if (
        filterOptions.rating !== null &&
        place.rating < filterOptions.rating
      ) {
        return false;
      }

      // Apply price range filter
      if (filterOptions.priceRange !== "all") {
        const category = getPriceCategory(place.priceRange);
        if (category !== filterOptions.priceRange) {
          return false;
        }
      }

      return true;
    });

  // Sort places
  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "rating-high":
        return b.rating - a.rating;
      case "rating-low":
        return a.rating - b.rating;
      case "price-high": {
        const categoryA = getPriceCategory(a.priceRange);
        const categoryB = getPriceCategory(b.priceRange);
        const order: Record<PriceCategory, number> = {
          luxury: 3,
          moderate: 2,
          budget: 1,
        };
        return order[categoryB] - order[categoryA];
      }
      case "price-low": {
        const categoryA = getPriceCategory(a.priceRange);
        const categoryB = getPriceCategory(b.priceRange);
        const order: Record<PriceCategory, number> = {
          luxury: 3,
          moderate: 2,
          budget: 1,
        };
        return order[categoryA] - order[categoryB];
      }
      default:
        return 0;
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          gap: 2,
          backgroundColor: isDarkMode
            ? "rgba(18, 18, 18, 0.98)"
            : "rgba(250, 250, 250, 0.98)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress size={50} thickness={4} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography
            variant="h6"
            sx={{
              color: isDarkMode ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
              fontWeight: 500,
            }}
          >
            Memuat favorit Anda...
          </Typography>
        </motion.div>
      </Box>
    );
  }

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: isDarkMode
            ? "rgba(18, 18, 18, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${
            isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"
          }`,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 70 }, px: { xs: 2, sm: 3 } }}>
          <MuiIconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            sx={{
              mr: 2,
              color: isDarkMode ? "white" : "text.primary",
              backgroundColor: isDarkMode
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.03)",
              "&:hover": {
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.12)"
                  : "rgba(0, 0, 0, 0.08)",
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
                fontWeight: 700,
                color: isDarkMode ? "white" : "text.primary",
                fontSize: { xs: "1.1rem", sm: "1.3rem" },
                letterSpacing: "-0.01em",
              }}
            >
              Favorit Saya
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: isDarkMode ? "rgba(255,255,255,0.6)" : "text.secondary",
                display: { xs: "none", sm: "block" },
              }}
            >
              Koleksi tempat-tempat yang Anda suka
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Badge
              badgeContent={favorites.length}
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: isDarkMode
                    ? "rgba(25, 118, 210, 0.15)"
                    : "rgba(25, 118, 210, 0.1)",
                  width: 40,
                  height: 40,
                }}
              >
                <FavoriteIcon
                  sx={{
                    color: isDarkMode
                      ? theme.palette.primary.light
                      : theme.palette.primary.main,
                    fontSize: 22,
                  }}
                />
              </Avatar>
            </Badge>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{
          pt: 10,
          pb: 8,
          minHeight: "100vh",
          background: isDarkMode
            ? "linear-gradient(to bottom, rgba(18, 18, 18, 0.98), rgba(25, 25, 25, 0.95))"
            : "linear-gradient(to bottom, rgba(250, 250, 250, 0.98), rgba(245, 245, 245, 0.95))",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Box
              sx={{
                mb: 4,
                mt: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Cari tempat favorit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.04)"
                        : "white",
                      boxShadow: isDarkMode
                        ? "0 2px 15px rgba(0, 0, 0, 0.15)"
                        : "0 2px 15px rgba(0, 0, 0, 0.04)",
                      "&:hover": {
                        backgroundColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.08)"
                          : "white",
                      },
                      "&.Mui-focused": {
                        backgroundColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.08)"
                          : "white",
                        boxShadow: isDarkMode
                          ? "0 0 0 2px rgba(25, 118, 210, 0.5)"
                          : "0 0 0 2px rgba(25, 118, 210, 0.2)",
                      },
                      "& fieldset": {
                        borderColor: isDarkMode
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.1)",
                      },
                      padding: "4px 14px",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="Filter">
                            <IconButton
                              size="small"
                              onClick={openFilterMenu}
                              sx={{
                                color: isFilterApplied
                                  ? "primary.main"
                                  : isDarkMode
                                  ? "rgba(255,255,255,0.6)"
                                  : "text.secondary",
                                backgroundColor: isFilterApplied
                                  ? isDarkMode
                                    ? "rgba(25,118,210,0.15)"
                                    : "rgba(25,118,210,0.08)"
                                  : isDarkMode
                                  ? "rgba(255,255,255,0.05)"
                                  : "rgba(0,0,0,0.03)",
                                "&:hover": {
                                  backgroundColor: isFilterApplied
                                    ? isDarkMode
                                      ? "rgba(25,118,210,0.25)"
                                      : "rgba(25,118,210,0.15)"
                                    : isDarkMode
                                    ? "rgba(255,255,255,0.1)"
                                    : "rgba(0,0,0,0.08)",
                                },
                                position: "relative",
                              }}
                            >
                              <FilterListIcon fontSize="small" />
                              {isFilterApplied && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: -2,
                                    right: -2,
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    backgroundColor: "primary.main",
                                  }}
                                />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Sort">
                            <IconButton
                              size="small"
                              onClick={openSortMenu}
                              sx={{
                                color:
                                  sortOption !== "name-asc"
                                    ? "primary.main"
                                    : isDarkMode
                                    ? "rgba(255,255,255,0.6)"
                                    : "text.secondary",
                                backgroundColor:
                                  sortOption !== "name-asc"
                                    ? isDarkMode
                                      ? "rgba(25,118,210,0.15)"
                                      : "rgba(25,118,210,0.08)"
                                    : isDarkMode
                                    ? "rgba(255,255,255,0.05)"
                                    : "rgba(0,0,0,0.03)",
                                "&:hover": {
                                  backgroundColor:
                                    sortOption !== "name-asc"
                                      ? isDarkMode
                                        ? "rgba(25,118,210,0.25)"
                                        : "rgba(25,118,210,0.15)"
                                      : isDarkMode
                                      ? "rgba(255,255,255,0.1)"
                                      : "rgba(0,0,0,0.08)",
                                },
                              }}
                            >
                              <SortIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {searchQuery && (
                            <Tooltip title="Clear">
                              <IconButton
                                size="small"
                                onClick={() => setSearchQuery("")}
                                sx={{
                                  color: "primary.main",
                                  backgroundColor: isDarkMode
                                    ? "rgba(25,118,210,0.1)"
                                    : "rgba(25,118,210,0.05)",
                                  "&:hover": {
                                    backgroundColor: isDarkMode
                                      ? "rgba(25,118,210,0.2)"
                                      : "rgba(25,118,210,0.1)",
                                  },
                                }}
                              >
                                <motion.div
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  ✕
                                </motion.div>
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode
                      ? "rgba(255,255,255,0.6)"
                      : "text.secondary",
                    fontWeight: 500,
                  }}
                >
                  {sortedFavorites.length === 0
                    ? "Tidak ada hasil"
                    : `${sortedFavorites.length} tempat ditemukan`}
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                  {isFilterApplied && (
                    <Chip
                      label={`Filter: ${
                        filterOptions.rating ? `${filterOptions.rating}+★` : ""
                      } ${
                        filterOptions.priceRange !== "all"
                          ? filterOptions.priceRange === "budget"
                            ? "Murah"
                            : filterOptions.priceRange === "moderate"
                            ? "Sedang"
                            : "Mewah"
                          : ""
                      }`}
                      size="small"
                      onDelete={resetFilters}
                      sx={{
                        backgroundColor: isDarkMode
                          ? "rgba(25,118,210,0.15)"
                          : "rgba(25,118,210,0.08)",
                        color: isDarkMode
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                        "& .MuiChip-deleteIcon": {
                          color: isDarkMode
                            ? theme.palette.primary.light
                            : theme.palette.primary.main,
                        },
                      }}
                    />
                  )}

                  {sortOption !== "name-asc" && (
                    <Chip
                      label={`Sort: ${
                        sortOption === "name-desc"
                          ? "Z-A"
                          : sortOption === "rating-high"
                          ? "Rating ↑"
                          : sortOption === "rating-low"
                          ? "Rating ↓"
                          : sortOption === "price-high"
                          ? "Harga ↑"
                          : sortOption === "price-low"
                          ? "Harga ↓"
                          : ""
                      }`}
                      size="small"
                      onDelete={() => handleSortChange("name-asc")}
                      sx={{
                        backgroundColor: isDarkMode
                          ? "rgba(25,118,210,0.15)"
                          : "rgba(25,118,210,0.08)",
                        color: isDarkMode
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                        "& .MuiChip-deleteIcon": {
                          color: isDarkMode
                            ? theme.palette.primary.light
                            : theme.palette.primary.main,
                        },
                      }}
                    />
                  )}

                  {filteredFavorites.length > 0 && searchQuery && (
                    <Chip
                      label={`Mencari: "${searchQuery}"`}
                      size="small"
                      onDelete={() => setSearchQuery("")}
                      sx={{
                        backgroundColor: isDarkMode
                          ? "rgba(25,118,210,0.15)"
                          : "rgba(25,118,210,0.08)",
                        color: isDarkMode
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                        "& .MuiChip-deleteIcon": {
                          color: isDarkMode
                            ? theme.palette.primary.light
                            : theme.palette.primary.main,
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            {favorites.length === 0 ? (
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "50vh",
                  textAlign: "center",
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.03)"
                    : "white",
                  borderRadius: 4,
                  p: 5,
                  boxShadow: isDarkMode
                    ? "0 4px 20px rgba(0,0,0,0.2)"
                    : "0 4px 20px rgba(0,0,0,0.05)",
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{
                    rotate: [0, -10, 10, -5, 5, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  <FavoriteIcon
                    sx={{
                      fontSize: 100,
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.06)",
                      mb: 3,
                    }}
                  />
                </motion.div>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                    color: isDarkMode ? "white" : "text.primary",
                    letterSpacing: "-0.02em",
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
                    mb: 4,
                  }}
                >
                  Anda belum memiliki perjalanan favorit. Mulai jelajahi dan
                  tambahkan perjalanan ke favorit Anda!
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => router.push("/")}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: isDarkMode
                      ? "0 4px 12px rgba(25,118,210,0.4)"
                      : "0 4px 12px rgba(25,118,210,0.2)",
                    "&:hover": {
                      boxShadow: isDarkMode
                        ? "0 6px 16px rgba(25,118,210,0.6)"
                        : "0 6px 16px rgba(25,118,210,0.3)",
                    },
                  }}
                >
                  Jelajahi Sekarang
                </Button>
              </Box>
            ) : sortedFavorites.length === 0 ? (
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "40vh",
                  textAlign: "center",
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.03)"
                    : "white",
                  borderRadius: 4,
                  p: 4,
                  boxShadow: isDarkMode
                    ? "0 4px 20px rgba(0,0,0,0.2)"
                    : "0 4px 20px rgba(0,0,0,0.05)",
                }}
              >
                <SearchIcon
                  sx={{
                    fontSize: 70,
                    color: isDarkMode
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.06)",
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: isDarkMode ? "white" : "text.primary",
                  }}
                >
                  Tidak ditemukan
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode
                      ? "rgba(255, 255, 255, 0.6)"
                      : "text.secondary",
                    maxWidth: "400px",
                    mb: 3,
                  }}
                >
                  Tidak ada favorit dengan kata kunci "{searchQuery}"
                </Typography>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => setSearchQuery("")}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 3,
                  }}
                >
                  Reset Pencarian
                </Button>
              </Box>
            ) : (
              <AnimatePresence>
                <Grid
                  container
                  spacing={3}
                  component={motion.div}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {sortedFavorites.map((place) => (
                    <Grid item xs={12} sm={6} md={4} key={place.id}>
                      <motion.div
                        layout
                        variants={itemVariants}
                        exit={{
                          opacity: 0,
                          y: 20,
                          scale: 0.9,
                          transition: { duration: 0.2 },
                        }}
                        whileHover={{ y: -8 }}
                        animate={
                          removingId === place.id
                            ? {
                                opacity: 0,
                                x: -100,
                                scale: 0.8,
                                transition: { duration: 0.3 },
                              }
                            : undefined
                        }
                      >
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 3,
                            overflow: "hidden",
                            boxShadow: isDarkMode
                              ? "0 8px 25px rgba(0, 0, 0, 0.3)"
                              : "0 8px 25px rgba(0, 0, 0, 0.06)",
                            transition:
                              "transform 0.3s ease, box-shadow 0.3s ease",
                            backgroundColor: isDarkMode
                              ? "rgba(255, 255, 255, 0.03)"
                              : "white",
                            "&:hover": {
                              transform: "translateY(-8px)",
                              boxShadow: isDarkMode
                                ? "0 12px 35px rgba(0, 0, 0, 0.4)"
                                : "0 12px 35px rgba(0, 0, 0, 0.1)",
                            },
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              zIndex: 10,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 2,
                              padding: "3px 8px",
                              backgroundColor: isDarkMode
                                ? "rgba(0, 0, 0, 0.6)"
                                : "rgba(255, 255, 255, 0.85)",
                              backdropFilter: "blur(4px)",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                            }}
                          >
                            <StarIcon
                              sx={{
                                color: "warning.main",
                                fontSize: 16,
                                mr: 0.5,
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 700,
                                color: isDarkMode ? "white" : "text.primary",
                                lineHeight: 1,
                              }}
                            >
                              {place.rating}
                            </Typography>
                          </Box>

                          <Box sx={{ position: "relative" }}>
                            <CardMedia
                              component="img"
                              height="180"
                              image={place.image}
                              alt={place.name}
                              sx={{
                                objectFit: "cover",
                                transition: "transform 0.6s ease",
                                "&:hover": {
                                  transform: "scale(1.05)",
                                },
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                background:
                                  "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.7))",
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "100%",
                                p: 2,
                              }}
                            >
                              <Typography
                                variant="h6"
                                component="h2"
                                sx={{
                                  fontWeight: "bold",
                                  color: "white",
                                  textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                                  fontSize: "1.1rem",
                                }}
                              >
                                {place.name}
                              </Typography>
                            </Box>
                          </Box>

                          <CardContent
                            sx={{
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                              gap: 1.5,
                              p: 2.5,
                              backgroundColor: isDarkMode
                                ? "rgba(255, 255, 255, 0.03)"
                                : "white",
                            }}
                          >
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
                                    fontSize: 18,
                                    color: theme.palette.primary.main,
                                    opacity: 0.8,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: isDarkMode
                                      ? "rgba(255, 255, 255, 0.7)"
                                      : "text.secondary",
                                    fontSize: "0.875rem",
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
                                    fontSize: 18,
                                    color: isDarkMode
                                      ? "rgba(255, 255, 255, 0.5)"
                                      : "rgba(0, 0, 0, 0.5)",
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: isDarkMode
                                      ? "rgba(255, 255, 255, 0.7)"
                                      : "text.secondary",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {place.openingHours}
                                </Typography>
                              </Box>
                            )}

                            <Divider sx={{ my: 1, opacity: 0.5 }} />

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 700,
                                  color: theme.palette.primary.main,
                                  fontSize: "1.1rem",
                                }}
                              >
                                {place.priceRange}
                              </Typography>
                              <Tooltip title="Hapus dari favorit">
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
                                      transform: "scale(1.1)",
                                    },
                                    transition: "transform 0.2s ease",
                                  }}
                                >
                                  <FavoriteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>

                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => handleViewDetails(place)}
                              sx={{
                                mt: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
                                py: 1.2,
                                backgroundColor: theme.palette.primary.main,
                                color: "white",
                                boxShadow: isDarkMode
                                  ? "0 4px 12px rgba(25, 118, 210, 0.3)"
                                  : "0 4px 12px rgba(25, 118, 210, 0.2)",
                                "&:hover": {
                                  backgroundColor: theme.palette.primary.dark,
                                  boxShadow: isDarkMode
                                    ? "0 6px 16px rgba(25, 118, 210, 0.5)"
                                    : "0 6px 16px rgba(25, 118, 210, 0.3)",
                                  transform: "translateY(-2px)",
                                },
                                transition: "transform 0.2s ease",
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
          component: motion.div,
          initial: { opacity: 0, y: 20, scale: 0.9 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 20, scale: 0.9 },
          transition: { duration: 0.3 },
          sx: {
            borderRadius: 3,
            backgroundColor: isDarkMode ? "rgba(30, 30, 30, 0.95)" : "white",
            backdropFilter: "blur(20px)",
            boxShadow: isDarkMode
              ? "0 8px 32px rgba(0, 0, 0, 0.5)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1.3rem",
            pb: 1,
          }}
        >
          Hapus dari Favorit?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Apakah Anda yakin ingin menghapus <b>{selectedPlace?.name}</b> dari
            daftar favorit?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 600,
              px: 3,
            }}
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirmRemove}
            color="error"
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 600,
              px: 3,
              boxShadow: "0 4px 12px rgba(211, 47, 47, 0.2)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(211, 47, 47, 0.3)",
              },
            }}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Menu */}
      <Popover
        id="filter-menu"
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={closeFilterMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.5,
            overflow: "visible",
            boxShadow: isDarkMode
              ? "0 8px 32px rgba(0, 0, 0, 0.5)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
            borderRadius: 2,
            minWidth: 220,
            maxWidth: 320,
            border: isDarkMode
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(0, 0, 0, 0.08)",
            backgroundColor: isDarkMode ? "rgba(30, 30, 30, 0.95)" : "white",
            backdropFilter: "blur(10px)",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: isDarkMode ? "rgba(30, 30, 30, 0.95)" : "white",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
              borderTop: isDarkMode
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "1px solid rgba(0, 0, 0, 0.08)",
              borderLeft: isDarkMode
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "1px solid rgba(0, 0, 0, 0.08)",
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Filter Tempat
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* Rating Filter */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ mb: 1, display: "flex", alignItems: "center" }}
            >
              <StarIcon sx={{ fontSize: 18, mr: 0.5, color: "warning.main" }} />
              Rating Minimum
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
                px: 1,
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <Box
                  key={rating}
                  onClick={() =>
                    handleFilterChange({ rating: rating === 0 ? null : rating })
                  }
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    position: "relative",
                    opacity:
                      filterOptions.rating === rating ||
                      (rating === 0 && filterOptions.rating === null)
                        ? 1
                        : 0.6,
                    transform:
                      filterOptions.rating === rating ||
                      (rating === 0 && filterOptions.rating === null)
                        ? "scale(1.05)"
                        : "scale(1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      opacity: 0.9,
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {rating === 0 ? (
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", mb: 0.5 }}
                    >
                      Semua
                    </Typography>
                  ) : (
                    <StarIcon
                      sx={{
                        color:
                          filterOptions.rating === rating
                            ? "warning.main"
                            : "text.secondary",
                        fontSize: 18,
                        mb: 0.5,
                      }}
                    />
                  )}
                  <Typography variant="caption" fontWeight={500}>
                    {rating === 0 ? "-" : rating + "+"}
                  </Typography>

                  {(filterOptions.rating === rating ||
                    (rating === 0 && filterOptions.rating === null)) && (
                    <Box
                      sx={{
                        height: 2,
                        width: "70%",
                        bgcolor: "primary.main",
                        position: "absolute",
                        bottom: -4,
                        borderRadius: 1,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Price Range Filter */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ mb: 1, display: "flex", alignItems: "center" }}
            >
              <MonetizationOnIcon
                sx={{ fontSize: 18, mr: 0.5, color: "success.main" }}
              />
              Rentang Harga
            </Typography>

            <Box sx={{ px: 1 }}>
              <RadioGroup
                value={filterOptions.priceRange}
                onChange={(e) =>
                  handleFilterChange({
                    priceRange: e.target.value as PriceRange,
                  })
                }
              >
                <FormControlLabel
                  value="all"
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: isDarkMode
                          ? "rgba(255,255,255,0.3)"
                          : "rgba(0,0,0,0.3)",
                        "&.Mui-checked": { color: "primary.main" },
                      }}
                    />
                  }
                  label={<Typography variant="body2">Semua harga</Typography>}
                />
                <FormControlLabel
                  value="budget"
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: isDarkMode
                          ? "rgba(255,255,255,0.3)"
                          : "rgba(0,0,0,0.3)",
                        "&.Mui-checked": { color: "primary.main" },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        Murah
                      </Typography>
                      <Chip
                        label="$"
                        size="small"
                        sx={{
                          bgcolor: isDarkMode
                            ? "rgba(76, 175, 80, 0.2)"
                            : "rgba(76, 175, 80, 0.1)",
                          color: "success.main",
                          fontWeight: "bold",
                          height: 18,
                          fontSize: "0.6rem",
                        }}
                      />
                    </Box>
                  }
                />
                <FormControlLabel
                  value="moderate"
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: isDarkMode
                          ? "rgba(255,255,255,0.3)"
                          : "rgba(0,0,0,0.3)",
                        "&.Mui-checked": { color: "primary.main" },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        Sedang
                      </Typography>
                      <Chip
                        label="$$"
                        size="small"
                        sx={{
                          bgcolor: isDarkMode
                            ? "rgba(255, 152, 0, 0.2)"
                            : "rgba(255, 152, 0, 0.1)",
                          color: "warning.main",
                          fontWeight: "bold",
                          height: 18,
                          fontSize: "0.6rem",
                        }}
                      />
                    </Box>
                  }
                />
                <FormControlLabel
                  value="luxury"
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: isDarkMode
                          ? "rgba(255,255,255,0.3)"
                          : "rgba(0,0,0,0.3)",
                        "&.Mui-checked": { color: "primary.main" },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        Mewah
                      </Typography>
                      <Chip
                        label="$$$"
                        size="small"
                        sx={{
                          bgcolor: isDarkMode
                            ? "rgba(211, 47, 47, 0.2)"
                            : "rgba(211, 47, 47, 0.1)",
                          color: "error.main",
                          fontWeight: "bold",
                          height: 18,
                          fontSize: "0.6rem",
                        }}
                      />
                    </Box>
                  }
                />
              </RadioGroup>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              startIcon={<RefreshIcon />}
              onClick={resetFilters}
              size="small"
              sx={{
                textTransform: "none",
                color: isDarkMode ? "rgba(255,255,255,0.7)" : "text.secondary",
              }}
            >
              Reset
            </Button>

            <Button
              variant="contained"
              disableElevation
              onClick={applyFilters}
              size="small"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 2,
                borderRadius: 1.5,
              }}
            >
              Terapkan Filter
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Sort Menu */}
      <Menu
        id="sort-menu"
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={closeSortMenu}
        MenuListProps={{
          "aria-labelledby": "sort-button",
          dense: true,
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.5,
            overflow: "visible",
            boxShadow: isDarkMode
              ? "0 8px 32px rgba(0, 0, 0, 0.5)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
            borderRadius: 2,
            minWidth: 180,
            border: isDarkMode
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(0, 0, 0, 0.08)",
            backgroundColor: isDarkMode ? "rgba(30, 30, 30, 0.95)" : "white",
            backdropFilter: "blur(10px)",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: isDarkMode ? "rgba(30, 30, 30, 0.95)" : "white",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
              borderTop: isDarkMode
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "1px solid rgba(0, 0, 0, 0.08)",
              borderLeft: isDarkMode
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "1px solid rgba(0, 0, 0, 0.08)",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, px: 2, py: 1.5 }}
        >
          Urutkan Berdasarkan
        </Typography>
        <Divider />

        <MenuItem
          onClick={() => handleSortChange("name-asc")}
          selected={sortOption === "name-asc"}
          sx={{
            borderLeft:
              sortOption === "name-asc" ? "3px solid" : "3px solid transparent",
            borderColor: "primary.main",
            pl: sortOption === "name-asc" ? 1.7 : 2,
          }}
        >
          <MuiListItemIcon sx={{ minWidth: 32 }}>
            <SortByAlphaIcon
              fontSize="small"
              sx={{
                color:
                  sortOption === "name-asc" ? "primary.main" : "text.secondary",
                opacity: 0.7,
                fontSize: 18,
              }}
            />
          </MuiListItemIcon>
          <ListItemText>Nama (A-Z)</ListItemText>
          {sortOption === "name-asc" && (
            <DoneIcon
              sx={{
                color: "primary.main",
                fontSize: 16,
                ml: 1,
              }}
            />
          )}
        </MenuItem>

        <MenuItem
          onClick={() => handleSortChange("name-desc")}
          selected={sortOption === "name-desc"}
          sx={{
            borderLeft:
              sortOption === "name-desc"
                ? "3px solid"
                : "3px solid transparent",
            borderColor: "primary.main",
            pl: sortOption === "name-desc" ? 1.7 : 2,
          }}
        >
          <MuiListItemIcon sx={{ minWidth: 32 }}>
            <SortByAlphaIcon
              fontSize="small"
              sx={{
                color:
                  sortOption === "name-desc"
                    ? "primary.main"
                    : "text.secondary",
                opacity: 0.7,
                fontSize: 18,
                transform: "scaleY(-1)",
              }}
            />
          </MuiListItemIcon>
          <ListItemText>Nama (Z-A)</ListItemText>
          {sortOption === "name-desc" && (
            <DoneIcon
              sx={{
                color: "primary.main",
                fontSize: 16,
                ml: 1,
              }}
            />
          )}
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => handleSortChange("rating-high")}
          selected={sortOption === "rating-high"}
          sx={{
            borderLeft:
              sortOption === "rating-high"
                ? "3px solid"
                : "3px solid transparent",
            borderColor: "primary.main",
            pl: sortOption === "rating-high" ? 1.7 : 2,
          }}
        >
          <MuiListItemIcon sx={{ minWidth: 32 }}>
            <StarIcon
              fontSize="small"
              sx={{
                color:
                  sortOption === "rating-high"
                    ? "warning.main"
                    : "text.secondary",
                opacity: sortOption === "rating-high" ? 1 : 0.7,
                fontSize: 18,
              }}
            />
          </MuiListItemIcon>
          <ListItemText>Rating (Tertinggi)</ListItemText>
          {sortOption === "rating-high" && (
            <DoneIcon
              sx={{
                color: "primary.main",
                fontSize: 16,
                ml: 1,
              }}
            />
          )}
        </MenuItem>

        <MenuItem
          onClick={() => handleSortChange("rating-low")}
          selected={sortOption === "rating-low"}
          sx={{
            borderLeft:
              sortOption === "rating-low"
                ? "3px solid"
                : "3px solid transparent",
            borderColor: "primary.main",
            pl: sortOption === "rating-low" ? 1.7 : 2,
          }}
        >
          <MuiListItemIcon sx={{ minWidth: 32 }}>
            <StarIcon
              fontSize="small"
              sx={{
                color:
                  sortOption === "rating-low"
                    ? "warning.main"
                    : "text.secondary",
                opacity: 0.7,
                fontSize: 18,
              }}
            />
          </MuiListItemIcon>
          <ListItemText>Rating (Terendah)</ListItemText>
          {sortOption === "rating-low" && (
            <DoneIcon
              sx={{
                color: "primary.main",
                fontSize: 16,
                ml: 1,
              }}
            />
          )}
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => handleSortChange("price-high")}
          selected={sortOption === "price-high"}
          sx={{
            borderLeft:
              sortOption === "price-high"
                ? "3px solid"
                : "3px solid transparent",
            borderColor: "primary.main",
            pl: sortOption === "price-high" ? 1.7 : 2,
          }}
        >
          <MuiListItemIcon sx={{ minWidth: 32 }}>
            <MonetizationOnIcon
              fontSize="small"
              sx={{
                color:
                  sortOption === "price-high"
                    ? "success.main"
                    : "text.secondary",
                opacity: sortOption === "price-high" ? 1 : 0.7,
                fontSize: 18,
              }}
            />
          </MuiListItemIcon>
          <ListItemText>Harga (Termahal)</ListItemText>
          {sortOption === "price-high" && (
            <DoneIcon
              sx={{
                color: "primary.main",
                fontSize: 16,
                ml: 1,
              }}
            />
          )}
        </MenuItem>

        <MenuItem
          onClick={() => handleSortChange("price-low")}
          selected={sortOption === "price-low"}
          sx={{
            borderLeft:
              sortOption === "price-low"
                ? "3px solid"
                : "3px solid transparent",
            borderColor: "primary.main",
            pl: sortOption === "price-low" ? 1.7 : 2,
          }}
        >
          <MuiListItemIcon sx={{ minWidth: 32 }}>
            <MonetizationOnIcon
              fontSize="small"
              sx={{
                color:
                  sortOption === "price-low"
                    ? "success.main"
                    : "text.secondary",
                opacity: 0.7,
                fontSize: 18,
              }}
            />
          </MuiListItemIcon>
          <ListItemText>Harga (Termurah)</ListItemText>
          {sortOption === "price-low" && (
            <DoneIcon
              sx={{
                color: "primary.main",
                fontSize: 16,
                ml: 1,
              }}
            />
          )}
        </MenuItem>
      </Menu>
    </>
  );
}
