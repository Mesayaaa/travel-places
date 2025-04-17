"use client";

import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Fade,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { motion, useInView, useReducedMotion } from "framer-motion";
import PlaceCard from "./components/PlaceCard";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { places } from "./data/places";
import { useRef, useState, useEffect, Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CategoryFilter from "./components/CategoryFilter";
import AddIcon from "@mui/icons-material/Add";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TextField from "@mui/material/TextField";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SendIcon from "@mui/icons-material/Send";
import Link from "@mui/material/Link";
import { useTrip } from "./context/TripContext";
import { useTheme } from "./context/ThemeContext";
import { isLowEndDevice } from "./utils/deviceUtils";

// Lazy load komponen berat untuk perangkat mobile
const TripPlanModal = lazy(() => import("./components/TripPlanModal"));
const TripPlansList = lazy(() => import("./components/TripPlansList"));

// Fallback sederhana untuk lazy loading
const SimpleFallback = () => (
  <Box sx={{ p: 2, textAlign: "center" }}>
    <Typography>Loading...</Typography>
  </Box>
);

// Simplified animation variants for better mobile performance
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
    },
  },
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPlaces, setFilteredPlaces] = useState(places);
  const [activeCategory, setActiveCategory] = useState("all");
  const [tripPlansRefreshKey, setTripPlansRefreshKey] = useState(0);
  const { openTripPlanModal, setOpenTripPlanModal } = useTrip();
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";
  const isMobile = useMediaQuery("(max-width:768px)");
  const isLowEnd = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const destinationsRef = useRef(null);
  const planSectionRef = useRef(null);
  const isDestinationsInView = useInView(destinationsRef, {
    once: true,
    amount: 0.1,
  });
  const isPlanSectionInView = useInView(planSectionRef, {
    once: true,
    amount: 0.1,
  });

  // Cek apakah perangkat adalah low-end device
  useEffect(() => {
    if (typeof window !== "undefined") {
      isLowEnd.current = isLowEndDevice();
    }
  }, []);

  // Filter places by category
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredPlaces(places);
    } else {
      setFilteredPlaces(
        places.filter((place) => place.category === activeCategory)
      );
    }
  }, [activeCategory]);

  // Simulate loading state with shorter duration for mobile
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsLoading(false);
      },
      isMobile || isLowEnd.current ? 500 : 1000
    );

    return () => clearTimeout(timer);
  }, [isMobile]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Handle trip plan modal close and trigger refresh
  const handleTripPlanModalClose = () => {
    setOpenTripPlanModal(false);
    setTripPlansRefreshKey((prev) => prev + 1);
  };

  // Get animation props based on device and user preferences
  const getAnimationProps = () => {
    if (isMobile || prefersReducedMotion || isLowEnd.current) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 },
      };
    }

    return {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.2 },
      transition: { duration: 0.6 },
    };
  };

  // Batasi jumlah item yang ditampilkan di perangkat low-end
  const getPlacesToShow = () => {
    if (isLowEnd.current) {
      // Batasi ke 8 item untuk perangkat low-end
      return filteredPlaces.slice(0, 8);
    }
    return filteredPlaces;
  };

  return (
    <Box
      sx={{
        background: isDarkMode
          ? "linear-gradient(to bottom, #121212, #1a1a1a)"
          : "linear-gradient(to bottom, #f8f9fa, #e9ecef)",
        overflowX: "hidden",
      }}
    >
      <Navbar />
      <HeroSection />

      <CategoryFilter onCategoryChange={handleCategoryChange} />

      <Box
        component="section"
        id="categories"
        ref={destinationsRef}
        sx={{
          pt: { xs: 0, md: 0 },
          pb: { xs: 4, md: 6 },
          background: isDarkMode
            ? "linear-gradient(to bottom, #121212, #1e1e1e)"
            : "linear-gradient(to bottom, #f8f9fa, #f0f2f5)",
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <motion.div
            variants={container}
            initial="hidden"
            animate={isDestinationsInView ? "show" : "hidden"}
            style={{ perspective: isLowEnd.current ? "none" : "1000px" }}
          >
            <Grid
              container
              spacing={{ xs: 2, sm: 3, md: 4 }}
              columns={{ xs: 12, sm: 12, md: 12 }}
              sx={{
                mx: "auto",
                maxWidth: "1600px",
              }}
            >
              {isLoading
                ? Array.from(new Array(6)).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <LoadingSkeleton />
                    </Grid>
                  ))
                : getPlacesToShow().map((place, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={place.id}
                      component={motion.div}
                      variants={item}
                      custom={index}
                      className="offscreen-content"
                    >
                      <motion.div
                        whileHover={
                          !isMobile && !isLowEnd.current
                            ? {
                                scale: 1.03,
                                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                              }
                            : undefined
                        }
                        transition={{
                          type: "tween",
                          duration: 0.2,
                        }}
                        style={{
                          borderRadius: "28px",
                          overflow: "hidden",
                        }}
                      >
                        <PlaceCard place={place} />
                      </motion.div>
                    </Grid>
                  ))}
            </Grid>
          </motion.div>

          {!isLoading && filteredPlaces.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                px: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: isDarkMode ? "text.secondary" : "text.primary",
                  mb: 2,
                }}
              >
                Tidak ada tempat yang ditemukan
              </Typography>
              <Button
                variant="contained"
                onClick={() => setActiveCategory("all")}
                sx={{
                  bgcolor: isDarkMode ? "primary.dark" : "primary.main",
                  "&:hover": {
                    bgcolor: isDarkMode ? "primary.main" : "primary.dark",
                  },
                }}
              >
                Lihat Semua Tempat
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* Lazy loaded components */}
      <Suspense fallback={<SimpleFallback />}>
        {openTripPlanModal && (
          <TripPlanModal
            open={openTripPlanModal}
            onClose={handleTripPlanModalClose}
          />
        )}
      </Suspense>

      {/* Trip plans section - always visible */}
      <Box
        component="section"
        ref={planSectionRef}
        id="trip-plans"
        sx={{
          py: { xs: 4, md: 6 },
          background: isDarkMode
            ? "linear-gradient(to top, #121212, #1e1e1e)"
            : "linear-gradient(to top, #f8f9fa, #f0f2f5)",
        }}
      >
        <Container maxWidth="xl">
          <Suspense fallback={<SimpleFallback />}>
            <TripPlansList key={tripPlansRefreshKey} />
          </Suspense>
        </Container>
      </Box>

      {/* Footer section - simplified for mobile devices */}
      <Box
        component="footer"
        sx={{
          py: { xs: 3, sm: 4, md: 6 },
          px: { xs: 2, sm: 3, md: 4 },
          background: isDarkMode ? "#121212" : "#f8f9fa",
          color: isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h6"
            component="h4"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Travel Places
          </Typography>

          {/* Display simplified footer on mobile / low-end devices */}
          {!isLowEnd.current && !isMobile && (
            <Grid container spacing={3} justifyContent="center" sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Contact
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <EmailIcon fontSize="small" />
                    <Typography variant="body2">
                      info@travelplaces.com
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PhoneIcon fontSize="small" />
                    <Typography variant="body2">+1 234 567 890</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <LocationOnIcon fontSize="small" />
                    <Typography variant="body2">Jakarta, Indonesia</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}

          <Typography variant="body2" sx={{ mt: 2 }}>
            © {new Date().getFullYear()} Travel Places. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
