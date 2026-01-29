import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import NavBar, { sections, subAdmin } from "./NavBar";
import TopBar from "./TopBar";
import { Box } from "@material-ui/core";
import Footer from "./Footer";
import { AuthContext } from "src/context/Auth";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
    overflow: "hidden",
    width: "100%",
    
  },
  root: {
    backgroundColor: "#eef4f8",
    position: "relative",
    height: "100vh",
  
  },

  wrapper: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#251328",
    paddingTop: 70,
    minHeight: "calc(100vh - 75px)",
    [theme.breakpoints.up("lg")]: {
      paddingLeft: 252,
    },
    "@media (max-width:767px)": {
      paddingTop: "64px !important",
    },
  },
  contentContainer: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
  },
  content: {
    flex: "1 1 auto",
    height: "100%",
    overflow: "hidden",
    position: "relative",
    background: "#251327",
    padding: "28px 25px 25px ",
    marginBottom: "80px",
  
    [theme.breakpoints.down("md")]: {
      padding: "25px 10px 10px ",
    },
  },
}));

const DashboardLayout = ({ children }) => {
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  // const themeSeeting = useContext(SettingsContext);
  const auth = useContext(AuthContext);
  const router = useNavigate();

  useEffect(() => {
    if (auth?.userData) {
      const matchedItems = [...sections, ...subAdmin].flatMap((section) =>
        section.items.filter(
          (item) =>
            auth?.userData?.permissions &&
            [...auth?.userData?.permissions, ...["Dashboard"]].includes(
              item.title
            )
        )
      );
      const matchFound =
        matchedItems?.find(
          (item) => item?.href === window.location.pathname
        ) !== undefined;

      if (
        auth.userLoggedIn &&
        auth?.userData?.userType == "SUBADMIN" &&
        !matchFound
      ) {
        router("/dashboard");
      }
    }
  }, [auth, window.location.pathname, sections, subAdmin]);

  return (
    <Box className={classes.root}>
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />
      <Footer />
      <Box className={classes.wrapper}>
        <Box className={classes.contentContainer}>
          <Box className={classes.content} id="main-scroll">
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export default DashboardLayout;
