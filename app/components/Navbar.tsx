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
import { useTheme as useMuiTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useFavorites } from "../context/FavoritesContext";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useTrip } from "../context/TripContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useTheme } from "../context/ThemeContext";

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
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const { favoritesCount } = useFavorites();
  const { placesInTrip, openTripPlanModal, setOpenTripPlanModal } = useTrip();
  const router = useRouter();
  const { mode, toggleTheme } = useTheme();
  const isDarkMode = mode === "dark";

  // Helper function to check if an item should be active
  const isItemActive = (href: string) => {
    return activeSection === href;
  };

  // Detect scroll position to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      // Check if we're on the profile page
      const isProfilePage = window.location.pathname.includes("/profile");
      if (isProfilePage) {
        setActiveSection("/profile");
        return;
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

    // Run initially to set correct active section on page load
    handleScroll();

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

    // Check if we're on the profile page
    const isProfilePage = window.location.pathname.includes("/profile");

    // Handle Home link to scroll to top
    if (href === "/") {
      if (isProfilePage) {
        router.push("/");
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
      return;
    }

    // Smooth scroll to section if on home page, or navigate to home page with hash if on profile
    if (href.startsWith("#")) {
      if (isProfilePage) {
        // If on profile page, navigate to home page with hash
        router.push(`/${href}`);
      } else {
        // If on home page, scroll to section
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
    } else {
      // For any other paths, use router
      router.push(href);
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
          <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"} arrow>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: isDarkMode ? "orange" : "primary.main",
                transition: "all 0.3s ease",
              }}
            >
              {isDarkMode ? (
                <LightModeOutlinedIcon />
              ) : (
                <DarkModeOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>
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
              backgroundColor: isItemActive(item.href)
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
                fontWeight: isItemActive(item.href) ? 600 : 500,
                fontSize: "1rem",
                color: isItemActive(item.href)
                  ? "primary.main"
                  : "text.primary",
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
        backdropFilter: scrolled ? "blur(10px)" : "none",
        backgroundColor: isDarkMode
          ? scrolled
            ? "rgba(18, 18, 18, 0.8)"
            : "transparent"
          : scrolled
          ? "rgba(255, 255, 255, 0.8)"
          : "transparent",
        boxShadow: scrolled ? "0 4px 30px rgba(0, 0, 0, 0.1)" : "none",
        position: "fixed",
        width: "100%",
        zIndex: 1000,
        transition: "all 0.3s ease-in-out",
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
                color: scrolled
                  ? "primary.main"
                  : isDarkMode
                  ? "white"
                  : "white",
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
                color: scrolled
                  ? isDarkMode
                    ? "text.primary"
                    : "text.primary"
                  : isDarkMode
                  ? "white"
                  : "white",
                fontSize: { xs: "1.2rem", sm: "1.4rem" },
                textShadow: scrolled
                  ? "none"
                  : isDarkMode
                  ? "0 2px 10px rgba(0,0,0,0.3)"
                  : "0 2px 10px rgba(0,0,0,0.2)",
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
                  color: scrolled
                    ? isDarkMode
                      ? "rgba(255, 255, 255, 0.9)"
                      : "text.primary"
                    : isDarkMode
                    ? "white"
                    : "white",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  position: "relative",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: scrolled
                      ? isDarkMode
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(25, 118, 210, 0.08)"
                      : "rgba(255, 255, 255, 0.2)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    position: "relative",
                    "&::after": {
                      content: "''",
                      position: "absolute",
                      width: isItemActive(item.href) ? "100%" : "0%",
                      height: "3px",
                      bottom: "-6px",
                      left: 0,
                      backgroundColor: scrolled ? "primary.main" : "white",
                      transition: "width 0.3s ease",
                      borderRadius: "8px",
                    },
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
            <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"} arrow>
              <IconButton
                onClick={toggleTheme}
                component={motion.button}
                whileHover={{ scale: 1.1, rotate: isDarkMode ? 180 : 0 }}
                whileTap={{ scale: 0.9 }}
                initial={{ rotate: isDarkMode ? 180 : 0 }}
                animate={{ rotate: isDarkMode ? 180 : 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                  bgcolor: scrolled
                    ? isDarkMode
                      ? "rgba(255, 255, 255, 0.15)"
                      : "rgba(0, 0, 0, 0.05)"
                    : "rgba(255, 255, 255, 0.25)",
                  p: 1.2,
                  color: isDarkMode
                    ? "orange"
                    : scrolled
                    ? "primary.main"
                    : "white",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  "&:hover": {
                    bgcolor: isDarkMode
                      ? "rgba(255, 255, 255, 0.25)"
                      : "rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                {isDarkMode ? (
                  <LightModeOutlinedIcon fontSize="small" />
                ) : (
                  <DarkModeOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>

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
                onClick={() => router.push("/profile")}
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
              background: isDarkMode
                ? "rgba(50, 50, 55, 0.8)"
                : "rgba(245,245,247,0.8)",
              "&:hover": {
                background: isDarkMode
                  ? "rgba(70, 70, 75, 1)"
                  : "rgba(235,235,240,1)",
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
