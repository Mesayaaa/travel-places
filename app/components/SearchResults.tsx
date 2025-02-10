"use client";

import { Grid, Box, Typography, Button, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import PlaceCard from "./PlaceCard";
import { Place } from "../data/places";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface SearchResultsProps {
  isLoading: boolean;
  error: string | null;
  places: Place[];
}

const renderLoadingSkeleton = () => (
  <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <Grid item key={item} xs={4} sm={4} md={4}>
        <Box sx={{ borderRadius: 4, overflow: "hidden" }}>
          <Skeleton
            variant="rectangular"
            height={288}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "&::after": {
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
              },
            }}
          />
          <Box sx={{ p: 2, bgcolor: "rgba(255, 255, 255, 0.05)" }}>
            <Skeleton
              variant="text"
              width="60%"
              sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
            />
            <Skeleton
              variant="text"
              width="80%"
              sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
            />
            <Skeleton
              variant="text"
              width="40%"
              sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
            />
          </Box>
        </Box>
      </Grid>
    ))}
  </Grid>
);

export default function SearchResults({
  isLoading,
  error,
  places,
}: SearchResultsProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {isLoading ? (
        renderLoadingSkeleton()
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-12 text-white"
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 1, textAlign: "center", color: "error.main" }}
          >
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Coba Lagi
          </Button>
        </motion.div>
      ) : places.length > 0 ? (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{
            "& > *:nth-of-type(3n+1)": {
              transform: "translateY(20px) translateZ(20px)",
            },
            "& > *:nth-of-type(3n+2)": {
              transform: "translateY(-20px) translateZ(40px)",
            },
            "& > *:nth-of-type(3n+3)": {
              transform: "translateZ(60px)",
            },
          }}
        >
          {places.map((place) => (
            <Grid
              item
              key={place.id}
              xs={4}
              sm={4}
              md={4}
              component={motion.div}
              variants={item}
            >
              <PlaceCard place={place} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-12 text-white"
        >
          <SentimentDissatisfiedIcon
            sx={{ fontSize: 64, mb: 2, opacity: 0.7 }}
          />
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 1, textAlign: "center" }}
          >
            Tidak ada tempat yang ditemukan
          </Typography>
          <Typography
            variant="body1"
            sx={{ opacity: 0.7, textAlign: "center" }}
          >
            Coba ubah filter atau kata kunci pencarian Anda
          </Typography>
        </motion.div>
      )}
    </motion.div>
  );
}
