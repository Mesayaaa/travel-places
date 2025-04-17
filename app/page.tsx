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
  Alert,
  Collapse,
  Paper,
  Chip,
} from "@mui/material";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect, Suspense, lazy } from "react";
import Link from "@mui/material/Link";
import { useTrip } from "./context/TripContext";
import { useTheme } from "./context/ThemeContext";
import { isLowEndDevice } from "./utils/deviceUtils";
import CloseIcon from "@mui/icons-material/Close";

// Import basic components directly for immediate rendering
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CategoryFilter from "./components/CategoryFilter";
import LoadingSkeleton from "./components/LoadingSkeleton";

// Lazy load components to reduce initial bundle size
const PlaceCard = lazy(() => import("./components/PlaceCard"));
const TripPlanModal = lazy(() => import("./components/TripPlanModal"));
const TripPlansList = lazy(() => import("./components/TripPlansList"));

// Type declaration for the navigator connection
declare global {
  interface Navigator {
    connection?: {
      saveData?: boolean;
      effectiveType?: string;
      downlink?: number;
    };
  }
}

// Simplified fallback for lazy loading
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
      staggerChildren: 0.05, // Reduced for better performance
    },
  },
};

const item = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.2, // Faster animation for mobile
    },
  },
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPlaces, setFilteredPlaces] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [tripPlansRefreshKey, setTripPlansRefreshKey] = useState(0);
  const { openTripPlanModal, setOpenTripPlanModal, placesInTrip } = useTrip();
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";
  const isMobile = useMediaQuery("(max-width:768px)");
  const isLowEnd = useRef(false);
  const isDataSaver = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const destinationsRef = useRef<HTMLElement | null>(null);
  const planSectionRef = useRef(null);
  const isDestinationsInView = useInView(destinationsRef, {
    once: true,
    amount: 0.1,
  });
  const isPlanSectionInView = useInView(planSectionRef, {
    once: true,
    amount: 0.1,
  });

  // Load places data on mount with delay for mobile
  useEffect(() => {
    // Check device capabilities
    if (typeof window !== "undefined") {
      isLowEnd.current = isLowEndDevice();

      // Check for data saver mode
      if (navigator.connection && "saveData" in navigator.connection) {
        isDataSaver.current = !!navigator.connection.saveData;
      } else {
        isDataSaver.current = localStorage.getItem("dataSaver") === "true";
      }

      // Load places data with a slight delay for mobile
      const timer = setTimeout(() => {
        import("./data/places").then((module) => {
          setPlaces(module.places);
          setFilteredPlaces(module.places);
          setIsLoading(false);
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  // Filter places by category
  useEffect(() => {
    if (!places.length) return;

    if (activeCategory === "all") {
      setFilteredPlaces(places);
    } else {
      setFilteredPlaces(
        places.filter((place) => place.category === activeCategory)
      );
    }
  }, [activeCategory, places]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Handle trip plan modal close and trigger refresh
  const handleTripPlanModalClose = () => {
    setOpenTripPlanModal(false);
    setTripPlansRefreshKey((prev) => prev + 1);
  };

  // Add a function to consistently scroll to destinations section
  const scrollToDestinations = () => {
    const destinationsSection = document.querySelector("#categories");
    if (destinationsSection) {
      const yOffset = -60; // Small offset to ensure the section is clearly visible
      const y =
        destinationsSection.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  // Update the handleTripPlanButtonClick function
  const handleTripPlanButtonClick = () => {
    if (placesInTrip.length > 0) {
      // If places have been added to the trip, open the modal
      setOpenTripPlanModal(true);
    } else {
      // If no places have been added, scroll to the destinations section
      scrollToDestinations();
    }
  };

  // Get animation props based on device and user preferences
  const getAnimationProps = () => {
    if (isMobile || prefersReducedMotion || isLowEnd.current) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      };
    }

    return {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.2 },
      transition: { duration: 0.5 },
    };
  };

  // Limit number of items shown on low-end devices
  const getPlacesToShow = () => {
    if (isLowEnd.current || isDataSaver.current) {
      // Limit to 6 items for low-end devices or data saver mode
      return filteredPlaces.slice(0, 6);
    }
    if (isMobile) {
      // Limit to 8 items for mobile devices
      return filteredPlaces.slice(0, 8);
    }
    return filteredPlaces;
  };

  // Simplified rendering for low-end devices
  const renderPlaceCards = () => {
    const placesToShow = getPlacesToShow();

    if (isLoading) {
      // Show fewer skeletons on mobile/low-end devices
      const skeletonCount = isMobile || isLowEnd.current ? 2 : 4;
      return Array(skeletonCount)
        .fill(0)
        .map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
            <LoadingSkeleton />
          </Grid>
        ));
    }

    return placesToShow.map((place, index) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={place.id}>
        <motion.div
          variants={item}
          // Disable hover animations on low-end devices
          whileHover={isLowEnd.current ? {} : { scale: 1.02 }}
          transition={{ type: "tween", duration: 0.2 }}
        >
          <Suspense fallback={<LoadingSkeleton />}>
            <PlaceCard place={place} />
          </Suspense>
        </motion.div>
      </Grid>
    ));
  };

  return (
    <Box
      sx={{
        background: isDarkMode
          ? "linear-gradient(to bottom, #121212, #1a1a1a)"
          : "linear-gradient(to bottom, #f8f9fa, #e9ecef)",
        overflowX: "hidden",
        position: "relative", // Add this for absolute positioned elements
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
          mt: { xs: -3, md: 0 }, // Reduce top margin on mobile to bring close to CategoryFilter
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
              spacing={{ xs: 1.5, sm: 2, md: 3 }}
              columns={{ xs: 12, sm: 12, md: 12 }}
              sx={{
                mx: "auto",
                maxWidth: "1600px",
                mt: { xs: 0.5, sm: 1, md: 2 }, // Reduced top margin on mobile
              }}
            >
              {renderPlaceCards()}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Trip Planning Section - only load when in view */}
      <Suspense fallback={<SimpleFallback />}>
        {!isLowEnd.current && (
          <Box
            component="section"
            id="plan"
            ref={planSectionRef}
            sx={{
              py: { xs: 6, md: 8 },
              background: isDarkMode
                ? "linear-gradient(to bottom, #1e1e1e, #262626)"
                : "linear-gradient(to bottom, #f0f2f5, #e6e9ec)",
            }}
          >
            <Container>
              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} md={10} lg={8}>
                  <Typography
                    variant="h4"
                    component="h2"
                    align="center"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      mb: 4,
                      fontSize: { xs: "1.75rem", md: "2.5rem" },
                      color: isDarkMode ? "white" : "black",
                    }}
                  >
                    Rencana Perjalanan Anda
                  </Typography>

                  <motion.div
                    {...getAnimationProps()}
                    style={{ width: "100%" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Box component="span">+</Box>}
                      fullWidth
                      size="large"
                      onClick={handleTripPlanButtonClick}
                      sx={{
                        mb: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: "bold",
                      }}
                    >
                      {placesInTrip.length > 0
                        ? "Buat Rencana Perjalanan"
                        : "Buat Rencana Perjalanan (pilih dahulu destinasi diatas)"}
                    </Button>
                  </motion.div>

                  <TripPlansList key={tripPlansRefreshKey} />
                </Grid>
              </Grid>
            </Container>
          </Box>
        )}

        {openTripPlanModal && (
          <TripPlanModal
            open={openTripPlanModal}
            onClose={handleTripPlanModalClose}
          />
        )}
      </Suspense>
    </Box>
  );
}
