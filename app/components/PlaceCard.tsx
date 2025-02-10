"use client";

import {
  Card,
  CardMedia,
  Typography,
  Box,
  Zoom,
  IconButton,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Place } from "../data/places";
import { useState } from "react";
import { motion } from "framer-motion";

interface PlaceCardProps {
  place: Place;
}

const MotionCard = motion(Card);

export default function PlaceCard({ place }: PlaceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(place.mapsLink, "_blank");
  };

  return (
    <MotionCard
      onClick={handleMapClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      sx={{
        position: "relative",
        height: {
          xs: 280,
          sm: 320,
          md: 400,
        },
        cursor: "pointer",
        overflow: "hidden",
        borderRadius: {
          xs: "12px",
          sm: "16px",
          md: "20px",
        },
        boxShadow: isHovered
          ? "0 8px 24px rgba(0,0,0,0.2)"
          : "0 4px 12px rgba(0,0,0,0.1)",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          "& .MuiCardMedia-root": {
            transform: "scale(1.1)",
          },
          "& .overlay": {
            opacity: 1,
          },
        },
      }}
    >
      <CardMedia
        component="img"
        height="100%"
        image={place.image}
        alt={place.name}
        sx={{
          transition: "transform 0.5s ease-in-out",
        }}
      />

      <Box
        className="overlay"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: { xs: 2, sm: 2.5, md: 3 },
          opacity: { xs: 1, md: isHovered ? 1 : 0.7 },
          transition: "all 0.3s ease-in-out",
        }}
      >
        <motion.div
          initial={false}
          animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "white",
              fontWeight: 700,
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              mb: 1,
              fontSize: {
                xs: "1.25rem",
                sm: "1.5rem",
                md: "1.75rem",
              },
            }}
          >
            {place.name}
          </Typography>
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            y: isHovered ? 0 : 20,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255,255,255,0.95)",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              mb: 2,
              fontSize: {
                xs: "0.875rem",
                sm: "0.9rem",
                md: "1rem",
              },
              lineHeight: 1.6,
            }}
          >
            {place.description}
          </Typography>
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            y: isHovered ? 0 : 20,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <LocationOnIcon sx={{ color: "white" }} />
            <Typography
              variant="button"
              sx={{
                color: "white",
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            >
              View on Maps
            </Typography>
          </Box>
        </motion.div>
      </Box>

      <Zoom in={isHovered}>
        <IconButton
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(4px)",
            "&:hover": {
              background: "rgba(255,255,255,1)",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <MapIcon color="primary" />
        </IconButton>
      </Zoom>
    </MotionCard>
  );
}
