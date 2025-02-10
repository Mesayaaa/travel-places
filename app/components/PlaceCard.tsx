"use client";

import { Card, CardMedia, Typography, Box, Zoom } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Place } from "../data/places";
import { useState } from "react";

interface PlaceCardProps {
  place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(place.mapsLink, "_blank");
  };

  return (
    <Card
      onClick={handleMapClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: "relative",
        height: 400,
        cursor: "pointer",
        overflow: "hidden",
        borderRadius: "20px",
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

      {/* Dark overlay with content */}
      <Box
        className="overlay"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 3,
          opacity: isHovered ? 1 : 0.7,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "white",
            fontWeight: 600,
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            mb: 1,
          }}
        >
          {place.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.9)",
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            mb: 2,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {place.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.3s ease-in-out 0.1s",
          }}
        >
          <LocationOnIcon sx={{ color: "white" }} />
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontWeight: 500,
            }}
          >
            View on Maps
          </Typography>
        </Box>
      </Box>

      <Zoom in={isHovered}>
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "rgba(255,255,255,0.9)",
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
          }}
        >
          <MapIcon color="primary" />
        </Box>
      </Zoom>
    </Card>
  );
}
