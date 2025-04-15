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
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useTrip } from "../context/TripContext";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { Place, places } from "../data/places";
import ScrollToTopButton from "@/app/components/ScrollToTopButton";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

// Trip type definition
interface Trip {
  destination: string;
  date: string;
}

// Component to render a place card with animation
const PlaceCard = ({ place, delay = 0 }: { place: Place; delay?: number }) => {
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Grid item xs={12} sm={6} md={4} key={place.id}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay }}
        whileHover={{ scale: 1.03 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.3s, box-shadow 0.3s",
            transform: isHovered ? "translateY(-8px)" : "translateY(0)",
            boxShadow: isHovered
              ? isDarkMode
                ? "0 12px 20px rgba(120,120,255,0.3)"
                : "0 12px 24px rgba(66,99,235,0.25)"
              : isDarkMode
              ? "0 4px 20px rgba(120,120,255,0.15)"
              : "0 4px 16px rgba(66,99,235,0.12)",
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: isDarkMode ? "#2a2a3a" : "#ffffff",
            position: "relative",
            border: isDarkMode ? "none" : "1px solid rgba(228,233,247,0.7)",
          }}
        >
          <CardMedia
            component="img"
            height="140"
            image={place.image}
            alt={place.name}
            sx={{
              objectFit: "cover",
              transition: "transform 0.5s",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="div"
              gutterBottom
              noWrap
              sx={{
                color: isDarkMode ? "#ffffff" : "#1e293b",
                fontWeight: 600,
              }}
            >
              {place.name}
            </Typography>
            <Typography
              variant="body2"
              color={
                isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(30,41,59,0.7)"
              }
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
                sx={{ mr: 0.5, color: isDarkMode ? "#8c9eff" : "#4263eb" }}
              />
              <Typography
                variant="caption"
                color={
                  isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(30,41,59,0.6)"
                }
                noWrap
              >
                {place.address || "Indonesia"}
              </Typography>
            </Box>

            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    mt: 1,
                    color: isDarkMode ? "#8c9eff" : "#4263eb",
                    "&:hover": {
                      backgroundColor: isDarkMode
                        ? "rgba(140,158,255,0.08)"
                        : "rgba(66,99,235,0.08)",
                    },
                    textTransform: "none",
                  }}
                >
                  Lihat Detail
                </Button>
              </motion.div>
            )}
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
              bgcolor: isDarkMode ? "#2a2a3a" : "#ffffff",
              borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#e9effd",
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: isDarkMode
                  ? "0 10px 20px rgba(120,120,255,0.15)"
                  : "0 10px 20px rgba(66,99,235,0.12)",
              },
              "&:before": {
                content: '""',
                position: "absolute",
                left: isMobile ? "-8px" : "-12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: isMobile ? "16px" : "24px",
                height: isMobile ? "16px" : "24px",
                backgroundColor: isDarkMode ? "#8c9eff" : "#4263eb",
                borderRadius: "50%",
                zIndex: 1,
                boxShadow: isDarkMode
                  ? "0 0 0 4px #1e1e1e"
                  : "0 0 0 4px white, 0 4px 8px rgba(66,99,235,0.2)",
              },
            }}
          >
            <CardContent>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} sm={7}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      color: isDarkMode ? "#ffffff" : "#1e293b",
                      fontWeight: 600,
                    }}
                  >
                    {trip.destination}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={
                      isDarkMode
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(30,41,59,0.7)"
                    }
                  >
                    {trip.date}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={5} sx={{ textAlign: "right" }}>
                  <Chip
                    label="Selesai"
                    color="success"
                    size="small"
                    sx={{
                      fontWeight: 500,
                      bgcolor: isDarkMode ? "#2e7d32" : "#e6f7e9",
                      color: isDarkMode ? "#ffffff" : "#2e7d32",
                    }}
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

