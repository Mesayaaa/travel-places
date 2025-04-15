"use client";

import { Card, Skeleton, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const MotionCard = motion(Card);

export default function LoadingSkeleton() {
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";

  return (
    <MotionCard
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        height: {
          xs: 280,
          sm: 320,
          md: 400,
        },
        borderRadius: {
          xs: "16px",
          sm: "20px",
          md: "24px",
        },
        overflow: "hidden",
        position: "relative",
        boxShadow: isDarkMode
          ? "0 8px 25px rgba(0,0,0,0.3)"
          : "0 8px 25px rgba(0,0,0,0.1)",
        bgcolor: "transparent",
      }}
    >
      <Box
        sx={{
          height: "100%",
          background: isDarkMode
            ? "linear-gradient(145deg, #1a1a1a, #222222)"
            : "linear-gradient(145deg, #f0f0f0, #e6e6e6)",
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            backgroundColor: "transparent",
            "&::after": {
              background: isDarkMode
                ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)"
                : "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)",
            },
          }}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: { xs: 2, sm: 2.5, md: 3 },
          background: isDarkMode
            ? "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)",
        }}
      >
        <Skeleton
          variant="text"
          width="70%"
          height={40}
          sx={{
            bgcolor: isDarkMode
              ? "rgba(255,255,255,0.15)"
              : "rgba(255,255,255,0.25)",
            borderRadius: "8px",
          }}
        />
        <Skeleton
          variant="text"
          width="90%"
          height={24}
          sx={{
            bgcolor: isDarkMode
              ? "rgba(255,255,255,0.1)"
              : "rgba(255,255,255,0.15)",
            mt: 1,
            borderRadius: "6px",
          }}
        />
        <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
          <Skeleton
            variant="rectangular"
            width={40}
            height={24}
            sx={{
              bgcolor: isDarkMode
                ? "rgba(255,255,255,0.15)"
                : "rgba(255,255,255,0.2)",
              borderRadius: "4px",
            }}
          />
          <Skeleton
            variant="rectangular"
            width={60}
            height={24}
            sx={{
              bgcolor: isDarkMode
                ? "rgba(255,255,255,0.15)"
                : "rgba(255,255,255,0.2)",
              borderRadius: "4px",
            }}
          />
        </Box>
      </Box>
    </MotionCard>
  );
}

//
