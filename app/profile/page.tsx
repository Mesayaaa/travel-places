"use client";

import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  Tooltip,
  Badge,
  Skeleton,
  useTheme as useMuiTheme,
  useMediaQuery,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import SettingsIcon from "@mui/icons-material/Settings";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ShareIcon from "@mui/icons-material/Share";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useTrip } from "../context/TripContext";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { Place, places } from "../data/places";

// Trip type definition
interface Trip {
  destination: string;
  date: string;
}

// Component to render a place card with animation
const PlaceCard = ({ place, delay = 0 }: { place: Place; delay?: number }) => {
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";

  return (
    <Grid item xs={12} sm={6} md={4} key={place.id}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay }}
      >
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: isDarkMode
                ? "0 12px 20px rgba(0,0,0,0.4)"
                : "0 12px 20px rgba(0,0,0,0.2)",
            },
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: isDarkMode
              ? "0 4px 20px rgba(0,0,0,0.3)"
              : "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <CardMedia
            component="img"
            height="140"
            image={place.image}
            alt={place.name}
            sx={{ objectFit: "cover" }}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" gutterBottom noWrap>
              {place.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {place.description}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 1,
              }}
            >
              <LocationOnIcon
                fontSize="small"
                sx={{ mr: 0.5, color: "primary.main" }}
              />
              <Typography variant="caption" color="text.secondary" noWrap>
                {place.address || "Indonesia"}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  );
};

// Recent trips section with timeline
const RecentTrips = ({ trips }: { trips: Trip[] }) => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";

  return (
    <List disablePadding>
      {trips.map((trip, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card
            variant="outlined"
            sx={{
              mb: 2,
              borderRadius: 2,
              position: "relative",
              overflow: "visible",
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: isDarkMode
                  ? "0 10px 20px rgba(0,0,0,0.3)"
                  : "0 10px 20px rgba(0,0,0,0.1)",
              },
              "&:before": {
                content: '""',
                position: "absolute",
                left: isMobile ? "-8px" : "-12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: isMobile ? "16px" : "24px",
                height: isMobile ? "16px" : "24px",
                backgroundColor: "primary.main",
                borderRadius: "50%",
                zIndex: 1,
                boxShadow: isDarkMode ? "0 0 0 4px #1e1e1e" : "0 0 0 4px white",
              },
            }}
          >
            <CardContent>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} sm={7}>
                  <Typography variant="h6" component="div">
                    {trip.destination}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trip.date}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={5} sx={{ textAlign: "right" }}>
                  <Chip
                    label="Selesai"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </List>
  );
};

