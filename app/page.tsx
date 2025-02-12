"use client";

import { Container, Grid, Box, Typography } from "@mui/material";
import { motion, useInView } from "framer-motion";
import PlaceCard from "./components/PlaceCard";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { places } from "./data/places";
import { useRef, useState, useEffect } from "react";

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

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)",
        pt: { xs: 1, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
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
              fontSize: {
                xs: "1.75rem",
                sm: "2.5rem",
                md: "3.5rem",
              },
              mb: { xs: 1.5, sm: 3, md: 4 },
              textAlign: "center",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "-8px",
                left: "50%",
                transform: "translateX(-50%)",
                width: { xs: "60px", sm: "100px" },
                height: { xs: "3px", sm: "4px" },
                background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                borderRadius: "2px",
              },
            }}
          >
            LESGOOO SAYANG KITA PERGI KE
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
            spacing={{ xs: 1.5, sm: 2, md: 3 }}
            columns={{ xs: 12, sm: 12, md: 12 }}
            sx={{
              py: { xs: 1, sm: 2 },
              mx: "auto",
              maxWidth: "1600px",
            }}
          >
            {isLoading
              ? Array.from(new Array(6)).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <LoadingSkeleton />
                  </Grid>
                ))
              : places.map((place, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={place.id === 4 ? 7 : 4}
                    key={place.id}
                    component={motion.div}
                    variants={item}
                    whileHover={{ scale: 1.02, zIndex: 1 }}
                    custom={index}
                    sx={{
                      ...(place.id === 4 && {
                        maxWidth: "100%",
                        width: "100%",
                        px: { md: 4 },
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "center",
                        gridColumn: { md: "span 12" },
                      }),
                    }}
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
                      style={
                        place.id === 4
                          ? { width: "100%", maxWidth: "800px" }
                          : undefined
                      }
                    >
                      <PlaceCard place={place} />
                    </motion.div>
                  </Grid>
                ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
