"use client";

import {
  Box,
  Chip,
  Typography,
  Container,
  Tooltip,
  useMediaQuery,
  useTheme as useMuiTheme,
  Badge,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import ParkIcon from "@mui/icons-material/Park";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import CategoryIcon from "@mui/icons-material/Category";
import { useState, useRef, useEffect, useCallback } from "react";
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
  const [touchStart, setTouchStart] = useState<null | number>(null);
  const [touchEnd, setTouchEnd] = useState<null | number>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollStartPosition, setScrollStartPosition] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  const [activeAnimation, setActiveAnimation] = useState(true);
  const muiTheme = useMuiTheme();
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"));
  const isXsScreen = useMediaQuery(muiTheme.breakpoints.down("xs"));

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  useEffect(() => {
    const checkScroll = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setIsScrollable(scrollWidth > clientWidth);
        setShowLeftArrow(scrollLeft > 20);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
        setScrollPosition(scrollLeft);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll(); // Initial check

      // Check on resize
      window.addEventListener("resize", checkScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isDragging) {
      container.style.scrollSnapType = "none";
      container.style.scrollBehavior = "auto";
    } else {
      container.style.scrollSnapType = "x proximity";
      container.style.scrollBehavior = "smooth";
    }
  }, [isDragging]);

  const handleScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = isTablet ? 150 : 200;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveTab(categoryId);
    onCategoryChange(categoryId);

    // Scroll to make the active category visible on mobile
    if (isMobile && containerRef.current) {
      const container = containerRef.current;
      const activeElement = container.querySelector(
        `[data-category="${categoryId}"]`
      );
      if (activeElement) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        const scrollLeft =
          elementRect.left -
          containerRect.left -
          containerRect.width / 2 +
          elementRect.width / 2;

        container.scrollBy({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  };

  const scrollToCategory = useCallback(
    (category: string) => {
      const container = containerRef.current;
      if (!container) return;

      const categoryElement = container.querySelector(
        `[data-category="${category}"]`
      ) as HTMLElement;
      if (categoryElement) {
        const scrollOffset =
          categoryElement.offsetLeft -
          container.offsetWidth / 2 +
          categoryElement.offsetWidth / 2;

        container.scrollTo({
          left: scrollOffset,
          behavior: activeAnimation ? "smooth" : "auto",
        });
      }
    },
    [activeAnimation]
  );

  // Scroll to selected category when it changes
  useEffect(() => {
    if (activeTab) {
      scrollToCategory(activeTab);
    }
  }, [activeTab, scrollToCategory]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
    setIsDragging(true);
    setInitialScrollLeft(containerRef.current?.scrollLeft || 0);
    setScrollStartPosition(e.targetTouches[0].clientX);

    // Disable animation during touch to make it more responsive
    setActiveAnimation(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !containerRef.current) return;

    const currentX = e.targetTouches[0].clientX;
    setTouchEnd(currentX);

    // Calculate movement and apply resistance for natural feel
    const diff = scrollStartPosition - currentX;
    const speed = diff * 1.2; // Adjust speed multiplier for responsiveness

    containerRef.current.scrollLeft = initialScrollLeft + speed;

    // Prevent default to avoid page scrolling while swiping categories
    e.preventDefault();
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    setIsDragging(false);
    setActiveAnimation(true);

    // Reset touch positions
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Find active category index
  const activeCategoryIndex = categories.findIndex(
    (cat) => cat.id === activeTab
  );

  return (
    <Box
      component="section"
      id="categories"
      sx={{
        py: { xs: 0, sm: 1, md: 2 },
        pb: { xs: 0, sm: 1, md: 2 },
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
        overflowX: "hidden",
        mb: { xs: 3, sm: 2, md: 0 }, // Added bottom margin for mobile
      }}
    >
      <Container maxWidth="xl" disableGutters={isMobile}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            mb: { xs: 0, md: 0 },
            position: "relative",
            width: "100%",
          }}
        >
          {isScrollable && !isMobile && (
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
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            sx={{
              display: "flex",
              flexWrap: { xs: "nowrap", md: "wrap" },
              gap: { xs: 1.5, sm: 2 },
              justifyContent: { xs: "flex-start", md: "center" },
              px: { xs: 1.5, sm: 3, md: 4 },
              py: { xs: 1.5, sm: 2 },
              mt: 0,
              overflowX: { xs: "auto", md: "visible" },
              scrollbarWidth: "none",
              "-webkit-overflow-scrolling": "touch", // Smooth scrolling on iOS
              scrollSnapType: { xs: "x proximity", md: "none" }, // Changed from mandatory to proximity for smoother scrolling
              scrollPadding: { xs: "0 20px", md: 0 },
              "&::-webkit-scrollbar": {
                display: "none",
              },
              maskImage: {
                xs: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
                md: "none",
              },
              touchAction: isMobile ? "pan-x" : "auto", // Better touch handling
              cursor: isMobile ? "grab" : "default",
              "&:active": {
                cursor: isMobile ? "grabbing" : "default",
              },
              // Enhanced scroll behavior for mobile
              scrollBehavior: "smooth",
              // Add momentum-based scrolling for mobile
              WebkitOverflowScrolling: "touch",
              // Improved timing function for smoother motion
              transitionTimingFunction: "cubic-bezier(0.1, 0.9, 0.2, 1)",
            }}
          >
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              const isActive = activeTab === category.id;
              return (
                <Tooltip
                  key={category.id}
                  title={category.label}
                  enterDelay={700}
                  arrow
                  placement="top"
                  disableHoverListener={isMobile}
                  disableTouchListener={isMobile}
                >
                  <Box
                    component={motion.div}
                    whileTap={isMobile ? { scale: 0.95 } : { scale: 0.95 }}
                    whileHover={isMobile ? undefined : { y: -2 }}
                    data-category={category.id}
                    sx={{
                      scrollSnapAlign: { xs: "center", md: "none" },
                      flex: { xs: "0 0 auto", md: "0 0 auto" },
                    }}
                  >
                    <Chip
                      label={category.label}
                      icon={
                        <IconComponent
                          fontSize={isXsScreen ? "small" : "small"}
                          sx={{
                            color: isActive ? "#ffffff" : category.color,
                          }}
                        />
                      }
                      onClick={() => handleCategoryChange(category.id)}
                      color={isActive ? "primary" : "default"}
                      variant={isActive ? "filled" : "outlined"}
                      sx={{
                        px: { xs: 1, sm: 1.5 },
                        py: { xs: 2.5, sm: 3 },
                        height: { xs: "auto" },
                        borderRadius: "20px",
                        fontWeight: 600,
                        fontSize: { xs: "0.8rem", sm: "0.9rem", md: "0.95rem" },
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
                        // Different hover treatment based on device type
                        "@media (hover: hover)": {
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
                        },
                        // No hover effect on mobile - improved tactile feedback instead
                        "@media (hover: none)": {
                          "&:hover": {
                            transform: "none",
                            boxShadow: isActive
                              ? `0 6px 15px ${category.color}60`
                              : isDarkMode
                              ? "0 2px 8px rgba(0,0,0,0.2)"
                              : "none",
                            backgroundColor: isActive
                              ? category.color
                              : isDarkMode
                              ? "rgba(255,255,255,0.03)"
                              : "transparent",
                          },
                        },
                        // Enhanced active state response for mobile
                        "&:active": isMobile
                          ? {
                              transform: isActive ? "none" : "scale(0.96)",
                              opacity: isActive ? 1 : 0.9,
                              transition: "all 0.1s ease-out",
                            }
                          : {},
                        "& .MuiChip-icon": {
                          ml: { xs: 0.5, sm: 1 },
                          mr: { xs: -0.8, sm: -0.5 },
                        },
                        "& .MuiChip-label": {
                          padding: { xs: "0 8px", sm: "0 12px", md: "0 14px" },
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

          {isMobile && isScrollable && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 1,
                mb: 2, // Increased spacing here
                pt: 0.5,
              }}
            >
              {categories.map((category, index) => (
                <Box
                  key={`dot-${category.id}`}
                  onClick={() => handleCategoryChange(category.id)}
                  sx={{
                    width: activeTab === category.id ? 10 : 6,
                    height: activeTab === category.id ? 10 : 6,
                    borderRadius: "50%",
                    mx: 0.6, // Increased spacing between dots
                    backgroundColor:
                      activeTab === category.id
                        ? category.color
                        : isDarkMode
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    opacity: activeTab === category.id ? 1 : 0.6,
                    boxShadow:
                      activeTab === category.id
                        ? `0 2px 8px ${category.color}70`
                        : "none",
                  }}
                />
              ))}
            </Box>
          )}

          {/* Mobile indicator to show swipe functionality */}
          {isMobile && isScrollable && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: 10,
                transform: "translateY(-50%)",
                color: isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)",
                fontSize: "12px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
                zIndex: 1,
                opacity: showLeftArrow ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              <KeyboardArrowLeftIcon fontSize="small" />
            </Box>
          )}

          {isMobile && isScrollable && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                right: 10,
                transform: "translateY(-50%)",
                color: isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)",
                fontSize: "12px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
                zIndex: 1,
                opacity: showRightArrow ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              <KeyboardArrowRightIcon fontSize="small" />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
