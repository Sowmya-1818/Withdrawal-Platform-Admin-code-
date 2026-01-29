import React, { useContext } from "react";

import {
  Grid,
  Box,
  Container,
  Typography,
  makeStyles,
  ListItem,
  List,
  Link,
  IconButton,
} from "@material-ui/core";

// import { UserContext } from 'src/context/User'
import { useNavigate, Link as RouterLink } from "react-router-dom";
import TwitterIcon from "@material-ui/icons/Twitter";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
import { FaFacebookF, FaTelegramPlane } from "react-icons/fa";
const useStyles = makeStyles((theme) => ({
  footerSection: {
    // background: theme.palette.background.card,
    position: "relative",
    padding: "50px 0px 0",
    zIndex: "2",
    overflow: " hidden",
    background: "rgba(255, 255, 255, 0.02)",
    "& .footerContentBox": {
      maxWidth: "340px",
      [theme.breakpoints.down("xs")]: {
        maxWidth: "100%",
      },
    },
    "& .copy": {
      fontSize: "12px",
      borderTop: "2px solid #d0d0d054",
      textAlign: "center",
      fontWeight: "300",
    },
    "& ul": {
      paddingLeft: "0",
      "& li": {
        paddingLeft: "0",
        alignItems: "center",
        color: theme.palette.text.gray,
        fontSize: "14px",
        fontWeight: "300",
        display: "block",
        "& svg": {
          marginRight: "10px",
          color: "#fe2efe",
          fontSize: "15px",
        },
      },
    },
    "& svg": {
      color: "rgba(255 255 255 / 30%)",
      fontSize: "15px",
    },
    "& p": {
      color: theme.palette.text.gray,
    },
    "& h6": {
      color: "#000000",
      [theme.breakpoints.down("sm")]: {
        marginTop: "30px",
      },
      [theme.breakpoints.down("xs")]: {
        marginTop: "10px",
      },
    },

    "& a": {
      display: "flex",
      fontSize: "13px",
      alignItems: "center",
      fontWeight: "400",
      paddingLeft: "0px",
      paddingRight: "0px",
      textDecoration: "none",
      color: "#78819F",
      padding: "3px",
      [theme.breakpoints.only("xs")]: {
        fontSize: "11px",
      },
      "&:hover": {
        color: "#EC1F24",
        textDecoration: "none",
        "& svg": {
          color: "red",
          fontSize: "15px",
        },
      },
    },
    "& .borderBox": {
      position: "absolute",
      left: "153px",
      top: "12px",
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
  },
  iconbtn: {
    "& .MuiIconButton-root": {
      border: "0.5px solid #78819F",
      marginRight: "8px",
      marginBottom: "8px",
      borderRadious: "10px",
      borderRadius: "7px",
      width: "30px",
      height: "30px",
      padding: "0px",
      "& svg": {
        color: "#262626",
        fontSize: "18px",
        "& :hover": {
          "& svg": {
            color: "#EC1F24",
            fontSize: "18px",
          },
        },
      },
    },
  },
}));

export default function Footer() {
  const classes = useStyles();
  const history = useNavigate();

  return (
    <>
      <Box className={classes.footerSection}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={3}>
              <Box style={{}} className="footerContentBox">
                <Box mb={4}>
                  {" "}
                  <RouterLink to="/">
                    <img
                      src="/images/logo.png"
                      alt=""
                      style={{ width: "152px" }}
                    />{" "}
                  </RouterLink>
                </Box>
                <Typography
                  variant="h6"
                  color="primary"
                  style={{ marginBottom: "15px" }}
                >
                  Community
                </Typography>
                <Box
                  className={classes.iconbtn}
                  display="flex"
                  // flexWrap="wrap"
                >
                  <IconButton href="https://www.facebook.com/" target="_blank">
                    <FaFacebookF className={classes.socialIcon} />
                    {/* </Link> */}
                  </IconButton>
                  <IconButton
                    href="https://twitter.com/i/flow/login"
                    target="_blank"
                  >
                    <TwitterIcon className={classes.socialIcon} />
                    {/* </Link> */}
                  </IconButton>

                  <IconButton href="https://telegram.org/" target="_blank">
                    <FaTelegramPlane className={classes.socialIcon} />
                    {/* </Link> */}
                  </IconButton>

                  <IconButton href="https://www.youtube.com/" target="_blank">
                    {/* <Link
                         
                          style={{ color: '#FF0000' }}
                        > */}
                    <YouTubeIcon className={classes.socialIcon} />
                    {/* </Link> */}
                  </IconButton>

                  <IconButton
                    href=" https://www.instagram.com/"
                    target="_blank"
                  >
                    {/* <Link
                         
                          style={{ color: '#E1306C' }}
                        > */}
                    <InstagramIcon className={classes.socialIcon} />
                    {/* </Link> */}
                  </IconButton>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3} md={3}>
              <Typography variant="h6" color="primary">
                Services
              </Typography>
              <List>
                <ListItem to="/" component={RouterLink}>
                  P2P
                </ListItem>

                <ListItem to="/about" component={RouterLink}>
                  Wallet
                </ListItem>
                <ListItem to="/about" component={RouterLink}>
                  Withdraw
                </ListItem>
                <ListItem to="/about" component={RouterLink}>
                  Deposit
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Typography variant="h6" color="primary">
                Support
              </Typography>
              <List>
                <ListItem to="/" component={RouterLink}>
                  FAQ’s
                </ListItem>
                <ListItem to="/about" component={RouterLink}>
                  Privacy policy
                </ListItem>

                <ListItem to="/about" component={RouterLink}>
                  Terms & Conditions
                </ListItem>
                <ListItem to="/faqs" component={RouterLink}>
                  Contact Us
                </ListItem>
                <ListItem to="/faqs" component={RouterLink}>
                  Create a Ticket
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Typography variant="h6" color="primary">
                Contact Us
              </Typography>
              <List>
                <ListItem>
                  <Link href="mailto:support@gmail.com">
                    {/* {user?.userData?.userType === "Admin" ? (
                      <> {user?.userData?.email}</>
                    ) : (
                      <>mailto:support@hovr.com</>
                    )} */}
                    support@gmail.com
                  </Link>

                  <Link href="mailto:info@gmail.com">
                    {/* {user?.userData?.userType === "Admin" ? (
                      <> {user?.userData?.email}</>
                    ) : (
                      <>mailto:support@hovr.com</>
                    )} */}
                    info@gmail.com
                  </Link>
                  <Link href="mailto:support@gmail.com">
                    {/* {user?.userData?.userType === "Admin" ? (
                      <> {user?.userData?.email}</>
                    ) : (
                      <>mailto:support@hovr.com</>
                    )} */}
                    support@gmail.com
                  </Link>
                  <Link href="mailto:info@gmail.com">
                    {/* {user?.userData?.userType === "Admin" ? (
                      <> {user?.userData?.email}</>
                    ) : (
                      <>mailto:support@hovr.com</>
                    )} */}
                    info@gmail.com
                  </Link>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Container>

        <Container>
          <Box className="copy" mt={1}>
            <Box
              alignItems="center"
              my={2}
              position="relative"
              flexWrap="wrap"
              display="flex"
              justifyContent="space-between"
            >
              <Typography
                variant="body1"
                style={{ fontWeight: "400", color: "#78819F" }}
              >
                © 2023 Pacman Admin. All rights reserved.
              </Typography>

              <Box className="displayStart">
                {/* <img
                  src="images/footer_line.png"
                  alt="images"
                  className="borderBox"
                /> */}
                <List className="displayStart">
                  <ListItem
                    to="/privacy-policy"
                    component={RouterLink}
                    style={{ whiteSpace: "pre" }}
                  >
                    About Us
                  </ListItem>

                  <ListItem
                    to="/terms-conditions"
                    component={RouterLink}
                    style={{ marginLeft: "28px", whiteSpace: "pre" }}
                  >
                    Team
                  </ListItem>
                  <ListItem
                    to="/token-disclaimer"
                    component={RouterLink}
                    style={{ marginLeft: "28px", whiteSpace: "pre" }}
                  >
                    Fees
                  </ListItem>
                  <ListItem
                    to="/token-disclaimer"
                    component={RouterLink}
                    style={{ marginLeft: "28px", whiteSpace: "pre" }}
                  >
                    Disclaimer
                  </ListItem>
                </List>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
