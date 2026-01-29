import {
  Box,
  Button,
  makeStyles,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  FormHelperText,
  Divider,
  Container,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff, HiOutlineMail } from "react-icons/hi";
import { Form, Formik } from "formik";
import * as yep from "yup";
import { CgKey } from "react-icons/cg";
import { toast } from "react-hot-toast";
import {
  postAPIHandler,
  postAPIHandlercarrace,
  postAPIHandlermain,
  postAPIHandlerspin,
  postAPIHandlertetris,
} from "src/ApiConfig/service";

import { postData } from "src/ApiConfig/apiCalls"; // Corrected import for postData from apiCalls

import ApiConfig from "src/ApiConfig/ApiConfig";

// import {postData} from "src/ApiConfig/apiCalls";

import { AuthContext } from "src/context/Auth";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import axios from "axios";
import EncryptionUtil from "../../../ApiConfig/Utils/EncryptionUtils";

const useStyles = makeStyles((theme) => ({
  loginMainBox: {
    position: "relative",
    width: "100%",
    zIndex: "999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflowY: "auto",

    "& h2": {
      color: "#FFFFFF",
      textAlign: "center",
    },
    "& .paperBox": {
      padding: "50px 40px ",
      [theme.breakpoints.down("xs")]: {
        padding: "15px",
      },
    },
    "& .MuiTypography-body2": {
      width: "fit-content",
    },
    "& .MuiFormControlLabel-root": {
      marginLeft: 0,
    },
  },
  loginBox: {
    height: "initial",
    margin: "15px auto",
    maxHeight: "100%",
    maxWidth: "475px",
    width: "100%",
    "& .buttonBox": {
      padding: "35px 0",
      display: "flex",
      justifyContent: "center",
    },
  },
  iconClass1: {
    color: "#ADADAD",
    fontSize: "20px",
  },
}));

