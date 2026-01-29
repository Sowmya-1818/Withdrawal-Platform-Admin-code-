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
} from "@material-ui/core";
import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { CgKey } from "react-icons/cg";
import { Form, Formik } from "formik";
import * as yep from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { postAPIHandler } from "src/ApiConfig/service";
import { toast } from "react-hot-toast";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";

const useStyles = makeStyles((theme) => ({
  resetPassBox: {
    height: "100vh",
    position: "relative",
    zIndex: "999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflowY: "auto",
    "& h2": {
      color: "#FFFFFF",
      textAlign: "center",
    },
  },
  resetBox: {
    height: "initial",
    margin: "15px auto",
    maxHeight: "100%",
    maxWidth: "475px",
    width: "100%",
    "& .buttonBox": {
      padding: "35px 0 0",
      display: "flex",
      justifyContent: "flex-end",
    },
    "& h2": {
      color: "#FFFFFF",
    },
  },
  iconClass1: {
    color: "#585757",
    fontSize: "20px",
  },
}));

export default function ResetPassword() {
  const classes = useStyles();
  const history = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const formInitialSchema = {
    password: "",
    confirmPassword: "",
  };
  const formValidationSchema = yep.object().shape({
    password: yep
      .string()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character."
      )
      .required("New password is required.")
      .min(6, "Please enter atleast 6 characters")
      .max(20, "You can enter only 30 characters"),

    confirmPassword: yep
      .string()
      .required("Confirm password and new password should match.")
      .oneOf([yep.ref("password"), null], "Confirm password does not match."),
  });
  const handleFormSubmit = async (values) => {
    try {
      setIsUpdating(true);
      const response = await postAPIHandler({
        endPoint: "resetPassword",
        dataToSend: {
          password: values.password,
          confirmPassword: values.confirmPassword,
          email: location.search.split("?")[1],
        },
      });
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        history("/");
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };
  return (
    <Box className={classes.resetPassBox}>
      <Container>
        <Box className={classes.resetBox}>
          <Paper elevation={3}>
            <Box mb={4}>
              <Typography variant="h2">Reset Password</Typography>
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
                  <Box>
                    <Box mt={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Confirm password"
                        type={showPassword1 ? "text" : "password"}
                        name="confirmPassword"
                        value={values.confirmPassword}
                        error={Boolean(
                          touched.confirmPassword && errors.confirmPassword
                        )}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onPaste={(e) => e.preventDefault()}
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
                                onClick={() => setShowPassword1(!showPassword1)}
                                edge="end"
                              >
                                <Box>
                                  {showPassword1 ? (
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
                    </Box>
                    <FormHelperText error className={classes.helperText}>
                      {touched.confirmPassword && errors.confirmPassword}
                    </FormHelperText>
                  </Box>
                  <Box className="buttonBox">
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                      disabled={isUpdating}
                    >
                      Submit
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
