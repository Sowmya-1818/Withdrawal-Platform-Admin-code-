import _ from "lodash";
import { colors, createMuiTheme, responsiveFontSizes } from "@material-ui/core";
import typography from "./typography";

const baseOptions = {
  typography,
  overrides: {
    MuiIconButton: {
      root: {
        color: "#e1e1e1",
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: "transparent",
        fontSize: "14px",
        whiteSpace: "pre",
      },
      body: {
        color: "#e1e1e1",
        fontSize: "13px",
      },
      head: {
        background: "#F4F7FF",
      },
    },
    MuiTableRow: {
      root: {},
    },
    MuiFormLabel: {
      root: { color: "#222" },
      colorSecondary: {
        "&.Mui-focused": {
          color: "#222",
        },
      },
    },
    MuiListSubheader: {
      root: {
        color: "#000000",
        fontSize: "22px !important",
        fontWeight: "600 !important",
        lineHeight: "33px !important",
      },
    },
    MuiOutlinedInput: {
      root: {
        background: "rgba(25, 5, 28, 1)",
        borderRadius: "10px",
      },
      notchedOutline: {
        borderColor: "rgba(0, 0, 0, 0.08)",
      },
      colorSecondary: {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          color: "#222",
          borderColor: "#222",
        },
        "&.Mui-focused": {
          color: "#222",
        },
      },
    },
    MuiPaper: {
      outlined: {
        padding: "20px",
        width: "100%",
      },
      elevation1: {
        background: "#fff",
        borderRadius: "10px",
        padding: "26px 20px",
        boxShadow: "none",
      },
      elevation2: {
        background:
          "linear-gradient(180deg, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0) 68.15%)",
        border: "2px solid rgba(0, 0, 0, 0.15)",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "none",
      },
      elevation3: {
        padding: "20px",
        background: "rgba(40, 25, 43, 1)",
        borderRadius: "20px",
        position: "relative",
        boxShadow: "0px 4px 4px 0px rgba(222, 20, 255, 0.5)",
      },
    },
    MuiPopover: {
      root: {
        zIndex: 99999,
      },
    },
    MuiMenuItem: {
      root: {
        paddingLeft: "20px",
      },
    },
    MuiListItem: {
      root: {
        alignItems: "self-start",
      },
      gutters: {
        paddingLeft: 0,
      },
    },
    MuiCheckbox: {
      root: {
        padding: "4px",
        fontSize: "12px",
      },
      colorSecondary: {
        "&.Mui-checked": { color: "#DE14FF" },
      },
    },
    MuiFormControlLabel: {
      root: {
        paddingBottom: "0",
      },
    },
    MuiListItemSecondaryAction: {
      root: {
        right: 0,
      },
    },
    MuiDialog: {
      paperScrollPaper: {
        Width: 450,
        maxWidth: "100%",
      },
      paper: {
        overflowY: "unset",
      },
      paperWidthSm: {
        maxWidth: "900px !important",
      },
      paperFullWidth: {
        background: "#28192B",
        borderRadius: "20px",
      },
    },
    MuiInputBase: {
      input: {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 14,
        fontWeight: 400,
      },
    },
    MuiBackdrop: {
      root: { backgroundColor: "rgba(0, 0, 0, 0.75)" },
    },
    MuiAutocomplete: {
      option: {
        fontFamily: "Poppins !important",
        fontSize: "12px !important",
        fontWeight: "400 !important",
        lineHeight: "18px !important",
        letterSpacing: "0px !important",
        textAlign: "left !important",
      },
      inputRoot: {
        "& .MuiAutocomplete-input": {
          padding: "5.5px 3px !important",
        },
      },
    },
    MuiButton: {
      containedSecondary: {
        color: "#262626",
        height: "40px",
        padding: "10px 39px",
        fontSize: "14px",
        border: "1px solid #E1E1E1",
        background: "#F2F2F2",
        fontWeight: "500",
        lineHeight: "21px",
        fontFamily: "'Clash Display'",
        borderRadius: "10px",
        backgroundColor: "#F2F2F2",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25) !important",
        "&:hover": {
          background: "#DE14FF",
          border: "1px solid #DE14FF",
          boxShadow: "none !important",
          color: "#262626",
          backgroundColor: "#DE14FF",
        },
      },

      containedPrimary: {
        color: "#fff",
        height: "40px",
        padding: "10px 39px",
        fontSize: "14px",
        background: "#DE14FF",
        border: "1px solid #DE14FF",
        fontWeight: "500",
        lineHeight: "21px",
        fontFamily: "'Clash Display'",
        whiteSpace: "pre",
        borderRadius: "10px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25) !important",
        backgroundColor: "#DE14FF",
        "&:hover": {
          color: "#000",
          border: "1px solid #E1E1E1",
          backgroundColor: "#F2F2F2",
        },
      },
      contained: {
        borderRadius: "50px",
        fontWeight: 600,
        padding: "5px 19px",
        boxShadow: "none !important",
      },
      outlinedPrimary: {
        color: "#DE14FF",
        border: "1px solid #DE14FF",
        padding: "5px 25px",
        fontWeight: "500",
        borderRadius: "50px",
        fontSize: "13px",
        "&:hover": {
          backgroundColor: "#DE14FF",
          border: "1px solid #DE14FF",
          color: "#fff",
        },
      },
      outlinedSizeSmall: {
        padding: "6px 23px",
        fontSize: "16px",
        lineHeight: " 24px",
      },
    },
    MuiDrawer: {
      paperAnchorDockedLeft: {
        borderRight: "0",
      },
    },
    MuiMenu: {
      paper: { top: "47px" },
    },

    MuiTypography: {
      subtitle1: {
        color: "#000",
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: " 16px",
        colorSecondary: {
          color: "#8d8989",
        },
      },
    },
  },
};

const themesOptions = {
  typography: {
    fontWeight: 400,
    fontFamily: "'Poppins', sans-serif",
  },
  palette: {
    type: "light",
    action: {
      primary: "#20509e",
    },
    background: {
      default: "#FBFBFD",
      dark: "#f3f7f9",
      paper: colors.common.white,
    },
    primary: {
      main: "#898989",
      dark: "#de0d0d",
      light: "#de0d0d",
    },
    secondary: {
      main: "#fff",
    },
    warning: {
      main: "#ffae33",
      dark: "#ffae33",
      light: "#fff1dc",
    },
    success: {
      main: "#54e18c",
      dark: "#54e18c",
      light: "#e2faec",
    },
    error: {
      main: "#ff0010",
      dark: "#ff0010",
      light: "#ffe9e6",
    },
    text: {
      primary: "#52565c",
      secondary: "#999999",
    },
    common: {
      black: "#222222",
    },
  },
};

export const createTheme = (config = {}) => {
  let theme = createMuiTheme(_.merge({}, baseOptions, themesOptions));

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
