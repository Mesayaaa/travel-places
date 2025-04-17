import { useState } from "react";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ContactFormProps {
  isDarkMode: boolean;
}

export default function ContactForm({ isDarkMode }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the form data to your backend
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <Box
      component="section"
      sx={{
        py: 4,
        background: isDarkMode
          ? "rgba(18, 18, 18, 0.8)"
          : "rgba(248, 249, 250, 0.8)",
      }}
    >
      <Typography variant="h5" component="h3" align="center" sx={{ mb: 3 }}>
        Contact Us
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 500,
          mx: "auto",
          px: 2,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Message"
              name="message"
              multiline
              rows={4}
              variant="outlined"
              value={formData.message}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              sx={{ width: "100%" }}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