// Achievement badge component
const AchievementBadge = ({
  title,
  icon,
  count,
  color,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  color: string;
}) => {
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";

  return (
    <Tooltip title={`${title}: ${count}`} arrow placement="top">
      <Box
        sx={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          m: 1,
        }}
      >
        <Avatar
          sx={{
            width: 50,
            height: 50,
            bgcolor: isDarkMode ? `${color}22` : `${color}15`,
            color: color,
            mb: 1,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: `0 4px 12px ${color}33`,
            },
          }}
        >
          {icon}
        </Avatar>
        <Typography
          variant="caption"
          align="center"
          sx={{
            color: isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(30,41,59,0.7)",
          }}
        >
          {count}
        </Typography>
      </Box>
    </Tooltip>
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
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

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
        bgcolor: isDarkMode ? "#121212" : "#f8faff",
        position: "relative",
      }}
    >
      <Navbar />

      {/* Progress bar */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: isDarkMode ? "#8c9eff" : "#4263eb",
          scaleX,
          transformOrigin: "0%",
          zIndex: 1000,
        }}
      />

      <Container maxWidth="lg" sx={{ pt: 12, pb: 6 }}>
        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: 4,
            bgcolor: isDarkMode ? "#1e1e1e" : "#ffffff",
            boxShadow: isDarkMode
              ? "0 4px 20px rgba(120,120,255,0.15)"
              : "0 4px 20px rgba(66,99,235,0.08)",
          }}
        >
          {isLoading ? (
            // Enhanced skeleton loading state that better matches content
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Skeleton variant="circular" width={140} height={140} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Skeleton
                    variant="text"
                    height={60}
                    width="70%"
                    sx={{ mb: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    height={30}
                    width="50%"
                    sx={{ mb: 2 }}
                  />
                  <Skeleton variant="text" height={20} width="90%" />
                  <Skeleton
                    variant="text"
                    height={20}
                    width="80%"
                    sx={{ mb: 2 }}
                  />
                  <Skeleton variant="text" height={16} width="40%" />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width={120}
                    height={50}
                    sx={{ borderRadius: 8 }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={4} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <Skeleton
                    variant="rectangular"
                    height={300}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Skeleton
                    variant="rectangular"
                    height={100}
                    sx={{ borderRadius: 3, mb: 2 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={100}
                    sx={{ borderRadius: 3, mb: 2 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={100}
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
                    background: isDarkMode
                      ? "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)"
                      : "linear-gradient(135deg, #e0eaff 0%, #c5d6ff 100%)",
                    color: isDarkMode ? "#ffffff" : "#1e293b",
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
                      opacity: isDarkMode ? 0.03 : 0.08,
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
                          <Tooltip title="Ubah Foto Profil" arrow>
                            <IconButton
                              size="small"
                              aria-label="Change profile picture"
                              sx={{
                                bgcolor: isDarkMode ? "#2a2a3a" : "white",
                                "&:hover": {
                                  bgcolor: isDarkMode ? "#3a3a4a" : "#f0f4ff",
                                  transform: "scale(1.1)",
                                },
                                boxShadow: isDarkMode
                                  ? "0 2px 8px rgba(0,0,0,0.3)"
                                  : "0 2px 8px rgba(66,99,235,0.15)",
                                transition: "all 0.2s ease",
                              }}
                            >
                              <PhotoCameraIcon
                                fontSize="small"
                                sx={{
                                  color: isDarkMode ? "#8c9eff" : "#4263eb",
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                        }
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Avatar
                            sx={{
                              width: { xs: 100, md: 140 },
                              height: { xs: 100, md: 140 },
                              mx: { xs: "auto", md: 0 },
                              boxShadow: isDarkMode
                                ? "0 8px 24px rgba(120,120,255,0.2)"
                                : "0 8px 24px rgba(66,99,235,0.15)",
                              border: isDarkMode
                                ? "4px solid #2a2a3a"
                                : "4px solid white",
                              bgcolor: isDarkMode ? "#3f51b5" : "#4263eb",
                            }}
                          >
                            <AccountCircleIcon
                              sx={{
                                fontSize: { xs: 60, md: 80 },
                                color: "#ffffff",
                              }}
                            />
                          </Avatar>
                        </motion.div>
                      </Badge>

                      {/* Verification badge */}
                      <Box sx={{ mt: 1, textAlign: "center" }}>
                        <Chip
                          icon={<VerifiedUserIcon fontSize="small" />}
                          label="Terverifikasi"
                          size="small"
                          sx={{
                            bgcolor: isDarkMode
                              ? "rgba(140,158,255,0.1)"
                              : "rgba(66,99,235,0.1)",
                            color: isDarkMode ? "#8c9eff" : "#4263eb",
                            fontWeight: 500,
                            border: `1px solid ${
                              isDarkMode
                                ? "rgba(140,158,255,0.3)"
                                : "rgba(66,99,235,0.3)"
                            }`,
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="h4"
                        component="h1"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                          color: isDarkMode ? "#8c9eff" : "#4263eb",
                          textShadow: isDarkMode
                            ? "0 1px 2px rgba(0,0,0,0.3)"
                            : "0 1px 1px rgba(66,99,235,0.1)",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {user.name}
                        <Tooltip title="Akun Premium" arrow>
                          <CheckCircleIcon
                            sx={{ color: "#FFD700", fontSize: "0.8em" }}
                          />
                        </Tooltip>
                      </Typography>
                      <Typography
                        variant="body1"
                        color={
                          isDarkMode
                            ? "rgba(255,255,255,0.8)"
                            : "rgba(30,41,59,0.8)"
                        }
                        paragraph
                      >
                        {user.email}
                      </Typography>
                      <Typography
                        variant="body2"
                        paragraph
                        sx={{
                          color: isDarkMode
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(30,41,59,0.9)",
                          lineHeight: 1.6,
                        }}
                      >
                        {user.bio}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <LocationOnIcon
                          fontSize="small"
                          sx={{
                            mr: 1,
                            color: isDarkMode ? "#8c9eff" : "#4263eb",
                          }}
                        />
                        <Typography
                          variant="body2"
                          color={
                            isDarkMode
                              ? "rgba(255,255,255,0.7)"
                              : "rgba(30,41,59,0.7)"
                          }
                        >
                          {user.location}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        color={
                          isDarkMode
                            ? "rgba(255,255,255,0.6)"
                            : "rgba(30,41,59,0.6)"
                        }
                      >
                        Bergabung sejak {user.joinedDate}
                      </Typography>

                      {/* Achievement badges */}
                      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
                        <AchievementBadge
                          title="Expert Traveler"
                          icon={<EmojiEventsIcon />}
                          count={user.trips}
                          color={isDarkMode ? "#FFD700" : "#FFB900"}
                        />
                        <AchievementBadge
                          title="Destination Connoisseur"
                          icon={<FavoriteIcon />}
                          count={user.favoritesCount}
                          color={isDarkMode ? "#ff8080" : "#e64646"}
                        />
                        <AchievementBadge
                          title="Trip Planner"
                          icon={<FlightTakeoffIcon />}
                          count={user.plannedTrips}
                          color={isDarkMode ? "#80c8ff" : "#0398de"}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={3} sx={{ textAlign: "right" }}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="contained"
                          startIcon={<EditIcon />}
                          color="primary"
                          sx={{
                            borderRadius: 8,
                            px: 3,
                            py: 1.2,
                            boxShadow: isDarkMode
                              ? "0 4px 10px rgba(140,158,255,0.3)"
                              : "0 4px 10px rgba(66,99,235,0.2)",
                            textTransform: "none",
                            fontWeight: "bold",
                            bgcolor: isDarkMode ? "#8c9eff" : "#4263eb",
                            color: isDarkMode ? "#1a1a2a" : "#ffffff",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-3px)",
                              bgcolor: isDarkMode ? "#a5b4ff" : "#3651d4",
                              boxShadow: isDarkMode
                                ? "0 6px 15px rgba(140,158,255,0.4)"
                                : "0 6px 15px rgba(66,99,235,0.3)",
                            },
                            "&:focus": {
                              outline: `3px solid ${
                                isDarkMode
                                  ? "rgba(140,158,255,0.4)"
                                  : "rgba(66,99,235,0.3)"
                              }`,
                              outlineOffset: 2,
                            },
                          }}
                          onClick={() => setIsEditing(true)}
                        >
                          Edit Profil
                        </Button>
                      </motion.div>

                      <Tooltip
                        title="Pengaturan Aksesibilitas"
                        arrow
                        placement="left"
                      >
                        <IconButton
                          aria-label="Accessibility settings"
                          sx={{
                            mt: 2,
                            bgcolor: isDarkMode
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.05)",
                            "&:hover": {
                              bgcolor: isDarkMode
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.08)",
                            },
                          }}
                        >
                          <AccessibilityIcon
                            fontSize="small"
                            sx={{
                              color: isDarkMode
                                ? "rgba(255,255,255,0.7)"
                                : "rgba(0,0,0,0.7)",
                            }}
                          />
                        </IconButton>
                      </Tooltip>
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
                        background: isDarkMode
                          ? "linear-gradient(to bottom, #2a2a3a, #1e1e2e)"
                          : "linear-gradient(to bottom, #ffffff, #f5f8ff)",
                        boxShadow: isDarkMode
                          ? "0 5px 15px rgba(120,120,255,0.1)"
                          : "0 5px 15px rgba(66,99,235,0.08)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          boxShadow: isDarkMode
                            ? "0 8px 20px rgba(120,120,255,0.15)"
                            : "0 8px 20px rgba(66,99,235,0.12)",
                          transform: "translateY(-5px)",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ color: isDarkMode ? "#8c9eff" : "#4263eb" }}
                      >
                        Statistik Perjalanan
                      </Typography>
                      <Divider
                        sx={{
                          mb: 3,
                          borderColor: isDarkMode
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(66,99,235,0.15)",
                        }}
                      />

                      <List disablePadding>
                        <ListItem
                          sx={{
                            px: 0,
                            py: 1.5,
                            transition: "transform 0.2s, background-color 0.2s",
                            borderRadius: 2,
                            "&:hover": {
                              transform: "translateX(5px)",
                              backgroundColor: isDarkMode
                                ? "rgba(255,255,255,0.03)"
                                : "rgba(66,99,235,0.03)",
                            },
                          }}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                bgcolor: isDarkMode
                                  ? "rgba(140,158,255,0.15)"
                                  : "rgba(66,99,235,0.1)",
                                color: isDarkMode ? "#8c9eff" : "#4263eb",
                                boxShadow: isDarkMode
                                  ? "0 3px 6px rgba(0,0,0,0.2)"
                                  : "0 3px 6px rgba(66,99,235,0.15)",
                              }}
                            >
                              <FlightTakeoffIcon />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary="Trip Selesai"
                            secondary={user.trips}
                            primaryTypographyProps={{
                              fontWeight: 500,
                              color: isDarkMode
                                ? "rgba(255,255,255,0.9)"
                                : "rgba(30,41,59,0.9)",
                            }}
                            secondaryTypographyProps={{
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                              color: isDarkMode ? "#8c9eff" : "#4263eb",
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
                              backgroundColor: isDarkMode
                                ? "rgba(255,255,255,0.03)"
                                : "rgba(235,66,66,0.03)",
                            },
                          }}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                bgcolor: isDarkMode
                                  ? "rgba(255,128,128,0.15)"
                                  : "rgba(235,66,66,0.1)",
                                color: isDarkMode ? "#ff8080" : "#e64646",
                                boxShadow: isDarkMode
                                  ? "0 3px 6px rgba(0,0,0,0.2)"
                                  : "0 3px 6px rgba(235,66,66,0.15)",
                              }}
                            >
                              <FavoriteIcon />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary="Favorit"
                            secondary={user.favoritesCount}
                            primaryTypographyProps={{
                              fontWeight: 500,
                              color: isDarkMode
                                ? "rgba(255,255,255,0.9)"
                                : "rgba(30,41,59,0.9)",
                            }}
                            secondaryTypographyProps={{
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                              color: isDarkMode ? "#ff8080" : "#e64646",
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
                              backgroundColor: isDarkMode
                                ? "rgba(255,255,255,0.03)"
                                : "rgba(3,169,244,0.03)",
                            },
                          }}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                bgcolor: isDarkMode
                                  ? "rgba(80,200,255,0.15)"
                                  : "rgba(3,169,244,0.1)",
                                color: isDarkMode ? "#80c8ff" : "#0398de",
                                boxShadow: isDarkMode
                                  ? "0 3px 6px rgba(0,0,0,0.2)"
                                  : "0 3px 6px rgba(3,169,244,0.15)",
                              }}
                            >
                              <HistoryIcon />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary="Trip Direncanakan"
                            secondary={user.plannedTrips}
                            primaryTypographyProps={{
                              fontWeight: 500,
                              color: isDarkMode
                                ? "rgba(255,255,255,0.9)"
                                : "rgba(30,41,59,0.9)",
                            }}
                            secondaryTypographyProps={{
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                              color: isDarkMode ? "#80c8ff" : "#0398de",
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
                              color: isDarkMode ? "#8c9eff" : "#4263eb",
                              borderColor: isDarkMode ? "#8c9eff" : "#4263eb",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                borderWidth: 2,
                                borderColor: isDarkMode ? "#a5b4ff" : "#3651d4",
                                color: isDarkMode ? "#a5b4ff" : "#3651d4",
                                transform: "translateY(-3px)",
                                bgcolor: isDarkMode
                                  ? "rgba(140,158,255,0.05)"
                                  : "rgba(66,99,235,0.05)",
                                boxShadow: isDarkMode
                                  ? "0 6px 15px rgba(140,158,255,0.2)"
                                  : "0 6px 15px rgba(66,99,235,0.15)",
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
                            color: isDarkMode
                              ? "rgba(255,255,255,0.7)"
                              : "rgba(30,41,59,0.7)",
                            borderColor: isDarkMode
                              ? "rgba(255,255,255,0.2)"
                              : "rgba(30,41,59,0.2)",
                            fontWeight: 600,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              borderWidth: 2,
                              borderColor: isDarkMode
                                ? "rgba(255,255,255,0.3)"
                                : "rgba(30,41,59,0.4)",
                              color: isDarkMode
                                ? "rgba(255,255,255,0.9)"
                                : "rgba(30,41,59,0.9)",
                              transform: "translateY(-3px)",
                              bgcolor: isDarkMode
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(30,41,59,0.03)",
                              boxShadow: isDarkMode
                                ? "0 6px 15px rgba(255,255,255,0.05)"
                                : "0 6px 15px rgba(0,0,0,0.05)",
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
                        background: isDarkMode
                          ? "linear-gradient(to bottom, #2a2a3a, #1e1e2e)"
                          : "linear-gradient(to bottom, #ffffff, #f5f8ff)",
                        boxShadow: isDarkMode
                          ? "0 5px 15px rgba(120,120,255,0.1)"
                          : "0 5px 15px rgba(66,99,235,0.08)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          boxShadow: isDarkMode
                            ? "0 8px 20px rgba(120,120,255,0.15)"
                            : "0 8px 20px rgba(66,99,235,0.12)",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ color: isDarkMode ? "#8c9eff" : "#4263eb" }}
                      >
                        Trip Terbaru
                      </Typography>
                      <Divider
                        sx={{
                          mb: 3,
                          borderColor: isDarkMode
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(66,99,235,0.15)",
                        }}
                      />

                      {completedTrips.length > 0 ? (
                        <RecentTrips trips={completedTrips} />
                      ) : (
                        <Box sx={{ py: 4, textAlign: "center" }}>
                          <Typography
                            variant="body1"
                            color={
                              isDarkMode
                                ? "rgba(255,255,255,0.7)"
                                : "rgba(30,41,59,0.7)"
                            }
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
                            boxShadow: isDarkMode
                              ? "0 4px 10px rgba(140,158,255,0.3)"
                              : "0 4px 10px rgba(66,99,235,0.2)",
                            textTransform: "none",
                            fontWeight: "bold",
                            bgcolor: isDarkMode ? "#8c9eff" : "#4263eb",
                            color: isDarkMode ? "#1a1a2a" : "#ffffff",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-3px)",
                              bgcolor: isDarkMode ? "#a5b4ff" : "#3651d4",
                              boxShadow: isDarkMode
                                ? "0 6px 15px rgba(140,158,255,0.4)"
                                : "0 6px 15px rgba(66,99,235,0.3)",
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
                        background: isDarkMode
                          ? "linear-gradient(to bottom, #2a2a3a, #1e1e2e)"
                          : "linear-gradient(to bottom, #ffffff, #f5f8ff)",
                        boxShadow: isDarkMode
                          ? "0 5px 15px rgba(120,120,255,0.1)"
                          : "0 5px 15px rgba(66,99,235,0.08)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          boxShadow: isDarkMode
                            ? "0 8px 20px rgba(120,120,255,0.15)"
                            : "0 8px 20px rgba(66,99,235,0.12)",
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ color: isDarkMode ? "#8c9eff" : "#4263eb" }}
                      >
                        Destinasi Favorit
                      </Typography>
                      <Divider
                        sx={{
                          mb: 3,
                          borderColor: isDarkMode
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(66,99,235,0.15)",
                        }}
                      />

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
                            color={
                              isDarkMode
                                ? "rgba(255,255,255,0.7)"
                                : "rgba(30,41,59,0.7)"
                            }
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
                                color: isDarkMode ? "#8c9eff" : "#4263eb",
                                borderColor: isDarkMode ? "#8c9eff" : "#4263eb",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  borderWidth: 2,
                                  borderColor: isDarkMode
                                    ? "#a5b4ff"
                                    : "#3651d4",
                                  color: isDarkMode ? "#a5b4ff" : "#3651d4",
                                  transform: "translateY(-3px)",
                                  bgcolor: isDarkMode
                                    ? "rgba(140,158,255,0.05)"
                                    : "rgba(66,99,235,0.05)",
                                  boxShadow: isDarkMode
                                    ? "0 6px 15px rgba(140,158,255,0.2)"
                                    : "0 6px 15px rgba(66,99,235,0.15)",
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
                              color: isDarkMode ? "#8c9eff" : "#4263eb",
                              borderColor: isDarkMode ? "#8c9eff" : "#4263eb",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                borderWidth: 2,
                                borderColor: isDarkMode ? "#a5b4ff" : "#3651d4",
                                color: isDarkMode ? "#a5b4ff" : "#3651d4",
                                transform: "translateY(-3px)",
                                bgcolor: isDarkMode
                                  ? "rgba(140,158,255,0.05)"
                                  : "rgba(66,99,235,0.05)",
                                boxShadow: isDarkMode
                                  ? "0 6px 15px rgba(140,158,255,0.2)"
                                  : "0 6px 15px rgba(66,99,235,0.15)",
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

      {/* Scroll to top button */}
      <ScrollToTopButton isDarkMode={isDarkMode} />
    </Box>
  );
}
