"use client";

import {
  Card,
  CardMedia,
  Typography,
  Box,
  Zoom,
  IconButton,
  Modal,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import { Place } from "../data/places";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

interface PlaceCardProps {
  place: Place;
}

const MotionCard = motion(Card);

export default function PlaceCard({ place }: PlaceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();

  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(place.mapsLink, "_blank");
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <MotionCard
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        sx={{
          position: "relative",
          height: {
            xs: 180,
            sm: 280,
            md: 360,
          },
          cursor: "pointer",
          overflow: "hidden",
          borderRadius: {
            xs: "16px",
            sm: "16px",
            md: "20px",
          },
          boxShadow: isHovered
            ? (theme) => `0 8px 24px ${theme.palette.primary.main}20`
            : "0 4px 12px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            "& .MuiCardMedia-root": {
              transform: "scale(1.05)",
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
            background: (theme) => `linear-gradient(to top, 
              ${theme.palette.common.black}E6 0%, 
              ${theme.palette.common.black}80 50%, 
              ${theme.palette.common.black}33 100%)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
            opacity: 1,
            transition: "all 0.3s ease-in-out",
          }}
        >
          <motion.div
            initial={false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "white",
                fontWeight: 700,
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                mb: { xs: 1, sm: 1.5 },
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.5rem",
                  md: "1.75rem",
                },
                lineHeight: { xs: 1.2, sm: 1.4 },
              }}
            >
              {place.name}
            </Typography>
          </motion.div>

          <Box
            onClick={handleMapClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mt: { xs: "auto", sm: 0 },
              cursor: "pointer",
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <LocationOnIcon
              sx={{
                color: "white",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
              }}
            />
            <Typography
              variant="button"
              sx={{
                color: "white",
                fontWeight: 500,
                letterSpacing: 0.5,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              View on Maps
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={handleMapClick}
          sx={(theme) => ({
            position: "absolute",
            top: 8,
            right: 8,
            background: `${theme.palette.primary.main}CC`,
            backdropFilter: "blur(4px)",
            padding: { xs: "8px", sm: "10px" },
            "&:hover": {
              background: theme.palette.primary.dark,
              transform: "scale(1.1)",
              boxShadow: `0 2px 12px ${theme.palette.primary.main}66`,
            },
          })}
        >
          <MapIcon
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
              color: "white",
            }}
          />
        </IconButton>
      </MotionCard>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh",
            outline: "none",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={place.image}
              alt={place.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            />
            <IconButton
              onClick={() => setIsModalOpen(false)}
              sx={(theme) => ({
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: `${theme.palette.common.black}99`,
                color: "white",
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  transform: "scale(1.1)",
                },
              })}
            >
              <CloseIcon />
            </IconButton>
          </motion.div>
        </Box>
      </Modal>
    </>
  );
}
