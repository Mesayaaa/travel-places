"use client";

import { Box, Chip, Typography, Container } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import ParkIcon from "@mui/icons-material/Park";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import CategoryIcon from "@mui/icons-material/Category";
import { useState } from "react";
import { motion } from "framer-motion";

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
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <Box
      component="section"
      id="categories"
      sx={{
        py: { xs: 2, md: 3 },
        background: "#ffffff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        position: "relative",
      }}
    >
      <Container maxWidth="xl">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            mb: { xs: 1.5, md: 2 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
              px: { xs: 1, sm: 2 },
              mt: 1,
            }}
          >
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <Chip
                  key={category.id}
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
                    py: 2.8,
                    borderRadius: "18px",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    letterSpacing: "0.01em",
                    transition: "all 0.3s ease",
                    border: isActive ? "none" : `2px solid ${category.color}40`,
                    color: isActive ? "#ffffff" : category.color,
                    backgroundColor: isActive ? category.color : "transparent",
                    boxShadow: isActive
                      ? `0 6px 15px ${category.color}40`
                      : "none",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: isActive
                        ? `0 8px 20px ${category.color}60`
                        : `0 4px 10px ${category.color}30`,
                      backgroundColor: isActive
                        ? category.color
                        : `${category.color}10`,
                    },
                    "& .MuiChip-icon": {
                      ml: 1,
                      mr: -0.5,
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
