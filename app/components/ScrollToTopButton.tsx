"use client";

import { useEffect, useState } from "react";
import { Box, Fab, Zoom, useTheme as useMuiTheme } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { motion } from "framer-motion";

interface ScrollToTopButtonProps {
  isDarkMode: boolean;
}

const ScrollToTopButton = ({ isDarkMode }: ScrollToTopButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set up scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Zoom in={isVisible}>
      <Box
        onClick={scrollToTop}
        role="presentation"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1000,
        }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Fab
            color="primary"
            aria-label="scroll back to top"
            size="medium"
            sx={{
              backgroundColor: isDarkMode ? "#8c9eff" : "#4263eb",
              color: isDarkMode ? "#1a1a2a" : "#ffffff",
              boxShadow: isDarkMode
                ? "0 4px 20px rgba(140,158,255,0.3)"
                : "0 4px 20px rgba(66,99,235,0.2)",
              "&:hover": {
                backgroundColor: isDarkMode ? "#a5b4ff" : "#3651d4",
              },
              "&:focus": {
                outline: `3px solid ${
                  isDarkMode ? "rgba(140,158,255,0.4)" : "rgba(66,99,235,0.3)"
                }`,
                outlineOffset: 2,
              },
            }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </motion.div>
      </Box>
    </Zoom>
  );
};

export default ScrollToTopButton;
