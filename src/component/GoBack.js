import { Box, Typography, makeStyles } from "@material-ui/core";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  main: {
    "& h5": {
      fontSize: "28px",
      fontWeight: 700,
      color: "#FFFFFF",
      textTransform:"capitalize",
    },
    "& .backButton": {
      border: "2px solid rgba(89, 89, 89, 1)",
      background: "rgba(25, 5, 28, 1)",
      borderRadius: "50%",
      cursor: "pointer",
      height: "30px",
      width: "30px",
      "& svg": {
        fontSize: "20px",
        color: "rgba(255, 255, 255, 1)",
      },
    },
  },
}));
function GoBack({ title }) {
  const classes = useStyles();
  const history = useNavigate();
  return (
    <Box className={classes.main}>
      <Box className="displayStart">
        <Box
          className="backButton displayCenter"
          onClick={() => {
            history(-1);
          }}
          mr={2}
        >
          <IoIosArrowBack />
        </Box>
        <Typography variant="h5">{title && title}</Typography>
      </Box>
    </Box>
  );
}

export default GoBack;
