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
  Grid,
  Container,
} from "@material-ui/core";
import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Form, Formik } from "formik";
import * as yep from "yup";
import { useNavigate } from "react-router-dom";
import { CgKey } from "react-icons/cg";
import { patchAPIHandler } from "src/ApiConfig/service";
import { toast } from "react-hot-toast";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import GoBack from "src/component/GoBack";

const useStyles = makeStyles((theme) => ({
  changePassBox: {
    "& .paperBox": {
      [theme.breakpoints.down("sm")]: {
        padding: "20px 15px 50px !important",
      },
    },
    iconsClass1: {
      color: "#585757",
      fontSize: "20px",
    },
  },
}));

export default function ChangePassword() {
  const classes = useStyles();
  const history = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const formInitialSchema = {
    oldPassword: "",
    password: "",
    confirmPassword: "",
  };
  const formValidationSchema = yep.object().shape({
    oldPassword: yep
      .string()
      .trim()
      .required("Please enter old password.")
      .min(6, "Please enter at least 6 characters.")
      .max(18, "You can enter up to 18 characters."),
    password: yep
      .string()
      .trim()
      .notOneOf(
        [yep.ref("oldPassword"), null],
        "Password cannot be the same as old password."
      )
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?])[a-zA-Z\d!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]{8,}$/,
        "Password must contain 8 characters, one uppercase, one lowercase, one number, and one special character."
      )
      .required("Please enter password.")
      .min(6, "Please enter at least 6 characters.")
      .max(18, "You can enter up to 18 characters."),
    confirmPassword: yep
      .string()
      .required("Confirm password and new password should match.")
      .oneOf([yep.ref("password"), null], "Confirm password does not match."),
  });
  const handleFormSubmit = async (values) => {
    try {
      setIsUpdating(true);
      const response = await patchAPIHandler({
        endPoint: "changePassword",
        dataToSend: {
          oldPassword: values.oldPassword,
          newPassword: values.password,
        },
      });
      if (response.data.responseCode === 200) {
        window.sessionStorage.setItem("token", response.data.result.token);
        toast.success(response.data.responseMessage);
        history("/dashboard");
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };

  return (
    <Box className={classes.changePassBox}>
      <Box mb={5}>
        <GoBack title="Change Password" />
      </Box>
      <Container maxWidth="sm">
        <Paper elevation={3} className="paperBox">
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
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box mb={1}>
                      <Typography variant="body2">Old Password</Typography>
                    </Box>

                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Please enter current password"
                      type={showPassword ? "text" : "password"}
                      name="oldPassword"
                      value={values.oldPassword}
                      error={Boolean(touched.oldPassword && errors.oldPassword)}
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
                      {touched.oldPassword && errors.oldPassword}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Box mb={1}>
                      <Typography variant="body2">New Password</Typography>
                    </Box>

                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter new password"
                      type={showPassword1 ? "text" : "password"}
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
                    <FormHelperText error className={classes.helperText}>
                      {touched.password && errors.password}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Box mb={1}>
                      <Typography variant="body2">Confirm Password</Typography>
                    </Box>

                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter confirm password"
                      type={showPassword2 ? "text" : "password"}
                      name="confirmPassword"
                      value={values.confirmPassword}
                      error={Boolean(
                        touched.confirmPassword && errors.confirmPassword
                      )}
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
                              onClick={() => setShowPassword2(!showPassword2)}
                              edge="end"
                            >
                              <Box>
                                {showPassword2 ? (
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
                      {touched.confirmPassword && errors.confirmPassword}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Box className="displayCenter">
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isUpdating}
                      >
                        Submit
                        {isUpdating && <ButtonCircularProgress />}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </Box>
  );
}
