import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  FormControl,
  makeStyles,
  Button,
} from "@material-ui/core";
import React, { useState } from "react";
import OTPInput from "otp-input-react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

const useStyle = makeStyles((theme) => ({
  authenticateModalBOx: {},
  otpFormControl: {
    "& input": {
      color: theme.palette.primary.main,
      width: "49px !important",
      height: "49px !important",
      marginRight: "10px !important",
      border: "0px",
      background: theme.palette.background.card,
      boxShadow: "0px 0px 53px rgba(0, 0, 0, 0.25)",
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
}));

export default function AuthenticateModal({ openModal, setOpenModal }) {
  const classes = useStyle();
  const [OTP, setOTP] = useState("");
  const history = useNavigate();
  return (
    <Box className={classes.authenticateModalBOx}>
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent>
          <IconButton
            style={{ position: "absolute", top: "5px", right: "5px" }}
            onClick={() => setOpenModal(false)}
          >
            <IoMdClose />
          </IconButton>
          <Box align="center">
            <Box mt={2}>
              <img src="images/shield.png" alt="" />
            </Box>
            <Box my={2}>
              <Typography variant="h6">Authenticate Withdrawal</Typography>
            </Box>
            <Typography
              variant="body1"
              style={{ color: "#78819F", maxWidth: "200px" }}
            >
              Amount{" "}
              <span style={{ color: "#262626", fontSize: "14px" }}> DT100</span>{" "}
              send to "0xb885b54b40a35....sadkladkakkl"
            </Typography>
            <Box my={2}>
              <Typography
                variant="body1"
                style={{ color: "#78819F", maxWidth: "300px" }}
              >
                Enter One Time Password (OTP) sent to your "438758444"
                registered mobile number
              </Typography>
            </Box>
            <Box my={5}>
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
                  // disabled={issLoading || isLoading}
                  secure
                />
              </FormControl>
              <Box pt={1}>
                <Typography
                  variant="body2"
                  color="error"
                  style={{
                    float: "right",
                    marginRight: "29px",
                  }}
                >
                  2 : 40
                </Typography>
              </Box>
            </Box>

            <Box className="buttonBox" mt={2} mb={4}>
              <Button
                variant="contained"
                color="primary"
                // onClick={() => history("/reset-password")}
              >
                Pay Securely
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
