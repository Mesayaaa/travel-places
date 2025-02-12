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
    if (place.id === 4 || !place.mapsLink) return;
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
            md: 400,
          },
          cursor: "pointer",
          overflow: "hidden",
          borderRadius: {
            xs: "16px",
            sm: "16px",
            md: "24px",
          },
          boxShadow: isHovered
            ? (theme) => `0 16px 40px ${theme.palette.primary.main}40`
            : "0 8px 24px rgba(0,0,0,0.15)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            "& .MuiCardMedia-root": {
              transform: "scale(1.08)",
            },
            "& .overlay": {
              opacity: 1,
              background: (theme) => `linear-gradient(to top, 
                ${theme.palette.common.black}F0 0%, 
                ${theme.palette.common.black}99 50%, 
                ${theme.palette.common.black}66 100%)`,
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
            {place.id !== 4 && (
              <Typography
                variant="h5"
                sx={{
                  color: "white",
                  fontWeight: 800,
                  textShadow: "2px 2px 12px rgba(0,0,0,0.9)",
                  mb: { xs: 1, sm: 1.5, md: 2 },
                  fontSize:
                    place.id === 1
                      ? {
                          xs: "0.75rem",
                          sm: "1.1rem",
                          md: "1.5rem",
                        }
                      : {
                          xs: "0.9rem",
                          sm: "1.3rem",
                          md: "1.8rem",
                        },
                  lineHeight: { xs: 1.2, sm: 1.4, md: 1.3 },
                  position: "relative",
                  zIndex: 2,
                  background: "rgba(0, 0, 0, 0.7)",
                  padding: {
                    xs: "4px 8px",
                    sm: "4px 12px",
                    md: "8px 16px",
                  },
                  borderRadius: "12px",
                  display: "inline-flex",
                  maxWidth: "90%",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  transition: "transform 0.3s ease",
                  WebkitBoxDecorationBreak: "clone",
                  boxDecorationBreak: "clone",
                  alignItems: "center",
                }}
              >
                {place.name}
              </Typography>
            )}
          </motion.div>

          {place.id !== 4 && (
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
                background: (theme) => ({
                  xs: "rgba(0, 0, 0, 0.5)",
                  sm: "rgba(0, 0, 0, 0.7)",
                }),
                borderRadius: "8px",
                padding: "6px 12px",
                width: "fit-content",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                justifyContent: "center",
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
                  whiteSpace: "nowrap",
                }}
              >
                View on Maps
              </Typography>
            </Box>
          )}
        </Box>

        {place.id !== 4 && (
          <IconButton
            onClick={handleMapClick}
            sx={(theme) => ({
              position: "absolute",
              top: { xs: 8, md: 16 },
              right: { xs: 8, md: 16 },
              background: `${theme.palette.primary.main}E6`,
              backdropFilter: "blur(8px)",
              padding: { xs: "8px", sm: "10px", md: "12px" },
              cursor: "pointer",
              "&:hover": {
                background: theme.palette.primary.dark,
                transform: "scale(1.15) rotate(8deg)",
                boxShadow: `0 4px 20px ${theme.palette.primary.main}99`,
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            })}
          >
            <MapIcon
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
                color: "white",
              }}
            />
          </IconButton>
        )}
      </MotionCard>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3, md: 6 },
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(8px) brightness(0.5)",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            maxWidth: { xs: "90vw", md: "80vw" },
            maxHeight: { xs: "90vh", md: "85vh" },
            outline: "none",
            borderRadius: { xs: 3, md: 4 },
            overflow: "hidden",
            boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <img
              src={place.image}
              alt={place.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "20px",
                boxShadow: "0 12px 36px rgba(0,0,0,0.4)",
              }}
            />
            <IconButton
              onClick={() => setIsModalOpen(false)}
              sx={(theme) => ({
                position: "absolute",
                top: 16,
                right: 16,
                backgroundColor: `${theme.palette.common.black}CC`,
                color: "white",
                padding: "12px",
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  transform: "scale(1.1) rotate(90deg)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              })}
            >
              <CloseIcon sx={{ fontSize: "1.8rem" }} />
            </IconButton>
          </motion.div>
        </Box>
      </Modal>
    </>
  );
}
