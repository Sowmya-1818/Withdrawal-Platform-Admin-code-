import { AppBar, Box, Typography, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  appBar: {
    bottom: 0,
    top: "auto",
    height: "30px",
    textAlign: "center",
    // padding: "25px 0px",
    padding: "0px",
    background: "rgba(37, 19, 39, 1)",
    width: "100%",
    "& .bottomText": {
      margin: "-8px",
    },
  },
}));
function Footer() {
  const classes = useStyles();
  return (
    <AppBar className={classes.appBar}>
      {/* <Box align="center" className="bottomText">
        <Typography
          variant="body2"
          color="secondary"
          style={{ fontSize: "14px" }}
          className="satoshiRegularlight"
        >
          &copy;2024 All Right Reserved
        </Typography>
      </Box> */}
    </AppBar>
  );
}

export default Footer;
