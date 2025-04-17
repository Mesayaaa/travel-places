"use client";

import {
  Box,
  Container,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import ResponsiveImage from "./ResponsiveImage";
import { getImagePath } from "../utils/getImagePath";

export default function HeroSection() {
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

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
      const yOffset = -60;
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
        height: { xs: "80vh", sm: "85vh", md: "100vh" },
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
          className="object-cover object-center"
        />
      </Box>

      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 4, sm: 6, md: 8 },
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: "100%", sm: "90%", md: "80%", lg: "70%" },
            mx: "auto",
            textAlign: "center",
            color: "white",
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            mb: { xs: 2, sm: 4, md: 6 },
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: "16px",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: {
                xs: "1.75rem",
                sm: "2.5rem",
                md: "3.5rem",
                lg: "4.5rem",
              },
              mb: { xs: 1, sm: 2, md: 3 },
              lineHeight: { xs: 1.2, sm: 1.1 },
              letterSpacing: "-0.02em",
              position: "relative",
              overflow: "hidden",
              color: "#FFFFFF",
              textShadow: "0 3px 10px rgba(0,0,0,0.5)",
            }}
          >
            <Box component="span">Jelajahi Tempat Indah Bersamanya</Box>
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 400,
              mb: { xs: 3, sm: 4, md: 5 },
              maxWidth: { xs: "100%", sm: "90%", md: "80%" },
              mx: "auto",
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
                md: "1.25rem",
                lg: "1.5rem",
              },
              opacity: 1,
              color: "#FFFFFF",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              letterSpacing: "0.02em",
              lineHeight: { xs: 1.5, sm: 1.6 },
              px: { xs: 1, sm: 2 },
            }}
          >
            {isSmallScreen
              ? "Rencanakan perjalanan Anda sekarang!"
              : "Temukan pengalaman perjalanan terbaik dan kenangan tak terlupakan bersama orang tersayang. Rencanakan perjalanan Anda sekarang!"}
          </Typography>
        </Box>
      </Container>

      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "5vh", sm: "7vh", md: "5vh" },
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
        }}
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
            padding: { xs: 1, sm: 1.5 },
          }}
        >
          <KeyboardArrowDownIcon
            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
          />
        </IconButton>
      </Box>
    </Box>
  );
}
