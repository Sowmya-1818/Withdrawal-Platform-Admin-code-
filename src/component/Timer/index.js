import React, { useState, useEffect, useMemo } from "react";
import { Typography, Box, Button } from "@material-ui/core";
import moment from "moment";
import { calculateTimeLeft } from "src/utils";

import { toast } from "react-hot-toast";
import ButtonCircularProgress from "../ButtonCircularProgress";
import { postAPIHandler, putAPIHandler } from "src/ApiConfig/service";

export default function Timer({ emailData }) {
  console.log("emailData", emailData);
  const [endTime, setEndTime] = useState(moment().add(3, "m").unix());
  const [timeStamp, setTimeStamp] = useState();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (endTime) {
      const timer = setTimeout(() => {
        setTimeStamp(calculateTimeLeft(endTime * 1000));
        const timeLefts = calculateTimeLeft(endTime * 1000);
        window.localStorage.setItem("otpTimer", JSON.stringify(timeLefts));
      }, 1000);
      return () => clearTimeout(timer);
    }
  });

  const handleResendOtpSubmit = async () => {
    try {
      setIsUpdating(true);
      const response = await postAPIHandler({
        endPoint: "resendOtp",
        dataToSend: {
          email: emailData,
        },
      });
      if (response?.data?.responseCode == 200) {
        window.localStorage.removeItem("otpTimer");
        setEndTime(moment().add(3, "m").unix());
        toast.success(response.data.responseMessage);
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      console.log(error);
      toast.error(error?.response?.data?.responseMessage);
    }
  };

  const timeLeft = useMemo(() => {
    if (localStorage.getItem("otpTimer")) {
      const storedTimer = localStorage.getItem("otpTimer");
      const parsedTimer = JSON.parse(storedTimer);
      !timeStamp &&
        setEndTime(
          moment()
            .add(parsedTimer?.minutes, "m")
            .add(parsedTimer?.seconds, "s")
            .unix()
        );
      return parsedTimer;
    }
  }, [localStorage.getItem("otpTimer")]);

  return (
    <Box display="flex" justifyContent="flex-end" mt={1}>
      {timeLeft && timeLeft.seconds >= 0 ? (
        <Typography variant="body2">
          {" "}
          {timeLeft?.minutes} m : {timeLeft?.seconds} s
        </Typography>
      ) : (
        <Button
          onClick={() => handleResendOtpSubmit()}
          disabled={isUpdating}
          style={{
            color: "#DE14FF",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Resend {isUpdating && <ButtonCircularProgress />}
        </Button>
      )}
    </Box>
  );
}
