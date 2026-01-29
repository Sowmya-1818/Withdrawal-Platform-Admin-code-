import {
  Box,
  Button,
  makeStyles,
  FormControl,
  Typography,
  Paper,
  Container,
  FormHelperText,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import OTPInput from "otp-input-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { patchAPIHandler, postAPIHandler } from "src/ApiConfig/service";
import { AuthContext } from "src/context/Auth";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import Timer from "src/component/Timer";

const useStyles = makeStyles((theme) => ({
  verifyOtpBox: {
    height: "100vh",
    position: "relative",
    zIndex: "999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflowY: "auto",
  },
  otpBox: {
    height: "initial",
    margin: "15px auto",
    maxWidth: " 95%",
    width: "487px",
    maxHeight: "100%",
    "& .mainBox": {
      padding: "50px 40px 100px",
      [theme.breakpoints.down("xs")]: {
        padding: "20px 10px 50px",
      },
      "& h2": {
        paddingBottom: "5px",
        textAlign: "center",
        color: "#FFFFFF",
      },
      "& .MuiTypography-body2": {
        textAlign: "center",
      },
    },
    "& .buttonBox": {
      padding: "35px 0 0 0",
      display: "flex",
      justifyContent: "center",
    },
    "& .otpTextBox": {
      padding: "20px 0px 50px",
    },
  },
  otpFormControl: {
    "& input": {
      color: "#FFFFFF",
      width: "49px !important",
      height: "49px !important",
      marginRight: "10px !important",
      border: "0px",
      background: "rgba(25, 5, 28, 1)",
      boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      borderRadius: "10px",
      "@media(max-width:460px)": {
        width: "41px !important",
        height: "41px !important",
      },
      "@media(max-width:380px)": {
        width: "31px !important",
        height: "31px !important",
      },
    },
  },
  registerLink: {
    color: "#b61733 !important",
    fontWeight: "700",
    border: "none",
    textDecoration: "none",
    cursor: "pointer",
  },
  box2: {
    paddingTop: "19px",
    display: "flex",
    justifyContent: "center",
  },
}));

export default function Verifyotp() {
  const classes = useStyles();
  const history = useNavigate();
  const auth = useContext(AuthContext);
  const location = useLocation();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmit, setisSubmit] = useState(false);
  const [OTP, setOTP] = useState("");
  const handleFormSubmit = async (values) => {
    try {
      setIsUpdating(true);
      const response = await patchAPIHandler({
        endPoint: "verifyOTP",
        dataToSend: {
          email: location?.state?.email,
          otp: OTP,
        },
      });
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        history(`/reset-password?${location?.state?.email}`);
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };

  return (
    <Box className={classes.verifyOtpBox}>
      <Box className={classes.otpBox}>
        <Paper className="mainBox" elevation={3}>
          <Typography variant="h2">OTP Verification</Typography>
          <Box className="otpTextBox">
            <Typography variant="body2">
              Please enter the 6 digit verification code that was sent to email.
            </Typography>
          </Box>
          <Box>
            <FormControl fullWidth className={classes.otpFormControl}>
              <OTPInput
                value={OTP}
                inputVariant="standard"
                autoComplete="off"
                onChange={setOTP}
                style={{ display: "flex", justifyContent: "center" }}
                autoFocus
                OTPLength={6}
                otpType="number"
                secure
              />
              <FormHelperText error>
                {isSubmit && OTP == "" && "Please enter otp."}
                {isSubmit &&
                  OTP !== "" &&
                  OTP.length != "6" &&
                  "Please enter valid otp."}
              </FormHelperText>
            </FormControl>

            <Box className="displaySpacebetween">
              <Box style={{ width: "100%" }}>
                <Timer emailData={location?.state?.email} />
              </Box>
            </Box>
          </Box>

          <Box className="buttonBox">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setisSubmit(true);

                if (OTP.length == 6) {
                  setisSubmit(false);
                  handleFormSubmit();
                }
              }}
              disabled={isUpdating}
            >
              Submit
              {isUpdating && <ButtonCircularProgress />}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
