"use client";

import {
  Box,
  Chip,
  Typography,
  Container,
  Tooltip,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import ParkIcon from "@mui/icons-material/Park";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import CategoryIcon from "@mui/icons-material/Category";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useTheme } from "../context/ThemeContext";

// Define category objects with proper ReactNode icons and colors
const categories = [
  { id: "all", label: "Semua", icon: CategoryIcon, color: "#5D69B1" },
  { id: "food", label: "Kuliner", icon: RestaurantIcon, color: "#E94057" },
  { id: "cafe", label: "Cafe", icon: LocalCafeIcon, color: "#8C5E58" },
  { id: "park", label: "Taman", icon: ParkIcon, color: "#52B788" },
  { id: "beach", label: "Pantai", icon: BeachAccessIcon, color: "#3A86FF" },
  { id: "karaoke", label: "Karaoke", icon: MusicNoteIcon, color: "#C84B31" },
];

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  onCategoryChange,
}: CategoryFilterProps) {
  const [activeTab, setActiveTab] = useState("all");
  const tabsRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const muiTheme = useMuiTheme();
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  useEffect(() => {
    const checkScroll = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setShowLeftArrow(scrollLeft > 20);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll(); // Initial check
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 200;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveTab(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <Box
      component="section"
      id="categories"
      sx={{
        py: { xs: 0, md: 2 },
        pb: { xs: 0, md: 2 },
        background: isDarkMode
          ? "linear-gradient(to bottom, #1a1a1a, #121212)"
          : "linear-gradient(to bottom, #ffffff, #f8f9fa)",
        borderBottom: isDarkMode
          ? "1px solid rgba(255,255,255,0.05)"
          : "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 2px 15px rgba(0,0,0,0.07)",
        borderRadius: { xs: 0, md: "0 0 20px 20px" },
        position: "relative",
        zIndex: 10,
        marginTop: 0,
      }}
    >
      <Container maxWidth="xl">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            mb: { xs: 0, md: 0 },
            position: "relative",
          }}
        >
          {!isMobile && (
            <>
              <AnimatePresence>
                {showLeftArrow && (
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                      display: { xs: "none", md: "flex" },
                    }}
                  >
                    <Box
                      onClick={() => handleScroll("left")}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: isDarkMode ? "#333" : "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: isDarkMode
                          ? "0 3px 10px rgba(0,0,0,0.3)"
                          : "0 3px 10px rgba(0,0,0,0.15)",
                        cursor: "pointer",
                        "&:hover": {
                          boxShadow: isDarkMode
                            ? "0 5px 15px rgba(0,0,0,0.5)"
                            : "0 5px 15px rgba(0,0,0,0.2)",
                        },
                        color: isDarkMode ? "#fff" : "inherit",
                      }}
                    >
                      <KeyboardArrowLeftIcon />
                    </Box>
                  </Box>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showRightArrow && (
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                      display: { xs: "none", md: "flex" },
                    }}
                  >
                    <Box
                      onClick={() => handleScroll("right")}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: isDarkMode ? "#333" : "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: isDarkMode
                          ? "0 3px 10px rgba(0,0,0,0.3)"
                          : "0 3px 10px rgba(0,0,0,0.15)",
                        cursor: "pointer",
                        "&:hover": {
                          boxShadow: isDarkMode
                            ? "0 5px 15px rgba(0,0,0,0.5)"
                            : "0 5px 15px rgba(0,0,0,0.2)",
                        },
                        color: isDarkMode ? "#fff" : "inherit",
                      }}
                    >
                      <KeyboardArrowRightIcon />
                    </Box>
                  </Box>
                )}
              </AnimatePresence>
            </>
          )}

          <Box
            ref={containerRef}
            sx={{
              display: "flex",
              flexWrap: { xs: "nowrap", md: "wrap" },
              gap: 2,
              justifyContent: { xs: "flex-start", md: "center" },
              px: { xs: 2, sm: 4 },
              py: 1,
              mt: 0,
              overflowX: { xs: "auto", md: "visible" },
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              maskImage: {
                xs: "linear-gradient(to right, transparent, black 10px, black 90%, transparent)",
                md: "none",
              },
            }}
          >
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = activeTab === category.id;
              return (
                <Tooltip
                  key={category.id}
                  title={category.label}
                  enterDelay={700}
                  arrow
                >
                  <Box
                    component={motion.div}
                    whileTap={{ scale: 0.95 }}
                    key={category.id}
                  >
                    <Chip
                      label={category.label}
                      icon={
                        <IconComponent
                          fontSize="small"
                          sx={{
                            color: isActive ? "#ffffff" : category.color,
                          }}
                        />
                      }
                      onClick={() => handleCategoryChange(category.id)}
                      color={isActive ? "primary" : "default"}
                      variant={isActive ? "filled" : "outlined"}
                      sx={{
                        px: 1.5,
                        py: 3,
                        borderRadius: "20px",
                        fontWeight: 600,
                        fontSize: { xs: "0.9rem", md: "0.95rem" },
                        letterSpacing: "0.01em",
                        transition:
                          "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        border: isActive
                          ? "none"
                          : `2px solid ${category.color}40`,
                        color: isActive ? "#ffffff" : category.color,
                        backgroundColor: isActive
                          ? category.color
                          : isDarkMode
                          ? "rgba(255,255,255,0.03)"
                          : "transparent",
                        boxShadow: isActive
                          ? `0 6px 15px ${category.color}60`
                          : isDarkMode
                          ? "0 2px 8px rgba(0,0,0,0.2)"
                          : "none",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: isActive
                            ? `0 8px 20px ${category.color}70`
                            : isDarkMode
                            ? `0 4px 15px ${category.color}40`
                            : `0 4px 10px ${category.color}40`,
                          backgroundColor: isActive
                            ? category.color
                            : isDarkMode
                            ? `${category.color}25`
                            : `${category.color}15`,
                        },
                        "& .MuiChip-icon": {
                          ml: 1,
                          mr: -0.5,
                        },
                        "& .MuiChip-label": {
                          padding: "0 14px",
                          color: isActive
                            ? "#ffffff"
                            : isDarkMode
                            ? category.color
                            : category.color,
                          textShadow: isActive
                            ? "0 1px 2px rgba(0,0,0,0.2)"
                            : "none",
                        },
                      }}
                    />
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