export default function Login() {
  const classes = useStyles();
  const history = useNavigate();
  const auth = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  let rememberMe = window.localStorage.getItem("packman");
  const [isRemember, setIsRemember] = useState(rememberMe ? true : false);
  let RememberData = isRemember && rememberMe ? JSON.parse(rememberMe) : "";
  const initialValues = {
    username: isRemember ? RememberData.username : "",
    password: isRemember ? RememberData.password : "",
  };

  const formValidationSchema = yep.object().shape({
    username: yep
      .string()
      .required("Please enter username.")
      .matches(
        /^[a-zA-Z0-9_]{3,20}$/,
        "Username must be 3-20 characters, alphanumeric or underscores only."
      ),
    password: yep
      .string()
      .required("Password is required.")
      .min(8, "Password must be at least 8 characters.")
      .max(16, "Password should not exceed 16 characters."),
  });

  const handleFormSubmit = async (values) => {
    console.log(values, "values");

    try {
      setIsUpdating(true);
      const response = await postAPIHandlermain({
        endPoint: "login",
        dataToSend: {
          username: values.username,
          password: values.password,
        },
      });

      console.log(response, "response main project");

      const responseretro = await postAPIHandler({
        endPoint: "loginretro",
        dataToSend: {
          email: "support@stringarc8.io",
          password: "Kling@2023",
          // password: "Admin@123",
        },
        secret_key: process.env.REACT_APP_SECRET_KEY_Retro,
      });
      const responsemodern = await postAPIHandler({
        endPoint: "loginmodren",
        dataToSend: {
          email: "support@stringarc8.io",
          password: "Kling@2015",
          // password: "Admin@123",
        },
        secret_key: process.env.REACT_APP_SECRET_KEY_Modern,
      });

      const responsespin = await postAPIHandlerspin({
        endPoint: "loginspin",
        dataToSend: {
          username: "Admin",
          password: "Admin@123",
        },
      });

      // const responsestringgames = await axios.post(
      //   "https://apiadmin-telegames.strtesting.com/api/v1/admins/login",
      //   {
          const responsestringgames = await axios.post('https://stradminapi.stringgames.io/api/v1/admins/login', {
          // Include the login credentials in the body if needed
          username: "admin",
          password: "Kling!2024", // Replace with actual login password
          // username: "admin", password: "Stringgames@2025"  // Replace with actual login password
        }
      );

      if (responsestringgames.status === 200) {
        var encryptedToken = EncryptionUtil.encryptionAES(
          responsestringgames.data.token
        );
        localStorage.setItem("adminToken", encryptedToken);
        var encryptedToken2 = EncryptionUtil.encryptionAES(
          responsestringgames.data.refreshToken
        );
        localStorage.setItem("adminRefreshToken", encryptedToken2);
      } else {
        console.log("not login");
      }

      const responsecarrace = await postAPIHandlercarrace({
        endPoint: "logincarrace",
        dataToSend: {
          email: "support@stringdrive.io",
          password: "Admin@123",
          // email: "admin@gmail.com",
          // password: "admin@1234",
        },
        secret_key: process.env.REACT_APP_SECRET_KEY_Drive,
      });

      // console.log("responsecarrace:", responsecarrace);

      console.log("Starting Tetris login call...");
      console.log(
        "Tetris Secret Key:",
        process.env.REACT_APP_SECRET_KEY_Tetris
      );

      const responsetetris = await postAPIHandlertetris({
        endPoint: "logintetris",
        dataToSend: {
          email: "admin@gmail.com",
          password: "admin@1234",
        },
        secret_key: process.env.REACT_APP_SECRET_KEY_Tetris,
      });

      console.log("Tetris Response Full:", responsetetris);
      console.log("Tetris Response Status:", responsetetris.status);
      console.log("Tetris Response Data:", responsetetris.data);
      console.log(
        process.env.REACT_APP_SECRET_KEY_Drive,
        "process.env.REACT_APP_SECRET_KEY"
      );
      console.log(
        process.env.REACT_APP_SECRET_KEY_Retro,
        "process.env.REACT_APP_SECRET_KEYretro"
      );
      console.log(
        process.env.REACT_APP_SECRET_KEY_Modern,
        "process.env.REACT_APP_SECRET_KEYmodern"
      );
      // console.log(new Date().getTime(), "new Date().getTime()");

      if (response.status === 200 && response.data.token) {
        console.log(responseretro, "responseretro");
        console.log(responsemodern, "responsemodern");
        console.log(responsespin, "responsespin");
        console.log(responsestringgames, "responsestringgames");
        console.log(responsecarrace, "responsecarrace");
        console.log(responsetetris, "responsetetris");
        toast.success(response.data.message || "Login successful");
        window.sessionStorage.setItem("token", response.data.token);
        window.sessionStorage.setItem(
          "retrotoken",
          responseretro.data.result.token
        );
        window.sessionStorage.setItem(
          "stringtoken",
          responsestringgames.data.token
        );
        window.sessionStorage.setItem(
          "moderntoken",
          responsemodern.data.result.token
        );
        window.sessionStorage.setItem("spintoken", responsespin.data.token);
        window.sessionStorage.setItem("carrace", responsecarrace.data.token);
        window.sessionStorage.setItem("tetris", responsetetris.data.token);

        // if (responsetetris && responsetetris.data && responsetetris.data.token) {
        //   console.log("Setting Tetris token:", responsetetris.data.token);
        //   window.sessionStorage.setItem("tetris", responsetetris.data.token);
        // } else {
        //   console.warn("Tetris login failed or returned no token. Response:", responsetetris);
        //   window.sessionStorage.setItem("tetris", "");
        // }
        auth.userLogIn(true, response.data.token);

        if (isRemember) {
          window.localStorage.setItem(
            "packman",
            JSON.stringify({
              username: values.username,
              password: values.password,
            })
          );
        } else {
          window.localStorage.removeItem("packman");
        }

        history("/dashboard"); // Redirect to dashboard
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Login error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        stack: error.stack,
      });
    } finally {
      setIsUpdating(false);
    }
  };
  const [tabs, setTabs] = useState("email");
  return (
    <Box className={classes.loginMainBox}>
      <Container>
        <Box className={classes.loginBox}>
          <Paper elevation={3} className="paperBox">
            <Box className="displayCenter">
              <img src="images/logo.svg" alt="logo" />
            </Box>
            <Typography variant="h2">String Withdraw Platform</Typography>

            <Formik
              initialValues={initialValues}
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
                  <Box mt={3}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Username"
                      name="username"
                      value={values.username}
                      error={Boolean(touched.username && errors.username)}
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
                      {touched.username && errors.username}
                    </FormHelperText>
                  </Box>
                  <Box mt={2} mb={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={values.password}
                      error={Boolean(touched.password && errors.password)}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className="textfiledicons"
                          >
                            <IconButton>
                              <CgKey />
                            </IconButton>
                            <Divider
                              orientation="vertical"
                              style={{ height: "27px" }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              <Box>
                                {showPassword ? (
                                  <HiEye className={classes.iconClass1} />
                                ) : (
                                  <HiEyeOff className={classes.iconClass1} />
                                )}
                              </Box>
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText error className={classes.helperText}>
                      {touched.password && errors.password}
                    </FormHelperText>
                  </Box>
                  <Box className="displaySpacebetween">
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="remember"
                          onChange={(e) => {
                            setIsRemember(e.target.checked);
                          }}
                          checked={isRemember}
                        />
                      }
                      label="Remember Me"
                    />
                    <Typography
                      variant="body2"
                      style={{
                        color: "#DE14FF",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                      onClick={() => history("/forget-password")}
                    >
                      Forgot Password?
                    </Typography>
                  </Box>
                  <Box className="buttonBox">
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isUpdating}
                    >
                      LOGIN
                      {isUpdating && <ButtonCircularProgress />}
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
