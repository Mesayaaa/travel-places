"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Avatar,
  Tooltip,
  Badge,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useFavorites } from "../context/FavoritesContext";

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

// This component is no longer used but kept for reference
// function HideOnScroll(props: Props) {
//   const { children, window } = props;
//   const trigger = useScrollTrigger({
//     target: window ? window() : undefined,
//   });
//
//   return (
//     <Slide appear={false} direction="down" in={!trigger} timeout={400}>
//       {children}
//     </Slide>
//   );
// }

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Destinasi", href: "#categories" },
  { name: "Trip Planner", href: "#plan" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("/");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { favoritesCount } = useFavorites();

  // Detect scroll position to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      // Detect which section is currently in view
      const sections = navItems
        .map((item) => item.href)
        .filter((href) => href.startsWith("#"));

      for (const section of sections) {
        const element = document.querySelector(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }

      // If at top, set home as active
      if (window.scrollY < 100) {
        setActiveSection("/");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (href: string) => {
    if (mobileOpen) {
      setMobileOpen(false);
    }

    setActiveSection(href);

    // Handle Home link to scroll to top
    if (href === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    // Smooth scroll to section
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        const yOffset = -60; // Small offset to ensure the section is clearly visible
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    }
  };

  const drawer = (
    <Box sx={{ textAlign: "center", py: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FlightTakeoffIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            TravelSayang
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Favorit Saya" arrow>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "primary.main",
              }}
            >
              <Badge
                badgeContent={favoritesCount}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.6rem",
                    fontWeight: "bold",
                    minWidth: "16px",
                    height: "16px",
                  },
                }}
              >
                <FavoriteIcon />
              </Badge>
            </Box>
          </Tooltip>
          <IconButton onClick={handleDrawerToggle} aria-label="close menu">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <List sx={{ pt: 2 }}>
        {navItems.map((item) => (
          <ListItem
            key={item.name}
            button
            onClick={() => handleNavClick(item.href)}
            sx={{
              textAlign: "center",
              py: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1.5,
              borderRadius: "10px",
              mx: 2,
              my: 0.5,
              backgroundColor:
                activeSection === item.href
                  ? "rgba(25, 118, 210, 0.08)"
                  : "transparent",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.15)",
              },
            }}
          >
            {item.icon && (
              <Box sx={{ color: "primary.main", display: "flex" }}>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </Box>
            )}
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                fontWeight: activeSection === item.href ? 600 : 500,
                fontSize: "1rem",
                color:
                  activeSection === item.href ? "primary.main" : "text.primary",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.95)" : "transparent",
        boxShadow: scrolled ? "0 4px 20px rgba(0, 0, 0, 0.15)" : "none",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        py: scrolled ? 0.5 : 1,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <FlightTakeoffIcon
              sx={{
                mr: 1.5,
                color: scrolled ? "primary.main" : "white",
                fontSize: { xs: 24, md: 28 },
                transition: "color 0.3s ease",
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: "bold",
                color: scrolled ? "text.primary" : "white",
                fontSize: { xs: "1.2rem", sm: "1.4rem" },
                textShadow: scrolled ? "none" : "0 2px 10px rgba(0,0,0,0.2)",
                transition: "color 0.3s ease, text-shadow 0.3s ease",
              }}
            >
              TravelSayang
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                sx={{
                  my: 1,
                  mx: 1.2,
                  color: scrolled ? "text.primary" : "white",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  position: "relative",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: scrolled
                      ? "rgba(25, 118, 210, 0.08)"
                      : "rgba(255, 255, 255, 0.2)",
                    transform: "translateY(-2px)",
                  },
                  "&::after": {
                    content: "''",
                    position: "absolute",
                    width: activeSection === item.href ? "50%" : "0%",
                    height: "3px",
                    bottom: "2px",
                    left: "25%",
                    backgroundColor: scrolled ? "primary.main" : "white",
                    transition: "width 0.3s ease",
                    borderRadius: "8px",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                  }}
                >
                  {item.icon && (
                    <Box sx={{ lineHeight: 0 }}>
                      {item.badge ? (
                        <Badge
                          badgeContent={item.badge}
                          color="error"
                          sx={{
                            "& .MuiBadge-badge": {
                              fontSize: "0.6rem",
                              fontWeight: "bold",
                              minWidth: "16px",
                              height: "16px",
                            },
                          }}
                        >
                          {item.icon}
                        </Badge>
                      ) : (
                        item.icon
                      )}
                    </Box>
                  )}
                  {item.name}
                </Box>
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Favorit Saya" arrow>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: scrolled ? "primary.main" : "white",
                  transition: "color 0.3s ease",
                }}
              >
                <Badge
                  badgeContent={favoritesCount}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "0.6rem",
                      fontWeight: "bold",
                      minWidth: "16px",
                      height: "16px",
                    },
                  }}
                >
                  <FavoriteIcon sx={{ color: "inherit" }} />
                </Badge>
              </Box>
            </Tooltip>

            <Tooltip title="Profil Saya" arrow>
              <IconButton
                color="primary"
                sx={{
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "scale(1.1)" },
                  "&:active": { transform: "scale(0.95)" },
                }}
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "primary.main",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          <IconButton
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            sx={{
              display: { sm: "none" },
              color: "primary.main",
              background: "rgba(245,245,247,0.8)",
              "&:hover": {
                background: "rgba(235,235,240,1)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer
        anchor={isMobile ? "bottom" : "right"}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        BackdropProps={{
          style: { backgroundColor: "rgba(0,0,0,0.3)" },
        }}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "100%",
            maxHeight: "85vh",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            boxShadow: "0 -5px 25px rgba(0,0,0,0.1)",
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}
