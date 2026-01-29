import {
  AppBar,
  Toolbar,
  makeStyles,
  Button,
  IconButton,
  Drawer,
  MenuItem,
  Box,
  Container,
  Menu,
  Paper,
  Dialog,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "./../../component/Logo";
import { NavLink } from "react-router-dom";
import { UserContext } from "src/context/User";

const headersData = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Features",
    href: "/faqs",
  },
  {
    label: "Product",
    href: "/faqs",
  },
  {
    label: "Contact",
    href: "/terms-conditions",
  },
];

const useStyles = makeStyles((theme) => ({
  menuButton: {
    fontSize: "14px",
    lineHeight: "24px",
    fontWeight: "400",
    borderRadius: 0,
    minWidth: "auto",
    color: "#262626",
    padding: "0px 20px",
    textDecoration: " none",
    "@media (max-width: 900px)": {
      fontStyle: "normal",
      letterSpacing: "-0.6px",
      lineHeight: "24px",
      padding: "15px !important",
      height: "51px",
      width: "100%",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    "&.active": {
      color: "#EC1F24",
    },
    "&:hover": {
      color: "#EC1F24",
    },
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    padding: " 5px 0px",
  },
  maindrawer: {
    height: "100%",
    background: "#0c0731",
    width: "260px",
  },
  logoDrawer: {
    width: "140px",
  },
  drawerContainer: {
    padding: "20px 0px 20px 20px",
    height: "100%",
    background: "#ffffff",
    color: "#262626",
    width: "260px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  drawericon: {
    color: "#000",
    marginLeft: "0px !important",
    fontSize: "25px",
  },
  logoImg: {
    width: "75px",
    margin: " 14px 15px 11px 0px",
    objectFit: "contain",
    "@media (max-width: 500px)": {
      margin: " 11px 1px 3px 0px",
      width: "52px",
      width: "75px",
    },
  },
  menuMobile: {
    fontSize: "14px",
    fontWeight: "500",
    paddingLeft: "10px",
    "@media (max-width: 500px)": {
      padding: "7px 0",
      width: "100%",
    },
  },
  paper1: {
    background: "black",
    color: "white",
  },

  mainHeader: {
    justifyContent: "space-between",
    padding: "0px",
  },
  search: {
    height: "40px",
    position: "relative",
    color: "#ABABAB",
    borderRadius: "100px",
    backgroundColor: "#DAF4FF",
    border: "1px solid #fff",
    marginLeft: 20,
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0px",
    },
  },
  searchIcon: {
    fontSize: "16px",
    padding: "0px 9px",
    color: "#000000",
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    fontSize: "16px",
    width: "100%",
  },
  inputInput: {
    padding: "8px 6px 8px 0px",
    fontSize: "12px",
    marginTop: "-2px",
    paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    color: "#000",
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      "&:focus": {
        width: "100%",
      },
    },
  },
  menuButton1: {
    paddingLeft: "0",
  },
  searcBox: {
    backgroundColor: "#DAF4FF",
    borderRadius: " 50px",
  },
  menuMobile1: {
    padding: "15px 0",
    "& h4": {
      fontSize: "14px !important",
      lineHeight: " 17px",
      color: theme.palette.text.main,
      margin: "0 8px",
      fontWeight: "400",
      [theme.breakpoints.only("xs")]: {
        fontSize: "12px !important",
      },
    },
    "& svg": {
      color: theme.palette.text.main,
      "@media (max-width:767px)": {
        display: "none",
      },
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
    "& figure": {
      margin: 0,
      width: 40,
      height: 40,
      borderRadius: "50px",
      overflow: "hidden",
      display: "flex",
      justifyContent: " center",
      alignItems: "center",
      "& img": {
        width: "auto",
        height: "auto",
        maxWidth: "100%",
      },
    },
  },
  menuMobile2: {
    "& h4": {
      fontSize: "14px",
      lineHeight: " 17px",
      color: theme.palette.background.dark,
      margin: "0 5px",
      whiteSpace: "pre",
      fontWeight: "300",
      "@media (max-width:767px)": {
        display: "none",
      },
    },
    "& svg": {
      "@media (max-width:767px)": {
        display: "none",
      },
    },
    "&:hover": {
      backgroundColor: "transparent",
      color: "#ff3965",
    },
  },
  menuMobiledrawer: {
    "& h4": {
      fontSize: "16px",
      lineHeight: " 17px",
      color: "#000",

      whiteSpace: "pre",
      fontWeight: "400",
    },
  },
  searchdiaogBox: {
    "& .MuiDialogContent-root": {
      minHeight: "calc(100vh - 100px)",
      [theme.breakpoints.only("xs")]: {
        padding: "20px 0 !important",
      },
    },
    "& .MuiDialog-paperScrollPaper": {
      overflowY: "auto",
    },
  },
}));

