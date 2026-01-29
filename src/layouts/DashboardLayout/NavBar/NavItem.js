import React, { useState } from "react";
// import { NavLink as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Button, Collapse, ListItem, makeStyles } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  item: {
    display: "block",
    paddingTop: 0,
    paddingBottom: 0,
  },
  itemLeaf: {
    display: "flex",
    paddingTop: 0,
    paddingBottom: 0,
    "& .active": {
      color: "#DE14FF !important",
      background: "#2C162F",
      borderRadius: "10px",
      fontWeight: theme.typography.fontWeightRegular,
      "& $title": {
        fontWeight: theme.typography.fontWeightMedium,
      },
      "& $icon": {
        color: "#DE14FF",
      },
    },
  },
  button: {
    color: theme.palette.primary.main,
    padding: "13px 20px",
    justifyContent: "flex-start",
    textTransform: "none",
    marginBottom: "8px",
    letterSpacing: 0,
    width: "100%",
    fontWeight: "400",

    "&:hover": {
      color: "#ffff",
      background: "linear-gradient(359.12deg, #FF6600 9.14%, #3333FF 110.76%)",
      borderRadius: "0px",
      "& $icon": {
        color: "#ffff",
      },
    },
  },
  buttonLeaf: {
    color: "rgba(255, 255, 255, 0.87)",
    padding: "13px 20px",
    justifyContent: "flex-start",
    textTransform: "none",
    letterSpacing: 0,
    width: "100%",
    margin: "0px 10px 5px",
    // marginBottom: "5px",
    borderRadius: "10px",
    opacity: 1,
    fontWeight: "400",
    fontSize: "13px",
    "& li": {
      "& $title": {
        marginLeft: "30px",
      },
    },
    "&:hover": {
      color: "#DE14FF !important",
      background: "#2C162F",
      borderRadius: "10px",
      "& $icon": {
        color: "#DE14FF",
      },
    },
    "&.depth-0": {
      "& $title": {
        fontWeight: 400,
        fontSize: "13px",
        whiteSpace: "pre",
      },
    },
  },
  icon: {
    display: "flex",
    alignItems: "center",
    marginRight: "10px",
    color: "rgba(255, 255, 255, 0.6)",
  },
  title: {
    marginRight: "auto",
  },
  active: {
    color: "#DE14FF !important",
    background: "#2C162F",
    borderRadius: "10px",
    fontWeight: theme.typography.fontWeightRegular,
    "& $title": {
      fontWeight: theme.typography.fontWeightMedium,
    },
    "& $icon": {
      color: "#DE14FF",
    },
  },
}));

const NavItem = ({
  children,
  className,
  depth,
  href,
  icon: Icon,
  info: Info,
  open: openProp,
  title,
  ...rest
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(openProp);
  const history = useNavigate();
  const isActive = window.location.pathname === href;
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  let paddingLeft = 8;

  if (depth > 0) {
    paddingLeft = 32 + 8 * depth;
  }

  const style = { paddingLeft };

  if (children) {
    return (
      <ListItem
        className={clsx(classes.item, className)}
        disableGutters
        key={title}
        {...rest}
      >
        <Button className={classes.button} onClick={handleToggle}>
          {Icon && <Icon className={classes.icon} size="20" />}
          <span className={classes.title}>{title}</span>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
        <Collapse in={open}>{children}</Collapse>
      </ListItem>
    );
  }

  return (
    <ListItem
      className={clsx(classes.itemLeaf, className)}
      disableGutters
      key={title}
      {...rest}
    >
      <Button
        activeClassName={classes.active}
        className={clsx(
          classes.buttonLeaf,
          `depth-${depth}`,
          isActive && "active"
        )}
        onClick={() => history(href)}
      >
        {Icon && <Icon className={classes.icon} size="20" />}
        <span className={classes.title}>{title}</span>
        {Info && <Info />}
      </Button>
    </ListItem>
  );
};

NavItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  depth: PropTypes.number.isRequired,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  info: PropTypes.elementType,
  open: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

NavItem.defaultProps = {
  open: false,
};

export default NavItem;