export default function ProfilePage() {
  const muiTheme = useMuiTheme();
  const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { favorites, favoritesCount } = useFavorites();
  const { placesInTrip } = useTrip();
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get completed trips from localStorage or use default
  const [completedTrips, setCompletedTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const storedTrips = localStorage.getItem("completedTrips");
    if (storedTrips) {
      try {
        setCompletedTrips(JSON.parse(storedTrips));
      } catch (error) {
        console.error("Error parsing completed trips from localStorage", error);
        // Set default trips if parsing fails
        setDefaultCompletedTrips();
      }
    } else {
      // Set default trips if none exist
      setDefaultCompletedTrips();
    }
  }, []);

  // Function to set default completed trips
  const setDefaultCompletedTrips = () => {
    const defaultTrips: Trip[] = [
      {
        destination: "Pulau Komodo",
        date: "April 2024",
      },
      {
        destination: "Danau Toba",
        date: "Januari 2024",
      },
      {
        destination: "Raja Ampat",
        date: "Oktober 2023",
      },
    ];

    setCompletedTrips(defaultTrips);
    localStorage.setItem("completedTrips", JSON.stringify(defaultTrips));
  };

  // User data combined from local storage and context
  const [user, setUser] = useState({
    name: "Ariana Dewi",
    email: "ariana.dewi@example.com",
    joinedDate: "Juni 2023",
    bio: "Pecinta traveling dan petualangan baru. Suka mengeksplor tempat-tempat indah di Indonesia.",
    location: "Jakarta, Indonesia",
    trips: completedTrips.length || 0,
    favoritesCount: 0,
    plannedTrips: 0,
  });

  // Update user data when favorites or trips change
  useEffect(() => {
    setUser((prev) => ({
      ...prev,
      trips: completedTrips.length,
      favoritesCount: favoritesCount,
      plannedTrips: placesInTrip?.length || 0,
    }));
  }, [favoritesCount, placesInTrip, completedTrips]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: isDarkMode ? "#121212" : "#f8f9fa",
      }}
    >
      <Navbar />

      <Container maxWidth="lg" sx={{ pt: 12, pb: 6 }}>
        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: 4,
            bgcolor: isDarkMode ? "#1e1e1e" : "#ffffff",
            boxShadow: isDarkMode
              ? "0 4px 20px rgba(0,0,0,0.3)"
              : "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          {isLoading ? (
            // Skeleton loading state
            <Box sx={{ pt: 4 }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={200}
                sx={{ borderRadius: 3, mb: 4 }}
              />
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={300}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={300}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Profile header with gradient background */}
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={3}
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    color: "text.primary",
                    position: "relative",
                    overflow: "hidden",
                    mb: 4,
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "url('/images/pattern.png')",
                      opacity: 0.05,
                      zIndex: 0,
                    },
                  }}
                >
                  <Grid
                    container
                    spacing={4}
                    alignItems="center"
                    sx={{ position: "relative", zIndex: 1 }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={3}
                      sx={{ textAlign: { xs: "center", md: "left" } }}
                    >
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        badgeContent={
                          <IconButton
                            size="small"
                            sx={{
                              bgcolor: "white",
                              "&:hover": { bgcolor: "grey.100" },
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                          >
                            <PhotoCameraIcon fontSize="small" color="primary" />
                          </IconButton>
                        }
                      >
                        <Avatar
                          sx={{
                            width: { xs: 100, md: 140 },
                            height: { xs: 100, md: 140 },
                            mx: { xs: "auto", md: 0 },
                            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                            border: "4px solid white",
                            bgcolor: "primary.light",
                            transition: "transform 0.3s ease-in-out",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          <AccountCircleIcon
                            sx={{ fontSize: { xs: 60, md: 80 } }}
                          />
                        </Avatar>
                      </Badge>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="h4"
                        component="h1"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                          color: "primary.main",
                          textShadow: "0 1px 1px rgba(0,0,0,0.05)",
                        }}
                      >
                        {user.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        paragraph
                      >
                        {user.email}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {user.bio}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <LocationOnIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "primary.main" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {user.location}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Bergabung sejak {user.joinedDate}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3} sx={{ textAlign: "right" }}>
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        color="primary"
                        sx={{
                          borderRadius: 8,
                          px: 3,
                          py: 1.2,
                          boxShadow: "0 4px 10px rgba(66, 99, 235, 0.2)",
                          textTransform: "none",
                          fontWeight: "bold",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 6px 15px rgba(66, 99, 235, 0.3)",
                          },
                        }}
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profil
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </motion.div>

              <Grid container spacing={4}>
                {/* Stats and navigation section */}
                <Grid item xs={12} md={4}>
                  <motion.div variants={itemVariants}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        height: "100%",
                        position: "relative",
                        overflow: "hidden",
                        background:
                          "linear-gradient(to bottom, #ffffff, #f8f9fa)",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                          transform: "translateY(-5px)",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ color: "primary.main" }}
                      >
                        Statistik Perjalanan
                      </Typography>
                      <Divider sx={{ mb: 3 }} />

                      <List disablePadding>
                        <ListItem
                          sx={{
                            px: 0,
                            py: 1.5,
                            transition: "transform 0.2s, background-color 0.2s",
                            borderRadius: 2,
                            "&:hover": {
                              transform: "translateX(5px)",
                              backgroundColor: "rgba(0,0,0,0.01)",
                            },
                          }}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                bgcolor: "rgba(66, 99, 235, 0.1)",
                                color: "primary.main",
                                boxShadow: "0 3px 6px rgba(0,0,0,0.05)",
                              }}
                            >
                              <FlightTakeoffIcon />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary="Trip Selesai"
                            secondary={user.trips}
                            primaryTypographyProps={{ fontWeight: 500 }}
                            secondaryTypographyProps={{
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                              color: "primary.main",
                            }}
                          />
                        </ListItem>

                        <ListItem
                          sx={{
                            px: 0,
                            py: 1.5,
                            transition: "transform 0.2s, background-color 0.2s",
                            borderRadius: 2,
                            "&:hover": {
                              transform: "translateX(5px)",
                              backgroundColor: "rgba(0,0,0,0.01)",
                            },
                          }}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                bgcolor: "rgba(237, 73, 86, 0.1)",
                                color: "error.main",
                                boxShadow: "0 3px 6px rgba(0,0,0,0.05)",
                              }}
                            >
                              <FavoriteIcon />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary="Favorit"
                            secondary={user.favoritesCount}
                            primaryTypographyProps={{ fontWeight: 500 }}
                            secondaryTypographyProps={{
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                              color: "error.main",
                            }}
                          />
                        </ListItem>

                        <ListItem
                          sx={{
                            px: 0,
                            py: 1.5,
                            transition: "transform 0.2s, background-color 0.2s",
                            borderRadius: 2,
                            "&:hover": {
                              transform: "translateX(5px)",
                              backgroundColor: "rgba(0,0,0,0.01)",
                            },
                          }}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                bgcolor: "rgba(3, 169, 244, 0.1)",
                                color: "info.main",
                                boxShadow: "0 3px 6px rgba(0,0,0,0.05)",
                              }}
                            >
                              <HistoryIcon />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary="Trip Direncanakan"
                            secondary={user.plannedTrips}
                            primaryTypographyProps={{ fontWeight: 500 }}
                            secondaryTypographyProps={{
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                              color: "info.main",
                            }}
                          />
                        </ListItem>
                      </List>

                      <Box sx={{ mt: 4 }}>
                        <Link
                          href="/explore"
                          passHref
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<MapIcon />}
                            sx={{
                              borderRadius: 8,
                              textTransform: "none",
                              py: 1.2,
                              mb: 2,
                              borderWidth: 2,
                              fontWeight: 600,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                borderWidth: 2,
                                transform: "translateY(-3px)",
                                boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                              },
                            }}
                          >
                            Eksplorasi Destinasi Baru
                          </Button>
                        </Link>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<SettingsIcon />}
                          sx={{
                            borderRadius: 8,
                            textTransform: "none",
                            py: 1.2,
                            borderWidth: 2,
                            color: "text.secondary",
                            borderColor: "divider",
                            fontWeight: 600,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              borderWidth: 2,
                              borderColor: "text.secondary",
                              transform: "translateY(-3px)",
                              boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
                            },
                          }}
                        >
                          Pengaturan Akun
                        </Button>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>

                <Grid item xs={12} md={8}>
                  {/* Recent trips section */}
                  <motion.div variants={itemVariants}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        mb: 4,
                        position: "relative",
                        overflow: "hidden",
                        background:
                          "linear-gradient(to bottom, #ffffff, #f8f9fa)",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ color: "primary.main" }}
                      >
                        Trip Terbaru
                      </Typography>
                      <Divider sx={{ mb: 3 }} />

                      {completedTrips.length > 0 ? (
                        <RecentTrips trips={completedTrips} />
                      ) : (
                        <Box sx={{ py: 4, textAlign: "center" }}>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph
                          >
                            Anda belum memiliki trip yang selesai
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ textAlign: "center", mt: 3 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            borderRadius: 8,
                            px: 3,
                            py: 1.2,
                            boxShadow: "0 4px 10px rgba(66, 99, 235, 0.2)",
                            textTransform: "none",
                            fontWeight: "bold",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-3px)",
                              boxShadow: "0 6px 15px rgba(66, 99, 235, 0.3)",
                            },
                          }}
                        >
                          Lihat Semua Trip
                        </Button>
                      </Box>
                    </Paper>
                  </motion.div>

                  {/* Favorites section */}
                  <motion.div variants={itemVariants}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background:
                          "linear-gradient(to bottom, #ffffff, #f8f9fa)",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ color: "primary.main" }}
                      >
                        Destinasi Favorit
                      </Typography>
                      <Divider sx={{ mb: 3 }} />

                      {favorites && favorites.length > 0 ? (
                        <Grid container spacing={2}>
                          {favorites.slice(0, 3).map((place, index) => (
                            <PlaceCard
                              key={place.id}
                              place={place}
                              delay={index * 0.1}
                            />
                          ))}
                        </Grid>
                      ) : (
                        <Box sx={{ py: 4, textAlign: "center" }}>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph
                          >
                            Anda belum menambahkan destinasi favorit
                          </Typography>
                          <Link
                            href="/explore"
                            passHref
                            style={{ textDecoration: "none" }}
                          >
                            <Button
                              variant="outlined"
                              color="primary"
                              startIcon={<FavoriteIcon />}
                              sx={{
                                borderRadius: 8,
                                textTransform: "none",
                                py: 1.2,
                                borderWidth: 2,
                                fontWeight: 600,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  borderWidth: 2,
                                  transform: "translateY(-3px)",
                                  boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                                },
                              }}
                            >
                              Jelajahi Destinasi
                            </Button>
                          </Link>
                        </Box>
                      )}

                      {favorites && favorites.length > 0 && (
                        <Box sx={{ textAlign: "center", mt: 3 }}>
                          <Button
                            variant="outlined"
                            color="primary"
                            sx={{
                              borderRadius: 8,
                              px: 3,
                              py: 1.2,
                              textTransform: "none",
                              borderWidth: 2,
                              fontWeight: 600,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                borderWidth: 2,
                                transform: "translateY(-3px)",
                                boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                              },
                            }}
                          >
                            Lihat Semua Favorit
                          </Button>
                        </Box>
                      )}
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
