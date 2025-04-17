"use client";

import {
  Card,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Modal,
  Chip,
  Rating,
  Grid,
  Button,
  Divider,
  Skeleton,
  Tooltip,
  Badge,
  Stack,
  useMediaQuery,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import ParkIcon from "@mui/icons-material/Park";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import DirectionsIcon from "@mui/icons-material/Directions";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Place } from "../data/places";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useFavorites } from "../context/FavoritesContext";
import { useTrip } from "../context/TripContext";
import { SxProps, Theme, alpha } from "@mui/material/styles";
import { useTheme as useCustomTheme } from "../context/ThemeContext";
import ResponsiveImage from "./ResponsiveImage";
import { getResponsiveImageSrc } from "../utils/imageUtils";

interface PlaceCardProps {
  place: Place;
  sx?: SxProps<Theme>;
}

const MotionCard = motion.create(Card);
const MotionBox = motion.create(Box);

// Loading skeleton component
const PlaceCardSkeleton = ({ sx }: { sx?: SxProps<Theme> }) => (
  <Card
    sx={{
      position: "relative",
      height: {
        xs: 220,
        sm: 300,
        md: 380,
      },
      borderRadius: {
        xs: "20px",
        sm: "24px",
        md: "28px",
      },
      overflow: "hidden",
      ...sx,
    }}
  >
    <Skeleton
      variant="rectangular"
      width="100%"
      height="100%"
      animation="wave"
    />
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 2,
      }}
    >
      <Skeleton variant="text" width="70%" height={32} />
      <Skeleton variant="text" width="40%" height={24} />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Skeleton
          variant="rectangular"
          width="40%"
          height={32}
          sx={{ borderRadius: 1 }}
        />
        <Skeleton variant="circular" width={32} height={32} />
      </Box>
    </Box>
  </Card>
);

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "food":
      return <RestaurantIcon />;
    case "cafe":
      return <LocalCafeIcon />;
    case "park":
      return <ParkIcon />;
    case "beach":
      return <BeachAccessIcon />;
    case "karaoke":
      return <MusicNoteIcon />;
    default:
      return <LocationOnIcon />;
  }
};

// Helper function to get category color
const getCategoryColor = (category: string) => {
  switch (category) {
    case "food":
      return "#E94057";
    case "cafe":
      return "#8C5E58";
    case "park":
      return "#52B788";
    case "beach":
      return "#3A86FF";
    case "karaoke":
      return "#C84B31";
    default:
      return "#5D69B1"; // Default color if category is not recognized
  }
};

