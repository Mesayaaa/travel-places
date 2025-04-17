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
  Backdrop,
  CircularProgress,
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
import { useRouter, usePathname } from "next/navigation";
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
  { name: "Trip Planner", href: "#trip-plans" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("/");
  const [loading, setLoading] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"));
  const { favoritesCount } = useFavorites();
  const { placesInTrip, openTripPlanModal, setOpenTripPlanModal } = useTrip();
  const router = useRouter();
  const pathname = usePathname();
  const { mode, toggleTheme } = useTheme();
  const isDarkMode = mode === "dark";
  const [isProfilePage, setIsProfilePage] = useState(false);

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
      const currentIsProfilePage =
        window.location.pathname.includes("/profile");
      setIsProfilePage(currentIsProfilePage);

      if (currentIsProfilePage) {
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
          // Make this more accurate by checking if it's closer to the center
          if (rect.top <= 150 && rect.bottom >= 50) {
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
  }, [scrolled, navItems]);

  // Clear loading when we've navigated to profile page
  useEffect(() => {
    if (pathname === "/profile" && loading) {
      // Add a small delay to ensure the page has loaded
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [pathname, loading]);

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

  const handleProfileClick = () => {
    // If already on profile page, do nothing
    if (pathname === "/profile") {
      return;
    }

    setLoading(true);

    try {
      // Set timeout to ensure loading state is visible before navigation
      setTimeout(() => {
        router.push("/profile");

        // Set a fallback timeout to clear loading state in case navigation fails
        setTimeout(() => {
          if (loading) setLoading(false);
        }, 3000);
      }, 300);
    } catch (error) {
      console.error("Navigation error:", error);
      setLoading(false);
    }
  };

  const handleFavoritesClick = () => {
    // If already on favorites page, do nothing
    if (pathname === "/favorites") {
      return;
    }

    setLoadingFavorites(true);

    try {
      // Set timeout to ensure loading state is visible before navigation
      setTimeout(() => {
        router.push("/favorites");

        // Set a fallback timeout to clear loading state in case navigation fails
        setTimeout(() => {
          if (loadingFavorites) setLoadingFavorites(false);
        }, 3000);
      }, 300);
    } catch (error) {
      console.error("Navigation error:", error);
      setLoadingFavorites(false);
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
                "&:hover": {
                  transform: "rotate(180deg)",
                  backgroundColor: isDarkMode
                    ? "rgba(255, 165, 0, 0.1)"
                    : "rgba(25, 118, 210, 0.1)",
                },
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
                position: "relative",
                "&:hover": {
                  transform: "scale(1.1)",
                  transition: "transform 0.2s ease",
                },
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
                    animation:
                      favoritesCount > 0 ? "pulse 1.5s infinite" : "none",
                  },
                  "@keyframes pulse": {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.2)" },
                    "100%": { transform: "scale(1)" },
                  },
                }}
              >
                <FavoriteIcon />
              </Badge>
            </Box>
          </Tooltip>
          <IconButton
            onClick={handleDrawerToggle}
            aria-label="close menu"
            sx={{
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "rotate(90deg)",
              },
            }}
          >
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
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.15)",
                transform: "translateX(5px)",
              },
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                borderRadius: "10px",
                boxShadow: isItemActive(item.href)
                  ? "0 0 15px rgba(25, 118, 210, 0.2)"
                  : "none",
                transition: "box-shadow 0.3s ease",
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
              sx={{
                "& .MuiTypography-root": {
                  fontWeight: isItemActive(item.href) ? 600 : 500,
                  fontSize: "1rem",
                  color: isItemActive(item.href)
                    ? "primary.main"
                    : "text.primary",
                  transition: "all 0.3s ease",
                },
              }}
            />
          </ListItem>
        ))}

        {/* Profile Button */}
        <ListItem
          button
          onClick={() => {
            handleDrawerToggle();
            handleProfileClick();
          }}
          sx={{
            textAlign: "center",
            py: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1.5,
            borderRadius: "10px",
            mx: 2,
            my: 1.5,
            backgroundColor: isProfilePage
              ? "rgba(25, 118, 210, 0.08)"
              : "transparent",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.15)",
              transform: "translateX(5px)",
            },
            border: isProfilePage
              ? "1px solid rgba(25, 118, 210, 0.3)"
              : "none",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              borderRadius: "10px",
              boxShadow: isProfilePage
                ? "0 0 15px rgba(25, 118, 210, 0.2)"
                : "none",
              transition: "box-shadow 0.3s ease",
            },
          }}
        >
          <Box
            sx={{
              color: "primary.main",
              display: "flex",
              position: "relative",
            }}
          >
            {isProfilePage && (
              <Box
                component={motion.div}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: "2px solid",
                  borderColor: "primary.main",
                }}
              />
            )}
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: isProfilePage ? "primary.dark" : "primary.main",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 16 }} />
            </Avatar>
          </Box>
          <ListItemText
            primary="Profil Saya"
            sx={{
              "& .MuiTypography-root": {
                fontWeight: isProfilePage ? 600 : 500,
                fontSize: "1rem",
                color: isProfilePage ? "primary.main" : "text.primary",
              },
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        component={motion.div}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        sx={{
          backdropFilter: scrolled ? "blur(10px)" : "none",
          backgroundColor: isDarkMode
            ? scrolled
              ? "rgba(18, 18, 18, 0.85)"
              : "transparent"
            : scrolled
            ? "rgba(255, 255, 255, 0.85)"
            : "transparent",
          boxShadow: scrolled ? "0 4px 30px rgba(0, 0, 0, 0.1)" : "none",
          position: "fixed",
          width: "100%",
          zIndex: 1000,
          transition: "all 0.3s ease-in-out",
          opacity: isProfilePage && !isDarkMode && !scrolled ? 0 : 1,
          visibility:
            isProfilePage && !isDarkMode && !scrolled ? "hidden" : "visible",
          transform:
            isProfilePage && !isDarkMode && !scrolled
              ? "translateY(-100%)"
              : "translateY(0)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: scrolled ? 0.5 : 1,
              transition: "padding 0.3s ease",
              px: { xs: 2, sm: 3, md: 4 },
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
                  mr: { xs: 1, sm: 1.5 },
                  color: scrolled
                    ? "primary.main"
                    : isDarkMode
                    ? "white"
                    : "white",
                  fontSize: { xs: 20, sm: 24, md: 28 },
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
                  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
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

            <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2, gap: 1 }}>
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => handleNavClick(item.href)}
                    sx={{
                      my: 1,
                      mx: { md: 0.5, lg: 1.2 },
                      color: scrolled
                        ? isDarkMode
                          ? "rgba(255, 255, 255, 0.9)"
                          : "text.primary"
                        : isDarkMode
                        ? "white"
                        : "white",
                      fontSize: { md: "0.85rem", lg: "0.9rem" },
                      fontWeight: 500,
                      position: "relative",
                      padding: { md: "6px 12px", lg: "8px 16px" },
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
                        gap: { md: 0.5, lg: 0.8 },
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
                </motion.div>
              ))}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
              }}
            >
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
                    color: isDarkMode
                      ? "orange"
                      : scrolled
                      ? "primary.main"
                      : "white",
                    fontSize: { xs: "1.2rem", sm: "1.5rem" },
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
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: "flex" }}
                >
                  <IconButton
                    onClick={handleFavoritesClick}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: scrolled ? "primary.main" : "white",
                      transition: "color 0.3s ease",
                      fontSize: { xs: "1.2rem", sm: "1.5rem" },
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
                          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        },
                      }}
                    >
                      <FavoriteIcon
                        sx={{
                          color: "inherit",
                          filter: scrolled
                            ? "none"
                            : "drop-shadow(0 2px 3px rgba(0,0,0,0.2))",
                        }}
                      />
                    </Badge>
                  </IconButton>
                </motion.div>
              </Tooltip>

              <Tooltip title="Profil Saya" arrow>
                <IconButton
                  color="primary"
                  sx={{
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.1)" },
                    "&:active": { transform: "scale(0.95)" },
                    position: "relative",
                    "&::after":
                      pathname === "/profile"
                        ? {
                            content: '""',
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            border: "2px solid",
                            borderColor: "primary.main",
                            animation: "pulse 1.5s infinite",
                            opacity: 0.6,
                          }
                        : {},
                    "@keyframes pulse": {
                      "0%": {
                        transform: "scale(1)",
                        opacity: 0.6,
                      },
                      "70%": {
                        transform: "scale(1.2)",
                        opacity: 0,
                      },
                      "100%": {
                        transform: "scale(1.2)",
                        opacity: 0,
                      },
                    },
                  }}
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleProfileClick}
                >
                  <Avatar
                    sx={{
                      width: { xs: 32, sm: 36 },
                      height: { xs: 32, sm: 36 },
                      bgcolor:
                        pathname === "/profile"
                          ? "primary.dark"
                          : "primary.main",
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
                ml: 1,
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
            keepMounted: true,
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
              px: { xs: 2, sm: 3 },
            },
          }}
        >
          {drawer}
        </Drawer>
      </AppBar>

      {/* Loading Backdrop for Profile */}
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: isDarkMode
            ? "rgba(0, 0, 0, 0.7)"
            : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
        }}
        open={loading}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: 120,
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Pulsing circle behind icon */}
            <Box
              component={motion.div}
              initial={{ scale: 0.8, opacity: 0.2 }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
              sx={{
                position: "absolute",
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: isDarkMode
                  ? "radial-gradient(circle, rgba(25, 118, 210, 0.6) 0%, rgba(25, 118, 210, 0) 70%)"
                  : "radial-gradient(circle, rgba(25, 118, 210, 0.3) 0%, rgba(25, 118, 210, 0) 70%)",
              }}
            />

            {/* Rotating path for airplane */}
            <Box
              component={motion.div}
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Path orbit visual */}
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: `2px dashed ${
                    isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"
                  }`,
                }}
              />

              {/* Airplane positioned on the path */}
              <Box
                component={motion.div}
                animate={{
                  rotateZ: 45,
                }}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <FlightTakeoffIcon
                  sx={{
                    fontSize: 32,
                    color: "primary.main",
                    filter: "drop-shadow(0 0 8px rgba(25, 118, 210, 0.5))",
                  }}
                />
              </Box>
            </Box>

            {/* Center point */}
            <Box
              component={motion.div}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: isDarkMode
                  ? "rgba(25, 118, 210, 0.8)"
                  : "rgba(25, 118, 210, 0.7)",
                boxShadow: "0 0 20px rgba(25, 118, 210, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <Typography
                component={motion.div}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                sx={{
                  fontWeight: 900,
                  fontSize: "1.5rem",
                  color: "white",
                }}
              >
                ~
              </Typography>
            </Box>
          </Box>

          {/* Animated text */}
          <Typography
            variant="body1"
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            sx={{
              fontWeight: 500,
              color: isDarkMode ? "white" : "text.primary",
              mt: 2,
              fontSize: "1.1rem",
              letterSpacing: "0.5px",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              Memuat Profil Anda
            </motion.span>

            <motion.span
              animate={{
                opacity: [0, 1, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
                repeatDelay: 0.5,
              }}
            >
              ...
            </motion.span>
          </Typography>
        </Box>
      </Backdrop>

      {/* Loading Backdrop for Favorites */}
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: isDarkMode
            ? "rgba(0, 0, 0, 0.7)"
            : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
        }}
        open={loadingFavorites}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: 120,
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Pulsing heart animation */}
            <Box
              component={motion.div}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FavoriteIcon
                sx={{
                  fontSize: 48,
                  color: "primary.main",
                  filter: "drop-shadow(0 0 8px rgba(25, 118, 210, 0.5))",
                }}
              />
            </Box>

            {/* Center point */}
            <Box
              component={motion.div}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: isDarkMode
                  ? "rgba(25, 118, 210, 0.8)"
                  : "rgba(25, 118, 210, 0.7)",
                boxShadow: "0 0 20px rgba(25, 118, 210, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <Typography
                component={motion.div}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                sx={{
                  fontWeight: 900,
                  fontSize: "1.5rem",
                  color: "white",
                }}
              >
                ♥
              </Typography>
            </Box>
          </Box>

          {/* Animated text */}
          <Typography
            variant="body1"
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            sx={{
              fontWeight: 500,
              color: isDarkMode ? "white" : "text.primary",
              mt: 2,
              fontSize: "1.1rem",
              letterSpacing: "0.5px",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              Memuat Favorit Anda
            </motion.span>

            <motion.span
              animate={{
                opacity: [0, 1, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
                repeatDelay: 0.5,
              }}
            >
              ...
            </motion.span>
          </Typography>
        </Box>
      </Backdrop>
    </>
  );
}
