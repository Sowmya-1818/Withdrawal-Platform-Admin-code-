import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  Container,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import GoBack from "src/component/GoBack";
import { MdEdit } from "react-icons/md";
import { toast } from "react-hot-toast";
import * as yep from "yup";
import { Form, Formik } from "formik";
import { putAPIHandler } from "src/ApiConfig/service";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "src/context/Auth";
import { getBase64 } from "src/utils";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
const useStyles = makeStyles((theme) => ({
  main: {
    "& .publicBox": {
      width: "100%",

      margin: "0 auto",
      "& h6": {
        color: "#fff",
      },

      "& h2": {
        color: "#fff",
      },
    },
    "& .dropDownBoxProfile": {
      height: "195px",
      width: "100%",
      maxWidth: "150px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      overflow: "hidden",
      position: "relative",

      "& img": {
        height: "150px",
        width: "100%",
        maxWidth: "150px",
        height: "150px",
        backgroundSize: "cover !important",
        backgroundRepeat: "no-repeat !important",
        objectFit: "cover !important",
        borderRadius: "50%",
      },

      "& .editIcon": {
        height: "35px",
        width: "35px",
        borderRadius: "50%",
        color: "#000",
        position: "absolute",
        left: "75%",
        bottom: "50px",
        color: "#fff",
        background: "rgba(0, 0, 0, 0.4)",
      },
      "& p": {
        textAlign: "center",
        color: "#fff",
        marginTop: "16px",
      },
    },
  },
}));

function EditProfile() {
  const classes = useStyles();
  const [isUpdating, setIsUpdating] = useState(false);
  const history = useNavigate();
  const auth = useContext(AuthContext);
  const formInitialSchema = {
    firstName: auth.userData?.firstName ? auth.userData?.firstName : "",
    lastName: auth.userData?.lastName ? auth.userData?.lastName : "",
    email: auth.userData?.email ? auth.userData?.email : "",
    userName: auth.userData?.userName ? auth.userData?.userName : "",
    profilePic: auth.userData?.profilePic ? auth.userData?.profilePic : "",
  };
  const formValidationSchema = yep.object().shape({
    firstName: yep
      .string()
      .min(3, "Please enter atleast 3 characters.")
      .max(256, "You can enter only 256 characters.")
      .required("First name is required.")
      .matches(
        /^[a-zA-Z]+(([',. -][a-zA-Z])?[a-zA-Z]*)*$/g,
        "Please enter your first name."
      ),
    lastName: yep
      .string()
      .min(3, "Please enter atleast 3 characters.")
      .max(256, "You can enter only 256 characters.")
      .required("Last name is required.")
      .matches(
        /^[a-zA-Z]+(([',. -][a-zA-Z])?[a-zA-Z]*)*$/g,
        "Please enter your last name."
      ),
    userName: yep
      .string()
      .trim()
      .min(3, "Please enter atleast 3 characters.")
      .max(256, "You can enter only 256 characters.")
      .required("User name is required."),

    email: yep
      .string()
      .trim()
      .email("Please enter valid email.")
      .required("Email address is required.")
      .max(256, "Should not exceeds 256 characters.")
      .matches("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"),
  });

  const editProfileApi = async (values) => {
    try {
      setIsUpdating(true);

      const response = await putAPIHandler({
        endPoint: "editProfile",
        dataToSend: {
          firstName: values.firstName,
          lastName: values.lastName,
          userName: values.userName,
          email: values.email.toLocaleLowerCase(),
          profilePic: values.profilePic,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        auth.getProfileDataApi();
        history("/profile");
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      console.log(error);
      toast.error(error.response.data.responseMessage);
    }
  };
  return (
    <Box className={classes.main}>
      <GoBack title="Edit profile" />

      <Box mt={3}>
        <Paper elevation={3}>
          <Formik
            initialValues={formInitialSchema}
            validationSchema={formValidationSchema}
            onSubmit={(values) => editProfileApi(values)}
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
                <Box className="publicBox">
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <Box className="dropDownBoxProfile" mt={3}>
                        <Box>
                          <Avatar
                            src={
                              values.profilePic
                                ? values.profilePic
                                : "/images/dashboard/profile.png"
                            }
                            style={{
                              height: "150px",
                              width: "150px",
                            }}
                          />

                          <IconButton className="editIcon displayCenter">
                            <label htmlFor="raised-button-file-profile">
                              <MdEdit style={{ cursor: "pointer" }} />
                            </label>
                          </IconButton>
                          <Typography variant="body2">Admin Profile</Typography>
                        </Box>
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="raised-button-file-profile"
                          name="profilePic"
                          type="file"
                          onChange={(e) => {
                            getBase64(e.target.files[0], (result) => {
                              setFieldValue("profilePic", result);
                            });
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box mt={2}>
                        <Box mb={1}>
                          <Typography variant="body2">First Name</Typography>
                        </Box>
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Please enter first name."
                          type="text"
                          name="firstName"
                          value={values.firstName}
                          error={Boolean(touched.firstName && errors.firstName)}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={isUpdating}
                        />
                        <FormHelperText error>
                          {touched.firstName && errors.firstName}
                        </FormHelperText>
                      </Box>
                      <Grid item xs={12}>
                        <Box mt={2}>
                          <Box mb={1}>
                            <Typography variant="body2">Last Name</Typography>
                          </Box>

                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Please enter last name."
                            type="text"
                            name="lastName"
                            value={values.lastName}
                            error={Boolean(touched.lastName && errors.lastName)}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={isUpdating}
                          />
                          <FormHelperText error>
                            {touched.lastName && errors.lastName}
                          </FormHelperText>
                        </Box>
                        <Box mt={2}>
                          <Box mb={1}>
                            <Typography variant="body2">Email ID</Typography>
                          </Box>
                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Enter email"
                            type="email"
                            name="email"
                            value={values.email}
                            error={Boolean(touched.email && errors.email)}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={isUpdating}
                          />
                          <FormHelperText error>
                            {touched.email && errors.email}
                          </FormHelperText>
                        </Box>
                      </Grid>
                      <Grid xs={12}>
                        <Box mt={2}>
                          <Box mb={1}>
                            <Typography variant="body2">User Name</Typography>
                          </Box>

                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Please enter user name."
                            type="text"
                            name="userName"
                            value={values.userName}
                            error={Boolean(touched.userName && errors.userName)}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={isUpdating}
                          />
                          <FormHelperText error>
                            {touched.userName && errors.userName}
                          </FormHelperText>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mt={3}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isUpdating}
                    >
                      Update
                      {isUpdating && <ButtonCircularProgress />}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => history(-1)}
                      style={{ marginLeft: "10px" }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Box>
  );
}

export default EditProfile;
