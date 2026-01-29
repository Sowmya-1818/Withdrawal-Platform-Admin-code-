import React, { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  makeStyles,
  IconButton,
  Typography,
  SvgIcon,
  Toolbar,
  AppBar,
  Hidden,
  Avatar,
  Grid,
  Box,
} from "@material-ui/core";
import { Menu as MenuIcon } from "react-feather";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "src/context/Auth";
import Logo from "src/component/Logo";
import { BiBell } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { HiOutlineKey } from "react-icons/hi";
import { IoIosHelpCircleOutline, IoMdChatbubbles } from "react-icons/io";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    padding: "7px 30px 7px 30px",
    background: "#221224",
    [theme.breakpoints.down("sm")]: {
      padding: "0px 20px 0px 20px",
    },
  },
  logo: {
    marginRight: theme.spacing(2),
  },
  link: {
    fontWeight: theme.typography.fontWeightMedium,
    "& + &": {
      marginLeft: theme.spacing(2),
    },
  },
  divider: {
    width: 1,
    height: 32,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  mainheader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    "& h5": {
      color: "#FFFFFF",
      [theme.breakpoints.down("sm")]: {
        whiteSpace: "pre",
        fontSize: "14px !important",
      },
    },
    "& svg": {
      color: theme.palette.text.primary,
    },
    "& .leftBox": {
      display: "flex",
      gap: "10px",
    },
  },
  mainpopperBox: {
    "& .MuiPaper-root": {
      boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.25) !important",
      borderRadius: "15px",
      marginTop: "70px",
      maxWidth: "300px",
      width: "100%",
    },
    "& h6": {
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "21px",
      letterSpacing: "0em",
      textAlign: "center",
    },
    "& svg": {
      fontSize: "20px",
      marginRight: "10px",
      color: "#9D9D9D",
    },
  },
  mainLeafBox: {
    padding: "15px 14px",
    cursor: "pointer",
    "&:hover": {
      background: "#f5f5f5",
    },
  },
}));

const sidebarData = [
  {
    icon: <FaRegUser />,
    list: "My account",
    route: "/my-account",
  },
  {
    icon: <HiOutlineKey />,
    list: "Password & Security",
    route: "/security",
  },
  {
    icon: <IoShieldCheckmarkOutline />,
    list: "Privacy Policy",
    route: "/privacy",
  },
  {
    icon: <IoIosHelpCircleOutline />,
    list: "Terms & Condition",
    route: "/terms-and-conditions",
  },
  {
    icon: <IoMdChatbubbles />,
    list: "Rules & FAQ’s",
    route: "/faqs",
  },
];

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  const classes = useStyles();
  const location = useLocation();
  const auth = useContext(AuthContext);
  const history = useNavigate();
  const [profileData, setProfileData] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (auth?.userData) {
      setProfileData({
        profilePic: auth?.userData?.profilePic,
      });
    }
  }, [auth?.userData]);

  return (
    <AppBar
      elevation={0}
      className={clsx(classes.root, className)}
      color="inherit"
      style={{ boxShadow: "0px 4px 4px rgb(0 0 0 / 10%)" }}
      {...rest}
    >
      <Toolbar className={classes.toolbar}>
        <Hidden lgUp>
          <IconButton
            color="#00e0b0"
            onClick={onMobileNavOpen}
            style={{ padding: "0px" }}
          >
            <SvgIcon>
              <MenuIcon style={{ color: "#DE14FF", fontSize: "25px" }} />
            </SvgIcon>
          </IconButton>
        </Hidden>
        &nbsp; &nbsp;
        <Box className={classes.mainheader}>
          <Grid container alignItems="center">
            <Grid item sm={5} xs={5}>
              <Box
                className="leftBox"
                onClick={() => {
                  history("/dashboard");
                }}
                style={{ cursor: "pointer" }}
              >
                <Logo width="55px" />
                <Typography variant="h5">String Withdraw Platform</Typography>
                
              </Box>
            </Grid>

            <Grid sm={7} xs={7}>
              <Box
                className="displayEnd"
                onClick={() => {
                  history("/profile");
                }}
                style={{ cursor: "pointer" }}
              >
                <Avatar
                  src={
                    auth.userData?.profilePic
                      ? auth.userData?.profilePic
                      : "/images/user.png"
                  }
                  width="30px"
                  height="30px"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
};
TopBar.defaultProps = {
  onMobileNavOpen: () => {},
};

export default TopBar;

export function TopBarData() {
  const classes = useStyles();
  const history = useNavigate();
  const auth = useContext(AuthContext);

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        <Hidden xsDown>
          <Box>
            <Typography variant="h5">NFT Marketplace</Typography>
            <Typography variant="body1" style={{ color: "#ffffff9c" }}>
              example@gmail.com
            </Typography>
          </Box>
        </Hidden>
        &nbsp; &nbsp;
        <Avatar
          src={
            auth?.userData?.profilePic
              ? `${auth?.userData?.profilePic}`
              : "https://picsum.photos/533/357"
          }
          className={classes.avatar}
          // onClick={() => history("/admin-profile")}
        />
      </Box>
    </>
  );
}
