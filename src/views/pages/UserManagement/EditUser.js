import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yep from "yup";
const useStyles = makeStyles((theme) => ({
  main: {
    height: "100%",
    "& .detailsBG": {
      maxWidth: "900px",
      width: "100%",
      height: "auto",
      padding: "30px",
      borderRadius: "15px",
      background: "#fff",
      flexDirection: "column",
      boxShadow: "0px 0px 33px -20px rgba(0,0,0,0.75)",
    },
  },
}));
function EditUser() {
  const history = useNavigate();
  const classes = useStyles();
  const [data, setData] = useState({
    firstName: "",
    userName: "",
    Email: "",
    MobileNumber: "",
    Address: "",
  });
  const handleFormSubmit = (value) => {
    console.log("value", value);
    // setData((prevData) => {
    //     return{...prevData, [fieldName]: e.target.value}
    // });
  };
  const editData = () => {
    console.log("edited data is ", data);
  };
  const formInitialSchema = {
    firstName: "",
    userName: "",
    Email: "",
    MobileNumber: "",
    Address: "",
  };
  return (
    <div className={classes.main}>
      <Box p={3}>
        <Typography variant="h4">EDIT DETAIL</Typography>
      </Box>
      <Divider />

      <Box className="displayCenter" style={{ height: "calc(100% - 100px)" }}>
        <Box className="displayCenter detailsBG">
          <Grid item xs={12} align="center">
            <img
              src="images/user.png"
              alt="user"
              width="100px"
              height="100px"
            />
          </Grid>
          <Formik
            onSubmit={(values) => {
              handleFormSubmit(values);
            }}
            initialValues={formInitialSchema}
            validationSchema={yep.object().shape({
              firstName: yep
                .string()
                .required("Please enter your full name")
                .min(4, "Please enter at least 4 characters")
                .max(30, "You can enter only 30 characters"),
              userName: yep
                .string()
                .required("Please enter your full name")
                .min(4, "Please enter at least 4 characters")
                .max(30, "You can enter only 30 characters"),
              Email: yep
                .string()
                .required("Please enter your full name")
                .min(4, "Please enter at least 4 characters")
                .max(30, "You can enter only 30 characters"),
              MobileNumber: yep
                .string()
                .required("Please enter your full name")
                .min(4, "Please enter at least 4 characters")
                .max(30, "You can enter only 30 characters"),
              Address: yep
                .string()
                .required("Please enter your full name")
                .min(4, "Please enter at least 4 characters")
                .max(30, "You can enter only 30 characters"),
            })}
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
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Typography variant="h5">First Name</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      placeholder="Enter the first name"
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="h5">Username</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="userName"
                      value={values.userName}
                      onChange={handleChange}
                      placeholder="Enter the username"
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="h5">Email</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="Email"
                      value={values.Email}
                      onChange={handleChange}
                      placeholder="Enter the email"
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="h5">Mobile Number</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="MobileNumber"
                      value={values.MobileNumber}
                      onChange={handleChange}
                      placeholder="Enter the mobile number"
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="h5">Address</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="Address"
                      value={values.Address}
                      onChange={handleChange}
                      placeholder="Enter the Address"
                    />
                  </Grid>

                  <Grid
                    container
                    xs={12}
                    alignItems="center"
                    justifyContent="center"
                    style={{ marginTop: "10px" }}
                  >
                    <Grid item xs={3} align="center">
                      <Button color="primary" variant="contained" type="submit">
                        Edit
                      </Button>
                    </Grid>
                    <Grid item xs={3} align="center">
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => history(-1)}
                      >
                        Back
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </div>
  );
}

export default EditUser;
