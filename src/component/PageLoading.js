import React from "react";
import { makeStyles, Box, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#19051C",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    justifyContent: "center",
    zIndex: 2000,
  },
  loader: {
    width: 300,
    maxWidth: "100%",
    [theme.breakpoints.down("xs")]: {
      width: 180,
    },
  },
  progressBar: {
    height: "3px",
  },
}));

export default function PageLoading() {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box className="displayColumn">
        <Box>
          <img
            className={classes.loader}
            src="/images/logo1.svg"
            alt="loader"
          />
        </Box>
        <Box>
          <Typography variant="h6" style={{ color: "#FFFFFF" }}>
            loading...
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
