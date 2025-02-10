"use client";

import { Container, Grid, Box, Fade } from "@mui/material";
import PlaceCard from "./components/PlaceCard";
import { places } from "./data/places";

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)",
        pt: 4,
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{
            py: 2,
            mx: "auto",
            maxWidth: "1600px",
          }}
        >
          {places.map((place, index) => (
            <Fade key={place.id} in={true} timeout={500 + index * 200}>
              <Grid item xs={4} sm={4} md={4}>
                <PlaceCard place={place} />
              </Grid>
            </Fade>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
