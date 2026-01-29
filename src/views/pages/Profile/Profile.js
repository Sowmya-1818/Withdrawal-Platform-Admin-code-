import {
  Avatar,
  Box,
  Button,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React, { useContext } from "react";
import GoBack from "src/component/GoBack";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "src/context/Auth";
const useStyles = makeStyles((theme) => ({
  main: {
    "& .publicBox": {
      width: "100%",
      height: "100%",
      "& h6": {
        color: "#fff",
      },
      "& p": {
        color: "#fff",
      },
      [theme.breakpoints.down("sm")]: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
      "& button": {
        marginRight: "80px",
        [theme.breakpoints.down("sm")]: {
          marginTop: "24px",
          marginRight: "0px",
        },
      },
    },

    "& .detailsBox": {
      display: "flex",
      flexDirection: "column",
    },
  },
}));

function Profile() {
  const classes = useStyles();
  const history = useNavigate();
  const auth = useContext(AuthContext);
  return (
    <Box className={classes.main}>
      <Box mb={5}>
        <GoBack title="Profile" />
      </Box>
      <Box mt={5}>
        <Paper elevation={3}>
          <Box className="publicBox displaySpacebetween">
            <Box className={classes.UserProfileImageSection}>
              <Avatar
                src={
                  auth.userData?.profilePic
                    ? auth.userData?.profilePic
                    : "/images/user.png"
                }
                style={{
                  height: "150px",
                  width: "150px",
                }}
              />

              <Box mt={2}>
                <Box className="displayStart">
                  <Typography variant="h6">Name: &nbsp; </Typography>
                  <Typography variant="body2">
                    {auth?.userData?.firstName
                      ? auth?.userData?.firstName
                      : "--"}
                    &nbsp;&nbsp;
                    {auth?.userData?.lastName ? auth?.userData?.lastName : "--"}
                  </Typography>
                </Box>
                <Box className="displayStart">
                  <Typography variant="h6">Email address:&nbsp;</Typography>
                  <Typography variant="body2">
                    {" "}
                    {auth && auth?.userData?.email
                      ? auth?.userData?.email
                      : "--"}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box className="displayColumn">
              <Button
                variant="contained"
                color="primary"
                startIcon={<FaUser style={{ fontSize: "17px" }} />}
                style={{ textTransform: "capitalize" }}
                onClick={() => {
                  history("/edit-profile");
                }}
              >
                Edit Profile
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<FaUser style={{ fontSize: "17px" }} />}
                style={{ textTransform: "capitalize", marginTop: "16px" }}
                onClick={() => {
                  history("/change-password");
                }}
              >
                Change Password
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Profile;
