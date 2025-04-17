import { Box, Grid, IconButton, Typography } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";

interface IconSectionProps {
  isDarkMode: boolean;
}

export default function IconSection({ isDarkMode }: IconSectionProps) {
  return (
    <Box
      sx={{
        py: 4,
        textAlign: "center",
        background: isDarkMode
          ? "rgba(18, 18, 18, 0.8)"
          : "rgba(248, 249, 250, 0.8)",
      }}
    >
      <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
        Follow Us
      </Typography>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item>
          <IconButton
            aria-label="Instagram"
            sx={{
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(0, 0, 0, 0.7)",
            }}
          >
            <InstagramIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="Twitter"
            sx={{
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(0, 0, 0, 0.7)",
            }}
          >
            <TwitterIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="Facebook"
            sx={{
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(0, 0, 0, 0.7)",
            }}
          >
            <FacebookIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="YouTube"
            sx={{
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(0, 0, 0, 0.7)",
            }}
          >
            <YouTubeIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
}
