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
import AddIcon from "@mui/icons-material/Add";
import { Place } from "../data/places";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { useFavorites } from "../context/FavoritesContext";
import { SxProps, Theme } from "@mui/material/styles";

interface PlaceCardProps {
  place: Place;
  sx?: SxProps<Theme>;
}

const MotionCard = motion(Card);

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
  const [isAddedToTrip, setIsAddedToTrip] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
  const favoriteStatus = isFavorite(place.id);

  // Focus trap for modal
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isModalOpen]);

  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(place.mapsLink, "_blank", "noopener,noreferrer");
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(place);
  };

  const handleAddToTrip = () => {
    setIsAddedToTrip(!isAddedToTrip);
    // Here you would add the actual functionality to add to trip
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: place.name,
          text: `Check out this place: ${place.name}`,
          url: place.mapsLink,
        })
        .catch((error) => console.log("Error sharing", error));
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const favoriteVariants = {
    unfavorited: { scale: 1 },
    favorited: { scale: [1, 1.2, 1], transition: { duration: 0.3 } },
  };

  return (
    <>
      <MotionCard
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={cardVariants}
        transition={{ duration: 0.4, ease: "easeOut" }}
        sx={{
          position: "relative",
          height: {
            xs: 220,
            sm: 300,
            md: 380,
          },
          cursor: "pointer",
          overflow: "hidden",
          borderRadius: {
            xs: "20px",
            sm: "24px",
            md: "28px",
          },
          backgroundColor: "#ffffff",
          boxShadow: isHovered
            ? (theme) => `0 20px 50px ${getCategoryColor(place.category)}66`
            : "0 10px 30px rgba(0,0,0,0.12)",
          transition: "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
          "&:hover": {
            "& .MuiCardMedia-root": {
              transform: "scale(1.1)",
            },
            "& .overlay": {
              opacity: 1,
              background: (theme) =>
                `linear-gradient(to top, rgba(0, 0, 0, 0.94) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.4) 100%)`,
            },
            "& .place-name": {
              transform: "translateY(-2px)",
            },
          },
          "&:focus-visible": {
            outline: (theme) => "3px solid " + theme.palette.primary.main,
            outlineOffset: 4,
          },
          ...(sx || {}),
        }}
        role="button"
        tabIndex={0}
        aria-label={"View details of " + place.name}
      >
        {!isImageLoaded && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
            sx={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
          />
        )}

        <CardMedia
          component="img"
          height="100%"
          image={place.image}
          alt={place.name}
          onLoad={handleImageLoad}
          sx={{
            transition: "transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)",
            opacity: isImageLoaded ? 1 : 0,
          }}
        />

        <Box
          className="overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: (theme) =>
              `linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 40%, rgba(0, 0, 0, 0.2) 100%)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: {
              xs: 2.5,
              sm: 3,
              md: 3.5,
            },
            opacity: 1,
            transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: { xs: 6, md: 10 },
              left: { xs: 10, md: 18 },
            }}
          >
            <Chip
              icon={getCategoryIcon(place.category)}
              label={
                place.category.charAt(0).toUpperCase() + place.category.slice(1)
              }
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.95)",
                fontWeight: 600,
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                },
              }}
            />
          </Box>

          <motion.div
            initial={false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
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
            </Typography>
          </motion.div>

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

          {place.address && (
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
              }}
            >
              <LocationOnIcon sx={{ fontSize: "0.9rem" }} />
              {place.address}
            </Typography>
          )}

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
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.25)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                  },
                  transition: "all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
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
                bgcolor: "rgba(255, 255, 255, 0.15)",
                color: "white",
                backdropFilter: "blur(10px)",
                fontWeight: 600,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                textShadow: "0px 1px 3px rgba(0,0,0,0.4)",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            />
          </Box>
        </Box>

        <Tooltip
          title={favoriteStatus ? "Hapus dari favorit" : "Tambah ke favorit"}
          arrow
        >
          <IconButton
            onClick={handleFavoriteToggle}
            aria-label={
              favoriteStatus ? "Remove from favorites" : "Add to favorites"
            }
            component={motion.button}
            variants={favoriteVariants}
            animate={favoriteStatus ? "favorited" : "unfavorited"}
            sx={(theme) => ({
              position: "absolute",
              top: { xs: 10, md: 18 },
              right: { xs: 10, md: 18 },
              background: favoriteStatus
                ? theme.palette.primary.main
                : theme.palette.primary.main,
              backdropFilter: "blur(8px)",
              padding: { xs: "6px", sm: "8px" },
              cursor: "pointer",
              "&:hover": {
                background: favoriteStatus
                  ? theme.palette.primary.dark
                  : theme.palette.primary.dark,
                transform: "scale(1.15)",
                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.6)",
              },
              "&:focus-visible": {
                outline: "2px solid white",
                outlineOffset: 2,
              },
              transition: "all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
            })}
          >
            {favoriteStatus ? (
              <FavoriteIcon
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.5rem" },
                  color: "white",
                }}
              />
            ) : (
              <FavoriteBorderIcon
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.5rem" },
                  color: "white",
                }}
              />
            )}
          </IconButton>
        </Tooltip>
      </MotionCard>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            aria-labelledby={"modal-" + place.id + "-title"}
            aria-describedby={"modal-" + place.id + "-description"}
            closeAfterTransition
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 1, sm: 2, md: 3 },
              backdropFilter: "blur(5px)",
            }}
          >
            <Box
              component={motion.div}
              ref={modalRef}
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.35, ease: [0.19, 1.0, 0.22, 1.0] }}
              sx={{
                bgcolor: "background.paper",
                borderRadius: "28px",
                boxShadow: "0 24px 70px rgba(0,0,0,0.2)",
                maxWidth: "90vw",
                width: { xs: "100%", sm: "90%", md: "85%", lg: "1100px" },
                maxHeight: "90vh",
                overflow: "auto",
                position: "relative",
                outline: "none",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <IconButton
                onClick={() => setIsModalOpen(false)}
                aria-label="close modal"
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  zIndex: 10,
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.7)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <CloseIcon />
              </IconButton>

              <Grid container>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      position: "relative",
                      height: { xs: "40vh", md: "100%" },
                      backgroundImage: "url(" + place.image + ")",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderTopLeftRadius: { md: "28px" },
                      borderTopRightRadius: { xs: "28px", md: 0 },
                      borderBottomLeftRadius: { xs: 0, md: "28px" },
                      transition: "all 0.5s ease",
                      "&:hover": {
                        // Removed transform and filter effects
                      },
                      transformOrigin: "center",
                      overflow: "hidden",
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
                      <Chip
                        icon={getCategoryIcon(place.category)}
                        label={
                          place.category.charAt(0).toUpperCase() +
                          place.category.slice(1)
                        }
                        sx={{
                          bgcolor: "white",
                          fontWeight: 600,
                          boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                          },
                        }}
                      />
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
                      <Tooltip title="Share" arrow>
                        <IconButton
                          onClick={handleShareClick}
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
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ p: { xs: 2.5, sm: 3.5, md: 4.5 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1.5,
                      }}
                    >
                      <Typography
                        variant="h4"
                        component="h2"
                        id={"modal-" + place.id + "-title"}
                        sx={{
                          fontWeight: 700,
                          lineHeight: 1.2,
                          fontSize: { xs: "1.8rem", md: "2.2rem" },
                          letterSpacing: "-0.02em",
                          color: "#000000",
                        }}
                      >
                        {place.name}
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
                          animate={favoriteStatus ? "favorited" : "unfavorited"}
                          sx={{
                            p: 1,
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          {favoriteStatus ? (
                            <FavoriteIcon
                              sx={{
                                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                                color: "white",
                              }}
                            />
                          ) : (
                            <FavoriteBorderIcon
                              sx={{
                                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                                color: "white",
                              }}
                            />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>

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
                            color: theme.palette.secondary.main,
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
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          },
                        }}
                      />
                    </Box>

                    {place.address && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.2,
                          mb: 2.5,
                        }}
                      >
                        <LocationOnIcon color="action" sx={{ mt: 0.3 }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.5 }}
                        >
                          {place.address}
                        </Typography>
                      </Box>
                    )}

                    {place.openingHours && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.2,
                          mb: 3.5,
                        }}
                      >
                        <AccessTimeIcon color="action" sx={{ mt: 0.3 }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.5 }}
                        >
                          {place.openingHours}
                        </Typography>
                      </Box>
                    )}

                    <Divider sx={{ mb: 3.5 }} />

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
                            bgcolor: "rgba(0,0,0,0.05)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              bgcolor: "rgba(0,0,0,0.08)",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            },
                          }}
                        />
                      ))}
                    </Box>

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
                          background:
                            "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                          textTransform: "none",
                          "&:hover": {
                            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                            transform: "translateY(-3px)",
                          },
                          transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                          fontSize: "1rem",
                        }}
                      >
                        Lihat Lokasi
                      </Button>
                      <Button
                        variant={isAddedToTrip ? "contained" : "outlined"}
                        color={isAddedToTrip ? "secondary" : "primary"}
                        fullWidth
                        startIcon={isAddedToTrip ? null : <AddIcon />}
                        onClick={handleAddToTrip}
                        sx={{
                          py: 1.8,
                          borderRadius: "14px",
                          fontWeight: 600,
                          borderWidth: 2,
                          textTransform: "none",
                          "&:hover": {
                            borderWidth: isAddedToTrip ? 0 : 2,
                            transform: "translateY(-3px)",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                          },
                          transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                          fontSize: "1rem",
                        }}
                      >
                        {isAddedToTrip
                          ? "Ditambahkan ke Trip"
                          : "Tambahkan ke Trip"}
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
