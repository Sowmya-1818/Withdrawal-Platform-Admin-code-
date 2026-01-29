import {
  Avatar,
  Box,
  Divider,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import { useNavigate } from "react-router-dom";

const useStyle = makeStyles(() => ({
  DashboardActivityBox: {
    background: "#fff",
    borderRadius: "10px",
    height: "85vh",
    padding: "15px",
    "& .depositeBox": {
      padding: "18px",
      background: "#EC1F24",
      borderRadius: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      marginBottom: "8px",
      transition: "0.5s",
      "&:hover": {
        transform: "scale(1.1)",
        boxShadow:
          "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      },
      "& img": {
        maxWidth: "100%",
        width: "auto",
      },
    },
    "& .spacebox": {
      maxWidth: "225px",
      margin: "auto",
      marginTop: "50px",
      marginBottom: "10px",
    },
    "& .activityCard": {
      display: "flex",
      alignItems: "center",
      padding: "20px 0px 15px",

      "& .MuiAvatar-root": {
        background: "#262626",
        width: "50px",
        height: "50px",
      },
      // "& .MuiAvatar-img": {
      //   objectFit: "none",
      // },
    },
    "& .fixHeightBox": {
      overflow: "auto",
      marginTop: "10px",
      height: "calc(100vh - 415px)",
    },
  },
}));
const dataactivity = [
  {
    img: "images/avatar1.png",
    data1: "Deposit",
    data2: "Money send",
    price: "-2000",
    date: "April23",
  },
  {
    img: "images/avatar3.png",
    data1: "Withdraw",
    data2: "Money Received",
    price: "+5243",
    date: "April23",
  },
  {
    img: "images/avatar4.png",
    data1: "Deposit",
    data2: "Money send",
    price: "-2000",
    date: "April23",
  },
  {
    img: "images/avatar2.png",
    data1: "Deposit",
    data2: "Money send",
    price: "-2000",
    date: "April23",
  },
  {
    img: "images/avatar1.png",
    data1: "Deposit",
    data2: "Money send",
    price: "-2000",
    date: "April23",
  },
  {
    img: "images/avatar3.png",
    data1: "Deposit",
    data2: "Money send",
    price: "-2000",
    date: "April23",
  },
  {
    img: "images/avatar4.png",
    data1: "Deposit",
    data2: "Money send",
    price: "-2000",
    date: "April23",
  },
  {
    img: "images/avatar2.png",
    data1: "Deposit",
    data2: "Money send",
    price: "-2000",
    date: "April23",
  },
  {
    img: "images/avatar1.png",
    data1: "Deposit",
    data2: "Money send",
    price: "-2000",
    date: "April23",
  },
  {
    img: "images/avatar3.png",
    data1: "Deposit",
    data2: "Money send",
    price: "-2000",
    date: "April23",
  },
  {
    img: "images/avatar4.png",
    data1: "Deposit",
    data2: "Money send",
    price: "-2000",
    date: "April23",
  },
  {
    img: "images/avatar2.png",
    data1: "Deposit",
    data2: "Money send",
    price: "-2000",
    date: "April23",
  },
  {
    img: "images/avatar1.png",
    data1: "Deposit",
    data2: "Money send",
    price: "-2000",
    date: "April23",
  },
  {
    img: "images/avatar2.png",
    data1: "Deposit",
    data2: "Money send",
    price: "-2000",
    date: "April23",
  },
  {
    img: "images/avatar3.png",
    data1: "Deposit",
    data2: "Money send",
    price: "-2000",
    date: "April23",
  },
];

export default function DashboardActivity() {
  const classes = useStyle();
  const history = useNavigate();
  return (
    <Box className={classes.DashboardActivityBox}>
      <Box align="center">
        <Box mt={3}>
          <Typography variant="h3">$ 267,820.00</Typography>
        </Box>
        <Typography variant="body1">Your available balance</Typography>
      </Box>
      <Box className="displaySpacebetween spacebox">
        <Box align="center">
          <Box className="depositeBox" onClick={() => history("/deposit")}>
            <img src="images/deposite.svg" alt="" />
          </Box>
          <Typography variant="body1">Deposit</Typography>
        </Box>
        <Box align="center">
          <Box className="depositeBox" onClick={() => history("/withdraw")}>
            <img src="images/widthdraw.svg" alt="" />
          </Box>
          <Typography variant="body1">Withdraw</Typography>
        </Box>
        <Box align="center">
          <Box className="depositeBox" onClick={() => history("/transfer")}>
            <img src="images/transfer.svg" alt="" />
          </Box>
          <Typography variant="body1">Transfer</Typography>
        </Box>
      </Box>
      <Box my={2}>
        <Divider style={{ width: "100%" }} />
      </Box>
      <Box className="displaySpacebetween">
        <Typography variant="body2">See Activity</Typography>
        <Typography
          variant="body2"
          style={{ color: "#EC1F24", cursor: "pointer" }}
        >
          View all
        </Typography>
      </Box>
      <Box className="fixHeightBox">
        {dataactivity.map((value) => (
          <>
            <Box className="displaySpacebetween activityCard">
              <Box style={{ display: "flex", alignItems: "center" }}>
                <Avatar src={value.img} />
                <Box ml={1.5}>
                  <Typography variant="body2">{value.data1}</Typography>
                  <Typography
                    variant="body1"
                    style={{ color: "#78819F", paddingTop: "5px" }}
                  >
                    {value.data2}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2">{value.price}</Typography>
                <Typography
                  variant="body1"
                  style={{ color: "#78819F", paddingTop: "5px" }}
                >
                  {value.date}
                </Typography>
              </Box>
            </Box>
            <Box className="displayEnd">
              <Box style={{ border: "1px dashed #E2E2E2", width: "100%" }} />
            </Box>
          </>
        ))}
      </Box>
    </Box>
  );
}
