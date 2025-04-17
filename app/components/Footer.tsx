import { Box, Container, Typography, Grid } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";

interface FooterProps {
  isDarkMode: boolean;
}

export default function Footer({ isDarkMode }: FooterProps) {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 3, sm: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 9, sm: 4, md: 6 },
        background: isDarkMode ? "#121212" : "#f8f9fa",
        color: isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
        textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h6" component="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Travel Places
        </Typography>

        <Grid container spacing={3} justifyContent="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Contact
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <EmailIcon fontSize="small" />
                <Typography variant="body2">info@travelplaces.com</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <PhoneIcon fontSize="small" />
                <Typography variant="body2">+1 234 567 890</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">Jakarta, Indonesia</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 2 }}>
          © {new Date().getFullYear()} Travel Places. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
