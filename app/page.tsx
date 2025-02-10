"use client";

import {
  Container,
  Grid,
  Box,
  Typography,
  Button as MuiButton,
} from "@mui/material";
import { motion, useInView } from "framer-motion";
import PlaceCard from "./components/PlaceCard";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { places } from "./data/places";
import { useRef, useState, useEffect } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

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

// Create a motion-enhanced Button
const MotionButton = motion(MuiButton);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref);

  // Simulasi loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Loading selama 2 detik

    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)",
        pt: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Typography
            variant="h1"
            className="animated-title"
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
              mb: { xs: 2, sm: 3, md: 4 },
              textAlign: "center",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100px",
                height: "4px",
                background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                borderRadius: "2px",
              },
            }}
          >
            LESGOOO KITA PERGI KE
          </Typography>
        </motion.div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          style={{ perspective: "1000px" }}
        >
          <Grid
            container
            spacing={{ xs: 2, sm: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{
              py: { xs: 1, sm: 2 },
              mx: "auto",
              maxWidth: "1600px",
            }}
          >
            {isLoading
              ? // Tampilkan skeleton saat loading
                Array.from(new Array(6)).map((_, index) => (
                  <Grid item xs={4} sm={4} md={4} key={index}>
                    <LoadingSkeleton />
                  </Grid>
                ))
              : // Tampilkan data sebenarnya setelah loading selesai
                places.map((place, index) => (
                  <Grid
                    item
                    xs={4}
                    sm={4}
                    md={4}
                    key={place.id}
                    component={motion.div}
                    variants={item}
                    whileHover={{ scale: 1.02, zIndex: 1 }}
                    custom={index}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.5,
                          delay: index * 0.1,
                        },
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      <PlaceCard place={place} />
                    </motion.div>
                  </Grid>
                ))}
          </Grid>
        </motion.div>

        {/* Tombol Kembali ke Atas */}
        <MotionButton
          variant="contained"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            bgcolor: "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: "secondary.main",
              transform: "scale(1.1)",
            },
            borderRadius: "50%",
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowUpwardIcon />
        </MotionButton>
      </Container>
    </Box>
  );
}
