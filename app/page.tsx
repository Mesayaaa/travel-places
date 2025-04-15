"use client";

import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Fade,
  IconButton,
} from "@mui/material";
import { motion, useInView } from "framer-motion";
import PlaceCard from "./components/PlaceCard";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { places } from "./data/places";
import { useRef, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CategoryFilter from "./components/CategoryFilter";
import AddIcon from "@mui/icons-material/Add";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import TripPlanModal from "./components/TripPlanModal";
import TripPlansList from "./components/TripPlansList";
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPlaces, setFilteredPlaces] = useState(places);
  const [activeCategory, setActiveCategory] = useState("all");
  const [tripPlansRefreshKey, setTripPlansRefreshKey] = useState(0);
  const { openTripPlanModal, setOpenTripPlanModal } = useTrip();
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

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Handle trip plan modal close and trigger refresh
  const handleTripPlanModalClose = () => {
    setOpenTripPlanModal(false);
    // Refresh the trip plans list
    setTripPlansRefreshKey((prev) => prev + 1);
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)",
      }}
    >
      <Navbar />
      <HeroSection />

      <CategoryFilter onCategoryChange={handleCategoryChange} />

      <Box
        component="section"
        id="destination-list"
        ref={destinationsRef}
        sx={{
          py: { xs: 5, md: 0 },
          background: "linear-gradient(to bottom, #f8f9fa, #f0f2f5)",
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            variants={container}
            initial="hidden"
            animate={isDestinationsInView ? "show" : "hidden"}
            style={{ perspective: "1000px" }}
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
                : filteredPlaces.map((place, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={place.id}
                      component={motion.div}
                      variants={item}
                      custom={index}
                    >
                      <PlaceCard place={place} sx={{ my: 1 }} />
                    </Grid>
                  ))}
            </Grid>
          </motion.div>

          {!isLoading && filteredPlaces.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 2,
              }}
            >
              <EmojiEmotionsIcon
                sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
              />
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: "text.secondary",
                }}
              >
                Tidak ada tempat untuk kategori ini
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Coba pilih kategori lain atau cari tempat baru
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      <Box
        component="section"
        id="plan"
        ref={planSectionRef}
        sx={{
          py: { xs: 8, md: 12 },
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          borderTop: "1px solid rgba(0,0,0,0.05)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Container maxWidth="xl">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={
              isPlanSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
            sx={{ textAlign: "center", mb: { xs: 5, md: 6 } }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
                background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                display: "inline-block",
              }}
            >
              Rencanakan Perjalanan Bersama
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: "800px",
                mx: "auto",
                color: "text.secondary",
                mb: 5,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              Buat rencana perjalanan dengan mudah dan nikmati momen spesial
              bersama orang tersayang. Pilih destinasi favorit dan mulai
              petualangan Anda sekarang!
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setOpenTripPlanModal(true)}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: "8px",
                fontWeight: 600,
                background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                transition: "all 0.3s",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                textTransform: "none",
                fontSize: "1.1rem",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                },
              }}
            >
              Buat Rencana Perjalanan
            </Button>
          </Box>

          {/* Trip Plans List */}
          <TripPlansList key={tripPlansRefreshKey} />

          {/* Trip Plan Modal */}
          <TripPlanModal
            open={openTripPlanModal}
            onClose={handleTripPlanModalClose}
          />
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          py: { xs: 5, md: 7 },
          bgcolor: "#2b2d42",
          color: "white",
          borderTop: "4px solid",
          borderImage: "linear-gradient(45deg, #FF6B6B, #4ECDC4) 1",
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  display: "inline-block",
                }}
              >
                TravelSayang
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 3, opacity: 0.9, maxWidth: "90%" }}
              >
                Temukan tempat-tempat indah untuk dikunjungi bersama orang
                tersayang dan ciptakan kenangan yang tak terlupakan.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <IconButton
                  component={Link}
                  href="https://instagram.com"
                  target="_blank"
                  sx={{
                    color: "white",
                    borderRadius: "8px",
                    transition: "all 0.3s",
                    "&:hover": {
                      background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  component={Link}
                  href="https://twitter.com"
                  target="_blank"
                  sx={{
                    color: "white",
                    borderRadius: "8px",
                    transition: "all 0.3s",
                    "&:hover": {
                      background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  component={Link}
                  href="https://facebook.com"
                  target="_blank"
                  sx={{
                    color: "white",
                    borderRadius: "8px",
                    transition: "all 0.3s",
                    "&:hover": {
                      background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  component={Link}
                  href="https://youtube.com"
                  target="_blank"
                  sx={{
                    color: "white",
                    borderRadius: "8px",
                    transition: "all 0.3s",
                    "&:hover": {
                      background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <YouTubeIcon />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  position: "relative",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 3,
                    background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                    borderRadius: 10,
                  },
                }}
              >
                Navigasi
              </Typography>
              {[
                {
                  name: "Beranda",
                  href: "#",
                  scroll: () => window.scrollTo({ top: 0, behavior: "smooth" }),
                },
                {
                  name: "Destinasi",
                  href: "#categories",
                  scroll: () =>
                    document
                      .getElementById("categories")
                      ?.scrollIntoView({ behavior: "smooth" }),
                },
                {
                  name: "Trip Planner",
                  href: "#plan",
                  scroll: () =>
                    document
                      .getElementById("plan")
                      ?.scrollIntoView({ behavior: "smooth" }),
                },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  underline="none"
                  onClick={(e) => {
                    e.preventDefault();
                    link.scroll();
                  }}
                  sx={{
                    display: "block",
                    mb: 1.5,
                    color: "white",
                    opacity: 0.8,
                    transition: "all 0.2s",
                    "&:hover": {
                      opacity: 1,
                      color: "#4ECDC4",
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  <Typography variant="body2">{link.name}</Typography>
                </Link>
              ))}
            </Grid>

            <Grid item xs={12} sm={6} md={5}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  position: "relative",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: 0,
                    width: 40,
                    height: 3,
                    background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                    borderRadius: 10,
                  },
                }}
              >
                Hubungi Kami
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocationOnIcon
                  sx={{ mr: 1, color: "#FF6B6B", fontSize: 20 }}
                />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Jl. Cinta Abadi No.143, Kota Romantis
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EmailIcon sx={{ mr: 1, color: "#FF6B6B", fontSize: 20 }} />
                <Link
                  href="mailto:info@travelsayang.id"
                  underline="hover"
                  sx={{ color: "white", opacity: 0.9 }}
                >
                  <Typography variant="body2">info@travelsayang.id</Typography>
                </Link>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PhoneIcon sx={{ mr: 1, color: "#FF6B6B", fontSize: 20 }} />
                <Link
                  href="tel:+6281234567890"
                  underline="hover"
                  sx={{ color: "white", opacity: 0.9 }}
                >
                  <Typography variant="body2">+62 812 3456 7890</Typography>
                </Link>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              mt: 5,
              pt: 3,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "center", sm: "center" },
              textAlign: { xs: "center", sm: "left" },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} TravelSayang
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 2, sm: 3 },
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {["Kebijakan Privasi", "Syarat & Ketentuan", "FAQ"].map(
                (item) => (
                  <Link
                    key={item}
                    href="#"
                    underline="hover"
                    sx={{
                      color: "white",
                      opacity: 0.7,
                      fontSize: "0.875rem",
                      transition: "all 0.2s",
                      "&:hover": {
                        opacity: 1,
                        color: "#4ECDC4",
                      },
                    }}
                  >
                    {item}
                  </Link>
                )
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