export default function PlaceCard({ place, sx }: PlaceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const modalRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const muiTheme = useMuiTheme();
  const { mode } = useCustomTheme();
  const isDarkMode = mode === "dark";
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width:480px)");
  const prefersReducedMotion = useReducedMotion();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { addPlaceToTrip, removePlaceFromTrip, isInCurrentTrip } = useTrip();
  const favoriteStatus = isFavorite(place.id);
  const inTripStatus = isInCurrentTrip(place.id);

  // Get responsive image sources
  const placeImage = getResponsiveImageSrc(place.image);

  // Simplified animationProps for better mobile performance
  const getAnimationProps = () => {
    // Skip animations for mobile or reduced motion preference
    if (isMobile || prefersReducedMotion) {
      return {
        whileHover: {},
        transition: { type: "tween", duration: 0.2 },
      };
    }

    return {
      whileHover: {
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      },
      transition: {
        type: "tween",
        duration: 0.2,
      },
    };
  };

  // Focus trap for modal
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isModalOpen]);

  // Less intensive intersection observer for card entrance animation
  useEffect(() => {
    if (!cardRef.current || isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, [isMobile]);

  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(place.mapsLink, "_blank", "noopener,noreferrer");
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    favoriteStatus ? removeFromFavorites(place.id) : addToFavorites(place);
  };

  const handleAddToTrip = () => {
    try {
      if (inTripStatus) {
        removePlaceFromTrip(place.id);
        setSnackbarSeverity("info");
        setSnackbarMessage("Dihapus dari perjalanan");
      } else {
        addPlaceToTrip(place);
        setSnackbarSeverity("success");
        setSnackbarMessage("Ditambahkan ke perjalanan");
      }

      // Always close existing snackbar first to ensure animation plays
      handleCloseSnackbar();

      // Small delay to ensure the previous snackbar is closed
      setTimeout(() => {
        setSnackbarOpen(true);
      }, 100);
    } catch (error) {
      console.error("Error updating trip:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Gagal memperbarui perjalanan");
      setSnackbarOpen(true);
    }
  };

  // Handle image load
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  // Choose appropriate image size based on device
  const getImagePath = () => {
    if (isSmallMobile) {
      return place.imageSmall || place.image;
    }
    return place.image;
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const imageVariants = {
    hover: {
      scale: 1,
      transition: { duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  const favoriteVariants = {
    unfavorited: { scale: 1 },
    favorited: { scale: [1, 1.5, 1], transition: { duration: 0.5 } },
  };

  return (
    <>
      <MotionCard
        ref={cardRef}
        onClick={handleCardClick}
        sx={{
          position: "relative",
          height: {
            xs: 220,
            sm: 280,
            md: 320,
          },
          borderRadius: {
            xs: "16px",
            sm: "20px",
            md: "24px",
          },
          overflow: "hidden",
          cursor: "pointer",
          background: isDarkMode ? "#1e1e1e" : "#fff",
          boxShadow: isDarkMode
            ? "0 4px 15px rgba(0,0,0,0.4)"
            : "0 4px 15px rgba(0,0,0,0.1)",
          ...sx,
        }}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {!isImageLoaded && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(0,0,0,0.03)",
              zIndex: 1,
            }}
          >
            <CircularProgress
              size={40}
              thickness={4}
              sx={{
                color: getCategoryColor(place.category),
              }}
            />
          </Box>
        )}

        <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
          <ResponsiveImage
            src={placeImage.src}
            mobileSrc={placeImage.mobileSrc}
            alt={place.name}
            fill
            onLoad={handleImageLoad}
            className="object-cover scale-100"
            style={{
              transition: "transform 0.5s ease",
            }}
          />
        </Box>

        <Box
          className="overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: (theme) =>
              `linear-gradient(to top, ${
                isDarkMode
                  ? "rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.1)"
                  : "rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0)"
              } 100%)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: {
              xs: 1.5,
              sm: 2,
            },
            opacity: 1,
            transition: "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: { xs: 10, md: 18 },
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
              px: { xs: 2, md: 3 },
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                maxWidth: "500px",
              }}
            >
              <MotionBox
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <Chip
                  icon={getCategoryIcon(place.category)}
                  label={
                    place.category.charAt(0).toUpperCase() +
                    place.category.slice(1)
                  }
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.95)",
                    fontWeight: 600,
                    backdropFilter: "blur(8px)",
                    boxShadow: `0 2px 10px rgba(0,0,0,0.15), 0 0 0 1px ${alpha(
                      getCategoryColor(place.category),
                      0.2
                    )}`,
                    transition: "all 0.3s ease",
                    py: 1,
                    px: 0.5,
                    borderRadius: "20px",
                    "& .MuiChip-icon": {
                      color: getCategoryColor(place.category),
                      marginLeft: "8px",
                    },
                    "& .MuiChip-label": {
                      px: 1,
                      fontSize: {
                        xs: "0.65rem",
                        sm: "0.7rem",
                        md: "0.75rem",
                      },
                      fontWeight: 700,
                      color: "#000000",
                    },
                    "&:hover": {
                      boxShadow: `0 4px 12px rgba(0,0,0,0.2), 0 0 0 1px ${alpha(
                        getCategoryColor(place.category),
                        0.3
                      )}`,
                      bgcolor: "rgba(255, 255, 255, 0.98)",
                    },
                  }}
                />
              </MotionBox>

              <Tooltip
                title={
                  favoriteStatus ? "Hapus dari favorit" : "Tambah ke favorit"
                }
                arrow
              >
                <IconButton
                  onClick={handleFavoriteToggle}
                  aria-label={
                    favoriteStatus
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                  component={motion.button}
                  variants={favoriteVariants}
                  animate={favoriteStatus ? "favorited" : "unfavorited"}
                  sx={(theme) => ({
                    background: favoriteStatus
                      ? "rgba(255, 0, 50, 0.95)"
                      : alpha("#ffffff", 0.85),
                    backdropFilter: "blur(8px)",
                    padding: { xs: "6px", sm: "8px" },
                    cursor: "pointer",
                    color: favoriteStatus
                      ? "white"
                      : getCategoryColor(place.category),
                    "&:hover": {
                      background: favoriteStatus
                        ? "rgba(255, 0, 50, 1)"
                        : alpha("#ffffff", 0.95),
                      boxShadow: `0 6px 20px ${alpha(
                        "rgb(255, 0, 50)",
                        favoriteStatus ? 0.8 : 0.6
                      )}`,
                    },
                    "&:focus-visible": {
                      outline: "2px solid white",
                      outlineOffset: 2,
                    },
                    transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    boxShadow: favoriteStatus
                      ? "0 0 15px rgba(255, 0, 50, 0.7)"
                      : "none",
                  })}
                >
                  {favoriteStatus ? (
                    <FavoriteIcon
                      sx={{
                        color: "#ffffff",
                        filter: "drop-shadow(0 0 2px rgba(255,255,255,0.5))",
                      }}
                      fontSize="medium"
                    />
                  ) : (
                    <FavoriteBorderIcon fontSize="medium" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <MotionBox
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Typography
              className="place-name"
              variant="h5"
              sx={{
                color: "white",
                fontWeight: 700,
                textShadow: "0px 2px 8px rgba(0,0,0,0.8)",
                mb: { xs: 0.7, sm: 1.2, md: 1.2 },
                fontSize: {
                  xs: "1.1rem",
                  sm: "1.4rem",
                  md: "1.8rem",
                },
                lineHeight: { xs: 1.2, sm: 1.3, md: 1.3 },
                transition: "transform 0.3s ease",
                letterSpacing: "-0.01em",
              }}
            >
              {place.name}
              {place.featured && (
                <VerifiedIcon
                  sx={{
                    ml: 0.7,
                    fontSize: "0.9em",
                    color: "#90caf9",
                    verticalAlign: "middle",
                  }}
                />
              )}
            </Typography>
          </MotionBox>

          <MotionBox
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: { xs: 1.2, sm: 1.8 },
              }}
            >
              <Rating
                value={place.rating}
                precision={0.5}
                readOnly
                size="small"
                icon={<StarIcon fontSize="inherit" sx={{ color: "#FFD700" }} />}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 500,
                  textShadow: "0px 1px 4px rgba(0,0,0,0.5)",
                }}
              >
                {place.rating} ({place.reviewCount})
              </Typography>
            </Box>
          </MotionBox>

          {place.address && (
            <MotionBox
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  mb: 1.8,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  textShadow: "0px 1px 4px rgba(0,0,0,0.5)",
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.8rem",
                    md: "0.875rem",
                  },
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}
              >
                <LocationOnIcon sx={{ fontSize: "0.9rem" }} />
                {place.address}
              </Typography>
            </MotionBox>
          )}

          <MotionBox
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Tooltip title="Lihat di Google Maps" arrow>
                <Button
                  onClick={handleMapClick}
                  startIcon={<MapIcon />}
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: alpha("#ffffff", 0.18),
                    backdropFilter: "blur(10px)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: alpha("#ffffff", 0.28),
                      transform: "translateY(-3px) scale(1.05)",
                      boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
                    },
                    transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    px: 1.5,
                  }}
                >
                  Lihat Lokasi
                </Button>
              </Tooltip>

              <Chip
                label={place.priceRange}
                size="small"
                sx={{
                  bgcolor: alpha("#ffffff", 0.18),
                  color: "white",
                  backdropFilter: "blur(10px)",
                  fontWeight: 600,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  textShadow: "0px 1px 3px rgba(0,0,0,0.4)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    bgcolor: alpha("#ffffff", 0.22),
                  },
                }}
              />
            </Box>
          </MotionBox>
        </Box>
      </MotionCard>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pb: 2,
              pt: 2,
              overflow: "auto",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE and Edge
              "&::-webkit-scrollbar": {
                display: "none", // Chrome, Safari, and Opera
              },
            }}
            disableAutoFocus
            disableEnforceFocus
            keepMounted
          >
            {isMobile ? (
              // Mobile modal layout
              <Box
                sx={{
                  width: "95%",
                  maxWidth: "600px",
                  maxHeight: "85vh",
                  backgroundColor: "background.paper",
                  borderRadius: "20px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                  overflow: "auto",
                  position: "relative",
                  pb: 2,
                  scrollbarWidth: "none", // Firefox
                  msOverflowStyle: "none", // IE and Edge
                  "&::-webkit-scrollbar": {
                    display: "none", // Chrome, Safari, and Opera
                  },
                }}
              >
                {/* Close button */}
                <IconButton
                  onClick={() => setIsModalOpen(false)}
                  aria-label="close modal"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    zIndex: 10,
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>

                {/* Image */}
                <Box
                  sx={{
                    width: "100%",
                    height: "35vh",
                    backgroundImage: `url(${place.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderTopLeftRadius: "20px",
                    borderTopRightRadius: "20px",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                    }}
                  >
                    <Chip
                      icon={getCategoryIcon(place.category)}
                      label={
                        place.category.charAt(0).toUpperCase() +
                        place.category.slice(1)
                      }
                      sx={{
                        bgcolor: "white",
                        fontWeight: 600,
                        "& .MuiChip-icon": {
                          color: getCategoryColor(place.category),
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ p: 2 }}>
                  {/* Title and favorite button */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h2"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      {place.name}
                      {place.featured && (
                        <VerifiedIcon
                          sx={{
                            fontSize: "1rem",
                            color: muiTheme.palette.primary.main,
                            ml: 0.5,
                            verticalAlign: "middle",
                          }}
                        />
                      )}
                    </Typography>

                    <IconButton
                      onClick={handleFavoriteToggle}
                      sx={{
                        color: favoriteStatus ? "#ff0032" : "gray",
                      }}
                    >
                      {favoriteStatus ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                  </Box>

                  {/* Rating and price */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Rating
                      value={place.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {place.rating} ({place.reviewCount} ulasan)
                    </Typography>
                    <Chip
                      label={place.priceRange}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  {/* Location and hours */}
                  {place.address && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mb: 1.5,
                        alignItems: "flex-start",
                      }}
                    >
                      <LocationOnIcon
                        color="primary"
                        fontSize="small"
                        sx={{ mt: 0.3 }}
                      />
                      <Typography variant="body2" color="text.primary">
                        {place.address}
                      </Typography>
                    </Box>
                  )}

                  {place.openingHours && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mb: 2,
                        alignItems: "flex-start",
                      }}
                    >
                      <AccessTimeIcon
                        color="primary"
                        fontSize="small"
                        sx={{ mt: 0.3 }}
                      />
                      <Typography variant="body2" color="text.primary">
                        {place.openingHours}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ mb: 2 }} />

                  {/* Description */}
                  <Typography
                    variant="body2"
                    paragraph
                    sx={{ mb: 3 }}
                    color="text.primary"
                  >
                    {place.description}
                  </Typography>

                  {/* Features */}
                  {inTripStatus &&
                    place.features &&
                    place.features.length > 0 && (
                      <>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{ mb: 1 }}
                          color="text.primary"
                        >
                          Fasilitas:
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 3,
                          }}
                        >
                          {place.features.map((feature, idx) => (
                            <Chip key={idx} label={feature} size="small" />
                          ))}
                        </Box>
                      </>
                    )}

                  {/* Buttons */}
                  <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<DirectionsIcon />}
                      onClick={handleMapClick}
                      sx={{
                        py: 1.5,
                        borderRadius: "12px",
                        background: `linear-gradient(45deg, ${getCategoryColor(
                          place.category
                        )}, ${alpha(getCategoryColor(place.category), 0.7)})`,
                      }}
                    >
                      Lihat Lokasi
                    </Button>
                    <Button
                      fullWidth
                      variant={inTripStatus ? "contained" : "outlined"}
                      color="primary"
                      startIcon={
                        inTripStatus ? (
                          <BookmarkAddedIcon />
                        ) : (
                          <BookmarkAddIcon />
                        )
                      }
                      onClick={handleAddToTrip}
                    >
                      {inTripStatus ? "Ditambahkan" : "Tambahkan"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            ) : (
              // Desktop modal layout - keeping the existing layout
              <MotionBox
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                tabIndex={-1}
                ref={modalRef}
                sx={{
                  position: "relative",
                  bgcolor: "background.paper",
                  boxShadow: isDarkMode
                    ? "0 10px 40px rgba(0,0,0,0.5)"
                    : "0 10px 40px rgba(0,0,0,0.2)",
                  p: 0,
                  outline: "none",
                  width: "85%",
                  maxWidth: "1000px",
                  height: "auto",
                  maxHeight: "85vh",
                  borderRadius: "20px",
                  overflow: "auto",
                  scrollbarWidth: "none", // Firefox
                  msOverflowStyle: "none", // IE and Edge
                  "&::-webkit-scrollbar": {
                    display: "none", // Chrome, Safari, and Opera
                  },
                  "&:focus": {
                    outline: "none",
                  },
                }}
              >
                <Tooltip title="Close" arrow placement="left">
                  <IconButton
                    onClick={() => setIsModalOpen(false)}
                    aria-label="close modal"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      bgcolor: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      zIndex: 10,
                      "&:hover": {
                        bgcolor: "rgba(0, 0, 0, 0.7)",
                        transform: "scale(1.1) rotate(90deg)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    height: "70vh",
                  }}
                >
                  {/* Left side - Image */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "50%",
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${place.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderTopLeftRadius: "20px",
                        borderBottomLeftRadius: "20px",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 16,
                          left: 16,
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Chip
                            icon={getCategoryIcon(place.category)}
                            label={
                              place.category.charAt(0).toUpperCase() +
                              place.category.slice(1)
                            }
                            sx={{
                              bgcolor: "white",
                              fontWeight: 600,
                              boxShadow: `0 2px 12px rgba(0,0,0,0.2), 0 0 0 1px ${alpha(
                                getCategoryColor(place.category),
                                0.2
                              )}`,
                              transition: "all 0.2s ease",
                              py: 1,
                              px: 0.5,
                              borderRadius: "20px",
                              "& .MuiChip-icon": {
                                color: getCategoryColor(place.category),
                                marginLeft: "8px",
                              },
                              "& .MuiChip-label": {
                                px: 1,
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                color: "#000000",
                              },
                              "&:hover": {
                                transform: "translateY(-2px) scale(1.05)",
                                boxShadow: `0 4px 15px rgba(0,0,0,0.3), 0 0 0 1px ${alpha(
                                  getCategoryColor(place.category),
                                  0.3
                                )}`,
                              },
                            }}
                          />
                        </motion.div>
                      </Box>

                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 16,
                          left: 16,
                          right: 16,
                          display: "flex",
                          gap: 1,
                        }}
                      >
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Share" arrow>
                            <IconButton
                              onClick={handleMapClick}
                              sx={{
                                bgcolor: "rgba(255, 255, 255, 0.2)",
                                backdropFilter: "blur(10px)",
                                color: "white",
                                "&:hover": {
                                  bgcolor: "rgba(255, 255, 255, 0.3)",
                                  transform: "translateY(-2px)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              <ShareIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Get Directions" arrow>
                            <IconButton
                              onClick={handleMapClick}
                              sx={{
                                bgcolor: "rgba(255, 255, 255, 0.2)",
                                backdropFilter: "blur(10px)",
                                color: "white",
                                "&:hover": {
                                  bgcolor: "rgba(255, 255, 255, 0.3)",
                                  transform: "translateY(-2px)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              <DirectionsIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </Box>
                  </Box>

                  {/* Right side - Content */}
                  <Box
                    sx={{
                      p: 4,
                      width: "50%",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "auto",
                      scrollbarWidth: "none", // Firefox
                      msOverflowStyle: "none", // IE and Edge
                      "&::-webkit-scrollbar": {
                        display: "none", // Chrome, Safari, and Opera
                      },
                    }}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        overflow: "auto",
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE and Edge
                        "&::-webkit-scrollbar": {
                          display: "none", // Chrome, Safari, and Opera
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          mb: 1.5,
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="h4"
                              component="h2"
                              id={"modal-" + place.id + "-title"}
                              sx={{
                                fontWeight: 700,
                                lineHeight: 1.2,
                                fontSize: "2.2rem",
                                letterSpacing: "-0.02em",
                                color: isDarkMode ? "#ffffff" : "#000000",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {place.name}
                              {place.featured && (
                                <Tooltip title="Featured Place" arrow>
                                  <VerifiedIcon
                                    sx={{
                                      fontSize: "1.2rem",
                                      color: muiTheme.palette.primary.main,
                                      verticalAlign: "middle",
                                    }}
                                  />
                                </Tooltip>
                              )}
                            </Typography>

                            <Tooltip
                              title={
                                favoriteStatus
                                  ? "Hapus dari favorit"
                                  : "Tambah ke favorit"
                              }
                              arrow
                            >
                              <IconButton
                                onClick={handleFavoriteToggle}
                                color="primary"
                                aria-label={
                                  favoriteStatus
                                    ? "Remove from favorites"
                                    : "Add to favorites"
                                }
                                component={motion.button}
                                variants={favoriteVariants}
                                animate={
                                  favoriteStatus ? "favorited" : "unfavorited"
                                }
                                sx={{
                                  p: 1,
                                  color: favoriteStatus
                                    ? "#ff0032"
                                    : alpha(
                                        getCategoryColor(place.category),
                                        0.8
                                      ),
                                  "&:hover": {
                                    transform: "scale(1.15)",
                                    bgcolor: favoriteStatus
                                      ? alpha("#ff0032", 0.1)
                                      : alpha(
                                          getCategoryColor(place.category),
                                          0.08
                                        ),
                                    boxShadow: favoriteStatus
                                      ? "0 0 10px rgba(255, 0, 50, 0.4)"
                                      : "none",
                                  },
                                  transition: "all 0.3s ease",
                                }}
                              >
                                {favoriteStatus ? (
                                  <FavoriteIcon
                                    sx={{
                                      color: "#ff0032",
                                      filter:
                                        "drop-shadow(0 0 2px rgba(255,255,255,0.5))",
                                    }}
                                    fontSize="medium"
                                  />
                                ) : (
                                  <FavoriteBorderIcon fontSize="medium" />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </motion.div>
                      </Box>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2.5,
                          }}
                        >
                          <Rating
                            value={place.rating}
                            precision={0.5}
                            readOnly
                            size="small"
                            sx={{
                              "& .MuiRating-iconFilled": {
                                color: muiTheme.palette.secondary.main,
                              },
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {place.rating} ({place.reviewCount} ulasan)
                          </Typography>
                          <Chip
                            label={place.priceRange}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontWeight: 600,
                              borderRadius: "8px",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                              },
                            }}
                          />
                        </Box>
                      </motion.div>

                      {place.address && place.openingHours ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              gap: 2,
                              mb: 3.5,
                            }}
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1.2,
                                p: 1.5,
                                bgcolor: alpha(
                                  muiTheme.palette.primary.main,
                                  0.05
                                ),
                                borderRadius: "12px",
                                flex: "auto",
                                width: "fit-content",
                                maxWidth: "100%",
                              }}
                            >
                              <LocationOnIcon
                                color="primary"
                                sx={{
                                  fontSize: "1.25rem",
                                  mt: 0.15,
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ lineHeight: 1.5 }}
                              >
                                {place.address}
                              </Typography>
                            </Paper>

                            <Paper
                              elevation={0}
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1.2,
                                p: 1.5,
                                bgcolor: alpha(
                                  muiTheme.palette.primary.main,
                                  0.05
                                ),
                                borderRadius: "12px",
                                flex: "auto",
                                width: "fit-content",
                                maxWidth: "100%",
                              }}
                            >
                              <AccessTimeIcon
                                color="primary"
                                sx={{
                                  fontSize: "1.25rem",
                                  mt: 0.15,
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ lineHeight: 1.5 }}
                              >
                                {place.openingHours}
                              </Typography>
                            </Paper>
                          </Box>
                        </motion.div>
                      ) : (
                        <>
                          {place.address && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <Paper
                                elevation={0}
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 1.2,
                                  mb: 2.5,
                                  p: 1.5,
                                  bgcolor: alpha(
                                    muiTheme.palette.primary.main,
                                    0.05
                                  ),
                                  borderRadius: "12px",
                                  width: "fit-content",
                                  maxWidth: "100%",
                                }}
                              >
                                <LocationOnIcon
                                  color="primary"
                                  sx={{
                                    fontSize: "1.25rem",
                                    mt: 0.15,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ lineHeight: 1.5 }}
                                >
                                  {place.address}
                                </Typography>
                              </Paper>
                            </motion.div>
                          )}

                          {place.openingHours && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <Paper
                                elevation={0}
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 1.2,
                                  mb: 3.5,
                                  p: 1.5,
                                  bgcolor: alpha(
                                    muiTheme.palette.primary.main,
                                    0.05
                                  ),
                                  borderRadius: "12px",
                                  width: "fit-content",
                                  maxWidth: "100%",
                                }}
                              >
                                <AccessTimeIcon
                                  color="primary"
                                  sx={{
                                    fontSize: "1.25rem",
                                    mt: 0.15,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ lineHeight: 1.5 }}
                                >
                                  {place.openingHours}
                                </Typography>
                              </Paper>
                            </motion.div>
                          )}
                        </>
                      )}

                      <Divider sx={{ mb: 3.5 }} />

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Typography
                          variant="body1"
                          paragraph
                          id={"modal-" + place.id + "-description"}
                          sx={{
                            lineHeight: 1.7,
                            color: "text.primary",
                            mb: 3,
                          }}
                        >
                          {place.description}
                        </Typography>
                      </motion.div>

                      {inTripStatus && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              mb: 1.5,
                              color: "text.primary",
                            }}
                          >
                            Fasilitas:
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                              mb: 4.5,
                            }}
                          >
                            {place.features.map((feature, index) => (
                              <Chip
                                key={index}
                                label={feature}
                                size="small"
                                sx={{
                                  bgcolor: alpha(
                                    muiTheme.palette.primary.main,
                                    0.08
                                  ),
                                  borderRadius: "8px",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    transform: "translateY(-2px)",
                                    bgcolor: alpha(
                                      muiTheme.palette.primary.main,
                                      0.12
                                    ),
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        </motion.div>
                      )}
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Button
                            variant="contained"
                            fullWidth
                            startIcon={<DirectionsIcon />}
                            onClick={handleMapClick}
                            sx={{
                              py: 1.8,
                              borderRadius: "14px",
                              fontWeight: 600,
                              background: `linear-gradient(45deg, ${getCategoryColor(
                                place.category
                              )}, ${alpha(
                                getCategoryColor(place.category),
                                0.7
                              )})`,
                              boxShadow: `0 8px 25px ${alpha(
                                getCategoryColor(place.category),
                                0.4
                              )}`,
                              textTransform: "none",
                              "&:hover": {
                                boxShadow: `0 10px 30px ${alpha(
                                  getCategoryColor(place.category),
                                  0.6
                                )}`,
                                transform: "translateY(-4px) scale(1.01)",
                              },
                              transition:
                                "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                              fontSize: "1rem",
                            }}
                          >
                            Lihat Lokasi
                          </Button>
                          <Button
                            variant={inTripStatus ? "contained" : "outlined"}
                            color="primary"
                            fullWidth
                            disableElevation
                            startIcon={
                              inTripStatus ? (
                                <BookmarkAddedIcon />
                              ) : (
                                <BookmarkAddIcon />
                              )
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToTrip();
                            }}
                            sx={{
                              py: 1.5,
                              textTransform: "none",
                              bgcolor: inTripStatus
                                ? alpha(muiTheme.palette.primary.main, 0.9)
                                : "transparent",
                              color: inTripStatus
                                ? "white"
                                : muiTheme.palette.primary.main,
                              border: `1px solid ${
                                inTripStatus
                                  ? "transparent"
                                  : muiTheme.palette.primary.main
                              }`,
                              "&:hover": {
                                color: "white",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                                bgcolor: inTripStatus
                                  ? muiTheme.palette.primary.dark
                                  : isDarkMode
                                  ? alpha(muiTheme.palette.primary.main, 0.04)
                                  : "#B02A37",
                              },
                              transition:
                                "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                            }}
                          >
                            {inTripStatus
                              ? "Ditambahkan ke Trip"
                              : "Tambahkan ke Trip"}
                          </Button>
                        </Box>
                      </motion.div>
                    </Box>
                  </Box>
                </Box>
              </MotionBox>
            )}
          </Modal>
        )}
      </AnimatePresence>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          mt: 2,
          maxWidth: "95%",
          "& .MuiPaper-root": {
            borderRadius: "12px",
            boxShadow: isDarkMode
              ? "0 8px 32px rgba(0,0,0,0.4)"
              : "0 8px 32px rgba(0,0,0,0.08)",
          },
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          icon={<CheckCircleOutlineIcon />}
          sx={{
            width: "100%",
            alignItems: "center",
            "& .MuiAlert-icon": {
              fontSize: "1.2rem",
              mr: 1,
              my: 0,
              opacity: 0.9,
            },
            "& .MuiAlert-message": {
              fontSize: "0.9rem",
              fontWeight: 500,
            },
            bgcolor:
              snackbarSeverity === "success"
                ? getCategoryColor(place.category)
                : undefined,
            py: 0.8,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
