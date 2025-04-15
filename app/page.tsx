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
import { useTheme } from "./context/ThemeContext";

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
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
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
        background: isDarkMode
          ? "linear-gradient(to bottom, #121212, #1a1a1a)"
          : "linear-gradient(to bottom, #f8f9fa, #e9ecef)",
        overflowX: "hidden", // Prevent horizontal scroll during animations
      }}
    >
      <Navbar />
      <HeroSection />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <CategoryFilter onCategoryChange={handleCategoryChange} />
      </motion.div>

      <Box
        component="section"
        id="categories"
        ref={destinationsRef}
        sx={{
          pt: { xs: 0, md: 1 },
          pb: { xs: 2, md: 4 },
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
                      <motion.div
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
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
              component={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              sx={{
                textAlign: "center",
                py: { xs: 4, md: 8 },
                px: { xs: 2, md: 4 },
                borderRadius: "16px",
                background: isDarkMode
                  ? "rgba(30,30,30,0.6)"
                  : "rgba(255,255,255,0.7)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                maxWidth: "700px",
                mx: "auto",
                mt: { xs: 2, md: 4 },
              }}
            >
              <EmojiEmotionsIcon
                sx={{
                  fontSize: { xs: 50, md: 70 },
                  color: "text.disabled",
                  mb: { xs: 1, md: 2 },
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  mb: { xs: 1, md: 2 },
                  fontWeight: 600,
                  color: "text.secondary",
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                }}
              >
                Tidak ada tempat untuk kategori ini
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: { xs: 2, md: 4 },
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                Coba pilih kategori lain atau cari tempat baru
              </Typography>
              <Button
                variant="outlined"
                onClick={() => handleCategoryChange("all")}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  px: { xs: 2, md: 3 },
                  py: { xs: 0.5, md: 1 },
                  borderWidth: "2px",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                  "&:hover": {
                    borderWidth: "2px",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Tampilkan Semua Tempat
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      <Box
        component="section"
        id="plan"
        ref={planSectionRef}
        sx={{
          py: { xs: 4, md: 10 },
          background: isDarkMode
            ? "linear-gradient(135deg, #121212 0%, #1d1d1d 100%)"
            : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          borderTop: isDarkMode
            ? "1px solid rgba(255,255,255,0.05)"
            : "1px solid rgba(0,0,0,0.05)",
          borderBottom: isDarkMode
            ? "1px solid rgba(255,255,255,0.05)"
            : "1px solid rgba(0,0,0,0.05)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "100px",
            background: isDarkMode
              ? "linear-gradient(to bottom, rgba(18,18,18,0.5), transparent)"
              : "linear-gradient(to bottom, rgba(248,249,250,0.5), transparent)",
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {useTrip().placesInTrip.length > 0 ? (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 40 }}
              animate={
                isPlanSectionInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 40 }
              }
              transition={{ duration: 0.8 }}
              sx={{ textAlign: "center", mb: { xs: 4, md: 8 } }}
            >
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 800,
                  mb: { xs: 1, md: 2 },
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                  background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  display: "inline-block",
                  textShadow: isDarkMode
                    ? "0 2px 15px rgba(78,205,196,0.3)"
                    : "none",
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
                  mb: { xs: 3, md: 5 },
                  fontSize: { xs: "0.875rem", md: "1.1rem" },
                  px: { xs: 2, md: 0 },
                }}
              >
                Buat rencana perjalanan dengan mudah dan nikmati momen spesial
                bersama orang tersayang. Pilih destinasi favorit dan mulai
                petualangan Anda sekarang!
              </Typography>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenTripPlanModal(true)}
                  sx={{
                    py: { xs: 1, md: 1.5 },
                    px: { xs: 2, md: 4 },
                    borderRadius: "12px",
                    fontWeight: 600,
                    background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                    transition: "all 0.3s",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    textTransform: "none",
                    fontSize: { xs: "0.875rem", md: "1.1rem" },
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                      background: "linear-gradient(45deg, #FF5A5A, #3DBCB3)",
                    },
                  }}
                >
                  Buat Rencana Perjalanan
                </Button>
              </motion.div>
            </Box>
          ) : (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 40 }}
              animate={
                isPlanSectionInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 40 }
              }
              transition={{ duration: 0.8 }}
              sx={{
                textAlign: "center",
                mb: { xs: 4, md: 6 },
                p: { xs: 2, md: 4 },
                borderRadius: "16px",
                background: isDarkMode
                  ? "rgba(30,30,30,0.5)"
                  : "rgba(255,255,255,0.6)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                maxWidth: "900px",
                mx: "auto",
              }}
            >
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 800,
                  mb: { xs: 1, md: 2 },
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                  background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  display: "inline-block",
                  textShadow: isDarkMode
                    ? "0 2px 15px rgba(78,205,196,0.3)"
                    : "none",
                }}
              >
                Tambahkan Tempat ke Trip Anda
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  maxWidth: "800px",
                  mx: "auto",
                  color: "text.secondary",
                  mb: { xs: 3, md: 4 },
                  fontSize: { xs: "0.875rem", md: "1.1rem" },
                  px: { xs: 2, md: 0 },
                }}
              >
                Anda perlu menambahkan tempat ke trip sebelum dapat membuat
                rencana perjalanan. Jelajahi destinasi dan tekan "Tambahkan ke
                Trip" pada tempat yang ingin dikunjungi.
              </Typography>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() =>
                    document
                      .getElementById("categories")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    px: { xs: 2, md: 3 },
                    py: { xs: 0.5, md: 1.2 },
                    borderWidth: "2px",
                    fontSize: { xs: "0.875rem", md: "1rem" },
                    "&:hover": {
                      borderWidth: "2px",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Lihat Destinasi
                </Button>
              </motion.div>
            </Box>
          )}

          {/* Trip Plans List */}
          {useTrip().placesInTrip.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <TripPlansList key={tripPlansRefreshKey} />
            </motion.div>
          ) : (
            <Box sx={{ textAlign: "center", py: 1 }}></Box>
          )}

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
          pt: 8,
          pb: 4,
          background: isDarkMode
            ? "linear-gradient(to bottom, #0e0e0e, #161616)"
            : "linear-gradient(to bottom, #e9ecef, #dee2e6)",
          borderTop: isDarkMode
            ? "1px solid rgba(255,255,255,0.05)"
            : "1px solid rgba(0,0,0,0.05)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: isDarkMode
              ? "radial-gradient(circle at 20% 30%, rgba(78, 205, 196, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 107, 107, 0.05) 0%, transparent 50%)"
              : "radial-gradient(circle at 20% 30%, rgba(78, 205, 196, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 107, 107, 0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
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
                  sx={{
                    mb: 3,
                    opacity: 0.9,
                    maxWidth: "90%",
                    color: isDarkMode
                      ? "rgba(255,255,255,0.8)"
                      : "text.primary",
                    lineHeight: 1.7,
                  }}
                >
                  Temukan tempat-tempat indah untuk dikunjungi bersama orang
                  tersayang dan ciptakan kenangan yang tak terlupakan.
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  {[
                    { icon: <InstagramIcon />, url: "https://instagram.com" },
                    { icon: <TwitterIcon />, url: "https://twitter.com" },
                    { icon: <FacebookIcon />, url: "https://facebook.com" },
                    { icon: <YouTubeIcon />, url: "https://youtube.com" },
                  ].map((social, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconButton
                        component={Link}
                        href={social.url}
                        target="_blank"
                        sx={{
                          color: isDarkMode ? "rgba(255,255,255,0.8)" : "#555",
                          borderRadius: "8px",
                          transition: "all 0.3s",
                          "&:hover": {
                            background:
                              "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                            transform: "translateY(-2px)",
                            color: "white",
                          },
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  position: "relative",
                  color: isDarkMode ? "rgba(255,255,255,0.9)" : "text.primary",
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
                    color: isDarkMode ? "rgba(255,255,255,0.7)" : "#555",
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
                  color: isDarkMode ? "rgba(255,255,255,0.9)" : "text.primary",
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
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.9,
                    color: isDarkMode ? "rgba(255,255,255,0.7)" : "#555",
                  }}
                >
                  Jl. Cinta Abadi No.143, Kota Romantis
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EmailIcon sx={{ mr: 1, color: "#FF6B6B", fontSize: 20 }} />
                <Link
                  href="mailto:info@travelsayang.id"
                  underline="hover"
                  sx={{
                    color: isDarkMode ? "rgba(255,255,255,0.7)" : "#555",
                    opacity: 0.9,
                  }}
                >
                  <Typography variant="body2">info@travelsayang.id</Typography>
                </Link>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PhoneIcon sx={{ mr: 1, color: "#FF6B6B", fontSize: 20 }} />
                <Link
                  href="tel:+6281234567890"
                  underline="hover"
                  sx={{
                    color: isDarkMode ? "rgba(255,255,255,0.7)" : "#555",
                    opacity: 0.9,
                  }}
                >
                  <Typography variant="body2">+62 812 3456 7890</Typography>
                </Link>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              borderTop: isDarkMode
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(0,0,0,0.1)",
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
            <Typography
              variant="body2"
              sx={{
                opacity: 0.7,
                color: isDarkMode ? "rgba(255,255,255,0.7)" : "#555",
              }}
            >
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
                      color: isDarkMode ? "rgba(255,255,255,0.7)" : "#555",
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
