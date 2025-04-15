"use client";

import { Box, Container, Typography, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function HeroSection() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    []
  );
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";

  const scrollToCategories = () => {
    const categoriesSection = document.getElementById("categories");
    if (categoriesSection) {
      const yOffset = -60; // Small offset to ensure the section is clearly visible
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

  const handleDestinationChange = (_event: any, newValue: string[]) => {
    setSelectedDestinations(newValue);
  };

  return (
    <Box
      component="section"
      id="hero"
      sx={{
        position: "relative",
        height: { xs: "90vh", md: "100vh" },
        background: `linear-gradient(rgba(0,0,0,${
          isDarkMode ? "0.6" : "0.4"
        }), rgba(0,0,0,${
          isDarkMode ? "0.7" : "0.5"
        })), url('/images/borobudur.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xl">
        <Box
          component={motion.div}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          sx={{
            maxWidth: { xs: "100%", md: "80%" },
            mx: "auto",
            textAlign: "center",
            color: "white",
            textShadow: isDarkMode
              ? "0 2px 10px rgba(0,0,0,0.5)"
              : "0 2px 10px rgba(0,0,0,0.3)",
            mb: { xs: 4, md: 8 },
            p: 3,
            borderRadius: "16px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: "easeInOut",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.5rem", sm: "4rem", md: "5rem" },
                mb: 2,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                position: "relative",
                overflow: "hidden",
                color: "#FFFFFF",
                textShadow: isDarkMode
                  ? "0 3px 10px rgba(0,0,0,0.7)"
                  : "0 3px 10px rgba(0,0,0,0.5)",
                "& span": {
                  display: "inline-block",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  zIndex: -1,
                },
              }}
            >
              <Box
                component={motion.span}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  ease: "easeInOut",
                }}
                sx={{
                  display: "inline-block",
                  position: "relative",
                  color: "rgba(255,255,255,0.98)",
                  textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "30%",
                    height: "3px",
                    bottom: "15px",
                    left: "5px",
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0))",
                    borderRadius: "2px",
                  },
                }}
              >
                Jelajahi
              </Box>{" "}
              <Box
                component={motion.span}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5,
                  ease: "easeInOut",
                }}
              >
                Tempat Indah{" "}
              </Box>
              <Box
                component={motion.span}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.6,
                  delay: 0.7,
                  ease: "easeInOut",
                }}
                sx={{
                  display: "inline-block",
                  position: "relative",
                  color: "rgba(255,255,255,0.98)",
                  textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                  transform: "translateY(2px)",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "3px",
                    bottom: "15px",
                    left: "0",
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0))",
                    borderRadius: "2px",
                  },
                }}
              >
                Bersamanya
              </Box>
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.7,
              delay: 0.4,
              ease: "easeInOut",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                mb: 4,
                maxWidth: "90%",
                mx: "auto",
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                opacity: 1,
                color: "#FFFFFF",
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                letterSpacing: "0.02em",
                lineHeight: 1.6,
              }}
            >
              Temukan pengalaman perjalanan terbaik dan kenangan tak terlupakan
              bersama orang tersayang. Rencanakan perjalanan Anda sekarang!
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.7,
              delay: 0.6,
              ease: "easeInOut",
            }}
          ></motion.div>
        </Box>
      </Container>

      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "10vh", md: "5vh" },
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
        }}
      >
        <IconButton
          onClick={scrollToCategories}
          aria-label="Scroll to destinations"
          component={motion.button}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
          }}
          sx={{
            color: "white",
            bgcolor: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(4px)",
            p: 2,
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.25)",
              transform: "scale(1.1)",
            },
            boxShadow: isDarkMode
              ? "0 4px 20px rgba(0,0,0,0.4)"
              : "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          <KeyboardArrowDownIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
}