export default function Header() {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const user = useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose4 = () => {
    setAnchorEl1(null);
  };
  const {
    menuMobile,
    menuButton,
    menuButton1,
    divstake,
    toolbar,
    drawerContainer,
    drawericon,
    logoDrawer,
    mainHeader,
  } = useStyles();
  const history = useNavigate();
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 1220
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());
  }, []);

  const [open1, setOpen1] = useState({ community: false, user: false });
  const anchorRef = { community: useRef(null), user: useRef(null) };
  const StyledMenu = withStyles({
    paper: {
      marginTop: "2px",
    },
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      {...props}
    />
  ));
  const displayDesktop = () => {
    return (
      <Toolbar className={toolbar}>
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          {femmecubatorLogo}
        </Box>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          {getMenuButtons()}
          <Button
            variant="contained"
            className="ecoButton"
            to="/login"
            color="secondary"
            component={Link}
            style={{ marginRight: "15px", whiteSpace: "pre" }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            className="btn-15"
            to="/sign-up"
            color="primary"
            component={Link}
            style={{ whiteSpace: "pre" }}
          >
            Sign Up
          </Button>
        </Box>
      </Toolbar>
      // {/* </Container> */}
    );
  };
  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));
    //mobile
    return (
      <Toolbar className={mainHeader}>
        <Drawer
          {...{
            anchor: "right",
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <div className={drawerContainer}>
            <Box mb={1}>
              <img className={logoDrawer} src="images/logo.png" alt="" />
            </Box>

            {getDrawerChoices()}
            <Box mb={2}>
              <Button
                variant="contained"
                className="ecoButton"
                to="/login"
                color="secondary"
                component={Link}
                style={{ marginRight: "15px", whiteSpace: "pre" }}
              >
                Login
              </Button>
            </Box>
            <Button
              variant="contained"
              className="btn-15"
              to="/sign-up"
              color="primary"
              component={Link}
              style={{ whiteSpace: "pre" }}
            >
              Sign Up
            </Button>
          </div>
        </Drawer>

        <Box display="flex" justifyContent="space-between">
          {femmecubatorLogo}
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton
            className={drawericon}
            {...{
              edge: "start",
              color: "inherit",
              "aria-label": "menu",
              "aria-haspopup": "true",
              onClick: handleDrawerOpen,
            }}
          >
            <MenuIcon
              width="60px"
              height="60px"
              style={{ color: "#EC1F24", fontSize: "26px" }}
            />
          </IconButton>
        </Box>
      </Toolbar>
    );
  };
  //mobile end
  const getDrawerChoices = () => {
    return headersData.map(({ label, href }) => {
      return (
        <>
          <Button
            {...{
              key: label,
              color: "inherit",
              to: href,
              component: Link,
              className: menuButton1,
            }}
          >
            <MenuItem className={menuMobile}>{label}</MenuItem>
          </Button>
        </>
      );
    });
  };

  const femmecubatorLogo = (
    <Box>
      <Link to="/">
        <Logo className="logoImg" />
      </Link>
    </Box>
  );

  const getMenuButtons = (activeClassName) => {
    return headersData.map(({ label, href }) => {
      return (
        <>
          <NavLink
            exact
            // to={`${href}`}
            {...{
              key: label,
              color: "inherit",
              to: href,
              // component: Link,
              className: menuButton,
              activeClassName: "active",
            }}
          >
            {" "}
            {label}
          </NavLink>
        </>
      );
    });
  };

  return (
    <>
      <AppBar
        position={window.location.pathname !== "/" ? "relative" : "absolute"}
        elevation={0}
        style={{ backgroundColor: "#ffffff", border: "none" }}
      >
        <Container maxWidth="lg">
          {mobileView ? displayMobile() : displayDesktop()}
        </Container>
      </AppBar>
      {dialogOpen && (
        <Paper>
          <Dialog
            fullWidth
            maxWidth="lg"
            className={classes.searchdiaogBox}
            style={{
              position: "absolute",
              top: "10%",
              // minHeight: "695px",
            }}
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
          >
            <IconButton
              className="closeButton"
              onClick={() => setDialogOpen(false)}
            >
              <CloseIcon style={{ color: "#AAAAAA" }} />
            </IconButton>

            <Box className="dialogBoxHeight">
              <CloseIcon style={{ color: "#AAAAAA" }} />
            </Box>
          </Dialog>
        </Paper>
      )}
    </>
  );
}
