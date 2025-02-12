"use client";

import { Card, Skeleton, Box } from "@mui/material";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export default function LoadingSkeleton() {
  return (
    <MotionCard
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        height: {
          xs: 280,
          sm: 320,
          md: 400,
        },
        borderRadius: {
          xs: "12px",
          sm: "16px",
          md: "20px",
        },
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: { xs: 2, sm: 2.5, md: 3 },
          background:
            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
        }}
      >
        <Skeleton
          variant="text"
          width="60%"
          height={40}
          sx={{ bgcolor: "rgba(255,255,255,0.3)" }}
        />
        <Skeleton
          variant="text"
          width="80%"
          height={24}
          sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
        />
      </Box>
    </MotionCard>
  );
}

//
