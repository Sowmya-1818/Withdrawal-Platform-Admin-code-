import {
  Box,
  Button,
  makeStyles,
  TextField,
  Typography,
  Paper,
  FormHelperText,
  InputAdornment,
  IconButton,
  Divider,
  Container,
} from "@material-ui/core";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import * as yep from "yup";
import { HiOutlineMail } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { postAPIHandler } from "src/ApiConfig/service";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";

const useStyles = makeStyles((theme) => ({
  forgetPasswordBox: {
    width: "100%",
    position: "relative",
    zIndex: "999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflowY: "auto",

    "& h2": {
      color: "#FFFFFF",
    },
    "& .paperBox": {
      padding: "40px 50px ",
      [theme.breakpoints.down("xs")]: {
        padding: "20px 10px",
      },
    },
    "& .backBtn": {
      position: "absolute",
      top: 30,
      left: 30,
      border: "1px solid rgba(0, 0, 0, 0.08)",
      [theme.breakpoints.down("sm")]: {
        top: 15,
        left: 15,
      },
    },
  },
  forgetBox: {
    height: "initial",
    margin: "15px auto",
    maxHeight: "100%",
    maxWidth: "475px",
    width: "100%",
    "& .buttonBox": {
      padding: "35px 0 0",
      display: "flex",
      gap: "20px",
      justifyContent: "center",
    },
    "& .MuiTypography-body2": {
      textAlign: "center",
    },
  },
}));

export default function Forget() {
  const classes = useStyles();
  const history = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const formInitialSchema = {
    email: "",
  };
  const formValidationSchema = yep.object().shape({
    email: yep
      .string()
      .email("Please enter valid email.")
      .max(256, "Should not exceeds 256 characters.")
      .required("Email is required."),
  });
  const handleFormSubmit = async (values) => {
    try {
      setIsUpdating(true);
      const response = await postAPIHandler({
        endPoint: "forgotPassword",
        dataToSend: {
          email: values.email.toLocaleLowerCase(),
        },
      });
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        localStorage.removeItem("otpTimer");
        history("/verify-otp", {
          state: {
            email: values.email.toLocaleLowerCase(),
          },
        });
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };
  const [tabs, setTabs] = useState("email");
  const [countryCode, setCountryCode] = useState("+91");

  return (
    <Box className={classes.forgetPasswordBox}>
      <Container>
        <Box className={classes.forgetBox}>
          <Paper elevation={3} className="paperBox">
            <Typography variant="h2">Forgot password</Typography>
            <Box my={3}>
              <Typography variant="body2">
                Enter your registered email address, we will send a verification
                link to forgot your password.
              </Typography>
            </Box>

            <Formik
              initialValues={formInitialSchema}
              validationSchema={formValidationSchema}
              onSubmit={(values) => handleFormSubmit(values)}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                touched,
                values,
                setFieldValue,
              }) => (
                <Form>
                  <Box mt={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Email"
                      name="email"
                      value={values.email}
                      error={Boolean(touched.email && errors.email)}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className="textfiledicons"
                          >
                            <IconButton>
                              <HiOutlineMail />
                            </IconButton>
                            <Divider
                              orientation="vertical"
                              style={{ height: "27px" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText error className={classes.helperText}>
                      {touched.email && errors.email}
                    </FormHelperText>
                  </Box>

                  <Box className="buttonBox">
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isUpdating}
                    >
                      Submit
                      {isUpdating && <ButtonCircularProgress />}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => history(-1)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
