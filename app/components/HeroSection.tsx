"use client";

import {
  Box,
  Container,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import ResponsiveImage from "./ResponsiveImage";
import { getImagePath } from "../utils/getImagePath";

export default function HeroSection() {
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const isDarkMode = mode === "dark";
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const isXsScreen = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isMdScreen = useMediaQuery(muiTheme.breakpoints.down("md"));

  // Check for mobile device on client side
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSmallScreen(window.innerWidth <= 480);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollToCategories = () => {
    const categoriesSection = document.getElementById("categories");
    if (categoriesSection) {
      const yOffset = isMobile ? -40 : -60;
      const y =
        categoriesSection.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box
      component="section"
      id="hero"
      sx={{
        position: "relative",
        height: { xs: "100vh", sm: "100vh", md: "100vh", lg: "100vh" },
        overflow: "hidden",
        marginBottom: 0,
        paddingBottom: 0,
      }}
    >
      {/* Hero Background Image */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `linear-gradient(rgba(0,0,0,${
              isDarkMode ? "0.6" : "0.4"
            }), rgba(0,0,0,${isDarkMode ? "0.7" : "0.5"}))`,
            zIndex: 1,
          },
        }}
      >
        <ResponsiveImage
          src={getImagePath("/images/borobudur.jpg")}
          mobileSrc={getImagePath("/images/mobile/borobudur-mobile.jpg")}
          alt="Hero Background"
          fill
          priority
          loading="eager"
          objectFit="cover"
          objectPosition="center"
          className="full-height mobile-full-height hero-bg-image"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
          }}
        />
      </Box>

      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
          py: { xs: 3, sm: 4, md: 6, lg: 8 },
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center", md: "center" },
          justifyContent: "center",
          paddingTop: { xs: "15vh", sm: "inherit" },
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: "100%", sm: "90%", md: "80%", lg: "70%" },
            mx: "auto",
            textAlign: "center",
            color: "white",
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            mb: { xs: 1, sm: 2, md: 4, lg: 6 },
            p: { xs: 1.5, sm: 2, md: 3, lg: 4 },
            borderRadius: { xs: "12px", sm: "16px" },
            backgroundColor: { xs: "transparent", sm: "transparent" },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: {
                  xs: "2.5rem",
                  sm: "2.25rem",
                  md: "3.25rem",
                  lg: "4.5rem",
                },
                mb: { xs: 1, sm: 1.5, md: 2, lg: 3 },
                lineHeight: { xs: 1.3, sm: 1.2, md: 1.1 },
                letterSpacing: {
                  xs: "-0.01em",
                  sm: "-0.015em",
                  md: "-0.02em",
                },
                position: "relative",
                overflow: "hidden",
                color: "#FFFFFF",
                textShadow: "0 3px 10px rgba(0,0,0,0.5)",
              }}
            >
              <Box component="span">Jelajahi Tempat Indah Bersamanya</Box>
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: { xs: 500, sm: 400 },
                mb: { xs: 2, sm: 3, md: 4, lg: 5 },
                maxWidth: { xs: "100%", sm: "95%", md: "90%", lg: "80%" },
                mx: "auto",
                fontSize: {
                  xs: "1.15rem",
                  sm: "0.95rem",
                  md: "1.15rem",
                  lg: "1.5rem",
                },
                color: "#FFFFFF",
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                letterSpacing: { xs: "0.01em", md: "0.02em" },
                lineHeight: { xs: 1.5, sm: 1.6 },
                px: { xs: 0.5, sm: 1, md: 2 },
              }}
            >
              {isSmallScreen || isXsScreen
                ? "Rencanakan perjalanan Anda sekarang!"
                : isMdScreen
                ? "Temukan pengalaman perjalanan terbaik bersama orang tersayang. Rencanakan sekarang!"
                : "Temukan pengalaman perjalanan terbaik dan kenangan tak terlupakan bersama orang tersayang. Rencanakan perjalanan Anda sekarang!"}
            </Typography>
          </motion.div>
        </Box>
      </Container>

      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "25vh", sm: "5vh", md: "7vh", lg: "5vh" },
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ y: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconButton
            onClick={scrollToCategories}
            aria-label="Scroll to destinations"
            sx={{
              color: "white",
              backgroundColor: "rgba(255,255,255,0.2)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.3)",
              },
              padding: { xs: 1.2, sm: 1.5, md: 1.8 },
              boxShadow: "0 3px 15px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
          >
            <KeyboardArrowDownIcon
              sx={{ fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" } }}
            />
          </IconButton>
        </motion.div>
      </Box>
    </Box>
  );
}
