import React from "react";
import { makeStyles, Box } from "@material-ui/core";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  loginLayoutBox: {
    background: "#fff",
    zIndex: "9",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    height: "100vh",
    "& .backBtn": {
      position: "absolute",
      top: 30,
      left: 30,
      border: "1px solid rgba(0, 0, 0, 0.08)",
      [theme.breakpoints.down("md")]: {
        top: 15,
        left: 15,
      },
    },
  },
  loginContentLayoutBox: {
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      paddingLeft: "0px",
    },
  },
}));

export default function LoginLayout({ children }) {
  const history = useNavigate();
  const classes = useStyles();

  return (
    <Box className={classes.loginLayoutBox}>
      <Box className={classes.loginContentLayoutBox}>
        <Box style={{ width: "100%", height: "100%" }}>
          <Box
            style={{
              minHeight: "calc(100dvh)",
              background: "#1A0D1C",
            }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
LoginLayout.propTypes = {
  children: PropTypes.node,
};
