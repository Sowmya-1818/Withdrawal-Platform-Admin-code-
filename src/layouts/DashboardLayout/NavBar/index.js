// NavBar.js
import React, { useEffect, useState, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { FaDollarSign } from "react-icons/fa";
import PropTypes from "prop-types";
import {
  Box,
  Drawer,
  Hidden,
  List,
  Button,
  ListSubheader,
  makeStyles,
} from "@material-ui/core";
import { MdOutlineAttachMoney, MdDashboard } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { AuthContext } from "src/context/Auth";
import { toast } from "react-hot-toast";
import ConfirmationModal from "src/component/ConfirmationModal";
import NavItem from "./NavItem"; // Correctly imported NavItem

// Define sections for the NavBar
export const sections = [
  {
    items: [
      {
        title: "String Games",
        modules: "dashboard",
        icon: FaDollarSign,
        items: [ // <-- This was misplaced
          // {
          //   title: "Withdrawals",
          //   modules: "dashboard",
          //   icon: FaDollarSign,
          //   // href: "/withdrawals", // link to the withdrawals page
          // },
          // {
          //   title: "Approved Withdrawals String TON",
          //   modules: "dashboard",
          //   icon: MdOutlineAttachMoney,
          //   href: "/approvedwithdrawalsstring", // link to the approved withdrawals page
          // },
          {
            title: "Approved Withdrawals String SOL",
            modules: "dashboard",
            icon: MdOutlineAttachMoney,
            href: "/approvedwithdrawalsstringsol", // link to the approved withdrawals page
          },
          // {
          //   title: "Transfer Withdrawals String TON",
          //   modules: "dashboard",
          //   icon: MdOutlineAttachMoney,
          //   href: "/transferwithdrawalsstring", // link to the transfer withdrawals page
          // },
          {
            title: "Transfer Withdrawals String SOL",
            modules: "dashboard",
            icon: MdOutlineAttachMoney,
            href: "/transferwithdrawalsstringsol", // link to the transfer withdrawals page
          },
        ], // <-- This was misplaced
      },
    ],
  },
  {
    items: [
      {
        title: "Stringarc8",
        modules: "dashboard",
        icon: FaDollarSign,
        items: [ // <-- This was misplaced
          // {
          //   title: "Withdrawals",
          //   modules: "dashboard",
          //   icon: FaDollarSign,
          //   // href: "/withdrawals", // link to the withdrawals page
          // },
          // {
          //   title: "Approved Withdrawals TON",
          //   modules: "dashboard",
          //   icon: MdOutlineAttachMoney,
          //   href: "/approvedwithdrawals", // link to the approved withdrawals page
          // },
          {
            title: "Approved Withdrawals SOL",
            modules: "dashboard",
            icon: MdOutlineAttachMoney,
            href: "/approvedwithdrawalssol", // link to the approved withdrawals page
          },
          // {
          //   title: "Transfer Withdrawals TON",
          //   modules: "dashboard",
          //   icon: MdOutlineAttachMoney,
          //   href: "/transferwithdrawals", // link to the transfer withdrawals page
          // },
          {
            title: "Transfer Withdrawals SOL",
            modules: "dashboard",
            icon: MdOutlineAttachMoney,
            href: "/transferwithdrawalssol", // link to the transfer withdrawals page
          },
        ], // <-- This was misplaced
      },
    ],
  },
  {
    items: [
      {
        title: "Spin Roulette",
        modules: "dashboard",
        icon: FaDollarSign,
        items: [ // <-- This was misplaced
          // {
          //   title: "Withdrawals",
          //   modules: "dashboard",
          //   icon: FaDollarSign,
          //   // href: "/withdrawals", // link to the withdrawals page
          // },
          // {
          //   title: "Approved Withdrawals TON",
          //   modules: "dashboard",
          //   icon: MdOutlineAttachMoney,
          //   href: "/approvedwithdrawalsspin", // link to the approved withdrawals page
          // },
          {
            title: "Approved Withdrawals SOL",
            modules: "dashboard",
            icon: MdOutlineAttachMoney,
            href: "/approvedwithdrawalsspinsol", // link to the approved withdrawals page
          },
          // {
          //   title: "Transfer Withdrawals TON",
          //   modules: "dashboard",
          //   icon: MdOutlineAttachMoney,
          //   href: "/transferwithdrawalsspin", // link to the transfer withdrawals page
          // },
          {
            title: "Transfer Withdrawals SOL",
            modules: "dashboard",
            icon: MdOutlineAttachMoney,
            href: "/transferwithdrawalsspinsol", // link to the transfer withdrawals page
          },
        ], // <-- This was misplaced
      },
    ],
  },

   {
    items: [
      {
        title: "String Drive",
        modules: "dashboard",
        icon: FaDollarSign,
        items: [ // <-- This was misplaced
          // {
          //   title: "Withdrawals",
          //   modules: "dashboard",
          //   icon: FaDollarSign,
          //   // href: "/withdrawals", // link to the withdrawals page
          // },
          // {
          //   title: "Approved Withdrawals TON",
          //   modules: "dashboard",
          //   icon: MdOutlineAttachMoney,
          //   href: "/approvedwithdrawalsdrive", // link to the approved withdrawals page
          // },
          {
            title: "Approved Withdrawals SOL",
            modules: "dashboard",
            icon: MdOutlineAttachMoney,
            href: "/approvedwithdrawalsdrivesol", // link to the approved withdrawals page
          },
          // {
          //   title: "Transfer Withdrawals TON",
          //   modules: "dashboard",
          //   icon: MdOutlineAttachMoney,
          //   href: "/transferwithdrawalsdrive", // link to the transfer withdrawals page
          // },
          {
            title: "Transfer Withdrawals SOL",
            modules: "dashboard",
            icon: MdOutlineAttachMoney,
            href: "/transferwithdrawalsdrivesol", // link to the transfer withdrawals page
          },
        ], // <-- This was misplaced
      },
    ],
  },
  {
    items: [
      {
        title: "Tetris",
        modules: "dashboard",
        icon: FaDollarSign,
        items: [
          {
            title: "Approved Withdrawals SOL",
            modules: "dashboard",
            icon: MdOutlineAttachMoney,
            href: "/approvedwithdrawalstetris",
          },
          {
            title: "Transfer Withdrawals SOL",
            modules: "dashboard",
            icon: MdOutlineAttachMoney,
            href: "/transferwithdrawalstetris",
          },
        ],
      },
    ],
  },
];

// Additional subAdmin structure
export const subAdmin = [
  {
    items: [
      {
        title: "Withdraw Platform",
        modules: "dashboard",
        icon: MdDashboard,
        href: "/dashboard",
      },
    ],
  },
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256,
    background: "#251327",
  },
  desktopDrawer: {
    top: "76px",
    width: "250px",
    height: "calc(100% - 79px)",
    background: "#251327",
    boxShadow: "0px 0px 53px rgba(0, 0, 0, 0.25)",
    borderRadius: "0px",
    border: "1px solid rgba(0, 0, 0, 0.15)",
    marginLeft: "0px",
  },
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const location = useLocation();
  const history = useNavigate();
  const [isLogout, setIsLogout] = useState(false);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const checkArray = useMemo(() => {
    const matchedItems = sections.flatMap((section) =>
      section.items.filter(
        (item) =>
          auth?.userData
 
      )
    );
    return auth?.userData?.userType !== "ADMIN"
      ? [...subAdmin, { items: matchedItems }]
      : [...subAdmin, ...sections];
  }, [auth]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <PerfectScrollbar options={{ suppressScrollX: true }}>
        <Box pt={2} pb={2}>
          <Box className="sideMenuBox">
            {checkArray &&
              checkArray.map((section, i) => (
                <List key={`menu${i}`} subheader={<ListSubheader disableGutters disableSticky>{section.subheader}</ListSubheader>}>
                  {renderNavItems({
                    items: section.items,
                    pathname: location.pathname,
                  })}
                </List>
              ))}
          </Box>
        </Box>
      </PerfectScrollbar>
      <Box>
        <Button onClick={() => setIsLogout(true)}>
          <AiOutlineLogout color="#DE14FF" />
          <span style={{ color: "#DE14FF" }}>Logout</span>
        </Button>
      </Box>
      {isLogout && (
        <ConfirmationModal
          open={isLogout}
          isLoading={false}
          handleClose={() => setIsLogout(false)}
          title={"Logout"}
          desc={"Are you sure you want to logout?"}
          handleSubmit={() => {
            toast.success("You have been logged out successfully!");
            window.sessionStorage.removeItem("token");
            window.sessionStorage.removeItem("retrotoken");
            window.sessionStorage.removeItem("stringtoken");
            window.sessionStorage.removeItem("moderntoken");
            window.sessionStorage.removeItem("spintoken");
            window.sessionStorage.removeItem("carrace");
            window.sessionStorage.removeItem("tetris");
            window.localStorage.removeItem("packman");
            auth.userLogIn(false, null);
            setIsLogout(false);
            history("/");
          }}
        />
      )}
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

// The renderNavItems function is responsible for recursively rendering nav items, 
// including their nested items if present.
const renderNavItems = ({ items, pathname }) => {
  return items.map((item) => {
    const key = item.title;
    return item.items ? (
      <NavItem key={key} title={item.title} icon={item.icon} isActive={pathname === item.href}>
        {renderNavItems({ items: item.items, pathname })}
      </NavItem>
    ) : (
      <NavItem key={key} href={item.href} title={item.title} icon={item.icon} isActive={pathname === item.href} />
    );
  });
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default NavBar;
