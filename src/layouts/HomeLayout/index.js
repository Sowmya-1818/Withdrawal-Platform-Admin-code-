import React from "react";
import { makeStyles } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import TopBar from "./TopBar";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#FFFFFF",
  },
  MainLayout: {
    minHeight: "calc(100vh - 415px)",
  },
}));

const MainLayout = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TopBar />
      <div
        style={
          window.location.pathname !== "/"
            ? { display: "block" }
            : { display: "none" }
        }
      ></div>

      <div className={classes.MainLayout}>{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;
