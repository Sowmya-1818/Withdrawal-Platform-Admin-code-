import {
  getAPIHandler,
  postAPIHandler,
  putAPIHandler,
} from "src/ApiConfig/service";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import * as yep from "yup";
import axios from "axios";
import GoBack from "src/component/GoBack";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import { sections } from "src/layouts/DashboardLayout/NavBar";
const useStyles = makeStyles((theme) => ({
  main: {
    "& .dropDownBoxProfile": {
      width: "100%",
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
        left: "478px",
        bottom: "10px",
        color: "#fff",
        background: "rgba(0, 0, 0, 0.4)",
        [theme.breakpoints.down("sm")]: {
          left: "382px",
        },
      },
    },
    "& th": {
      background: "#DE14FF",
      textAlign: "center",
      color: "white",
      border: "1px solid white",
    },
    "& .MuiTableContainer-root": {
      marginTop: "30px",
    },
    "& .MuiTableCell-body": {
      textAlign: "center",
      borderBottom: "1px solid #DE14FF",
    },
    "& .MuiPaginationItem-textPrimary.Mui-selected": {
      borderRadius: "50px",
      border: "1px solid #DE14FF",
      background: "#DE14FF",
    },
    "& .MuiPagination-root": {
      width: "fit-content",
      padding: "20px 0",
    },
    "& .MuiPaginationItem-rounded": {
      border: "1px solid ",
      borderRadius: "50px",
    },
  },
}));

export const getBase64 = (file, cb) => {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    cb(reader.result);
  };
  reader.onerror = function (err) {
    console.log("Error: ", err);
  };
};

function AddSubAdmin() {
  const classes = useStyles();
  const location = useLocation();
  const history = useNavigate();
  const [permission, setPermission] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [subAdminData, setSubAdminData] = useState([]);
  const [isUpdatingView, setIsUpdatingView] = useState(false);

  const formInitialSchema = {
    firstName: subAdminData?.firstName ? subAdminData?.firstName : "",
    lastName: subAdminData?.lastName ? subAdminData?.lastName : "",
    email: subAdminData?.email ? subAdminData?.email : "",
  };

  const formValidationSchema = yep.object().shape({
    firstName: yep
      .string()
      .min(3, "Please enter atleast 3 characters.")
      .max(32, "You can enter only 32 characters.")
      .required("First name is required.")
      .matches(
        /^[a-zA-Z]+(([',. -][a-zA-Z])?[a-zA-Z]*)*$/g,
        "Please enter first name."
      ),
    lastName: yep
      .string()
      .min(3, "Please enter atleast 3 characters.")
      .max(32, "You can enter only 32 characters.")
      .required("Last name is required.")
      .matches(
        /^[a-zA-Z]+(([',. -][a-zA-Z])?[a-zA-Z]*)*$/g,
        "Please enter last name."
      ),
    email: yep
      .string()
      .trim()
      .email("Please enter valid email.")
      .required("Email address is required.")
      .max(100, "Should not exceeds 100 characters.")
      .matches("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"),
  });

  console.log(sections,"sectionsdata");
  
  const addSubAdminApi = async (values) => {
    try {
      setIsUpdating(true);
      const response = await postAPIHandler({
        endPoint: "addSubAdmin",
        dataToSend: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email.toLocaleLowerCase(),
          permissions: permission,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/sub-admin-management");
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

  const editSubAdminApi = async (values) => {
    try {
      setIsUpdating(true);
      const response = await putAPIHandler({
        endPoint: "editProfileSubAdmin",
        dataToSend: {
          id: location?.state?.subAdminId,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email.toLocaleLowerCase(),
          permissions: permission,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/sub-admin-management");
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
  const subAdminManagementApi = async (source) => {
    try {
      setSubAdminData([]);
      setIsUpdatingView(true);
      const response = await getAPIHandler({
        endPoint: "viewUser",
        paramsData: {
          userId: location?.state?.subAdminId,
        },
        source: source,
      });
      if (response.data.responseCode === 200) {
        setSubAdminData(response.data.result);
        setIsUpdatingView(false);
      }
      setIsUpdatingView(false);
    } catch (error) {
      setIsUpdatingView(false);
    }
  };

  useEffect(() => {
    if (subAdminData) {
      setPermission(
        subAdminData?.permissions?.length > 0 ? subAdminData?.permissions : []
      );
    }
  }, [subAdminData]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (location?.state?.subAdminId) {
      subAdminManagementApi(source);
    }
    return () => {
      source.cancel();
    };
  }, [location?.state?.subAdminId]);
  return (
    <Box className={classes.main}>
      <Box mb={5}>
        <GoBack title="Add Sub Admin" />
      </Box>
      <Container maxWidth="md">
        <Formik
          enableReinitialize={true}
          initialValues={formInitialSchema}
          validationSchema={formValidationSchema}
          onSubmit={(values) => {
            if (permission?.length > 0) {
              location?.state?.type === "EDIT"
                ? editSubAdminApi(values)
                : addSubAdminApi(values);
            } else {
              toast.error("Please select permissions.");
            }
          }}
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
              <Paper elevation={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box mb={1}>
                      <Typography variant="body2">First Name</Typography>
                    </Box>
                    <FormControl fullWidth>
                      <TextField
                        type="text"
                        variant="outlined"
                        placeholder="Please enter first name."
                        inputProps={{ maxLength: 32 }}
                        name="firstName"
                        value={values.firstName}
                        error={Boolean(touched.firstName && errors.firstName)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={location?.state?.type === "VIEW"}
                      />
                    </FormControl>
                    <FormHelperText error className={classes.helperText}>
                      {touched.firstName && errors.firstName}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Box mb={1}>
                      <Typography variant="body2">Last Name</Typography>
                    </Box>
                    <FormControl fullWidth>
                      <TextField
                        type="text"
                        variant="outlined"
                        placeholder="Please enter last name."
                        inputProps={{ maxLength: 32 }}
                        name="lastName"
                        value={values.lastName}
                        error={Boolean(touched.lastName && errors.lastName)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={location?.state?.type === "VIEW"}
                      />
                    </FormControl>
                    <FormHelperText error className={classes.helperText}>
                      {touched.lastName && errors.lastName}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Box mb={1}>
                      <Typography variant="body2">Email</Typography>
                    </Box>
                    <FormControl fullWidth>
                      <TextField
                        type="email"
                        variant="outlined"
                        placeholder="Please enter email."
                        name="email"
                        value={values.email}
                        error={Boolean(touched.email && errors.email)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={
                          location?.state?.type === "VIEW" ||
                          location?.state?.type === "EDIT"
                        }
                      />
                    </FormControl>
                    <FormHelperText error className={classes.helperText}>
                      {touched.email && errors.email}
                    </FormHelperText>
                  </Grid>
                </Grid>

                <Box mt={5}>
                  <Box mb={3}>
                    <Typography variant="h5">Add Permissions</Typography>
                  </Box>

                  <Table>
                    <TableHead>
                      <TableRow>
                        {["Sr.No", "Name", "Operations"].map((item) => {
                          return <TableCell>{item}</TableCell>;
                        })}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {sections &&
                        sections.map((data, i) =>
                          data?.items?.map((value, index) => {
                            return (
                              <TableRow key={i}>
                                <TableCell>{index}</TableCell>
                                <TableCell>{value.title}</TableCell>

                                <TableCell>
                                  <Box>
                                    <PerTableBody
                                      setPermission={setPermission}
                                      permission={permission}
                                      data={value}
                                      subAdminData={subAdminData}
                                      i={i}
                                      type={location?.state?.type}
                                    />
                                  </Box>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                    </TableBody>
                  </Table>

                  <Box className="displayCenter" py={4}>
                    {location?.state?.type !== "VIEW" && (
                      <Box>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={isUpdating}
                        >
                          {location?.state?.type === "ADD" ? "Add" : "Save"}
                          {isUpdating && <ButtonCircularProgress />}
                        </Button>
                      </Box>
                    )}

                    <Box style={{ marginLeft: "16px" }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => history(-1)}
                      >
                        Back
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Form>
          )}
        </Formik>
      </Container>
    </Box>
  );
}
const PerTableBody = ({
  setPermission,
  data,
  i,
  permission,
  isLoading,
  type,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const permifil =
      permission &&
      permission?.filter((vl, i) => {
        if (vl == data.title) {
          setIsChecked(true);
        }
      });
  }, [permission]);

  return (
    <Checkbox
      key={i}
      sx={{
        "& input": {
          position: "inherit !important",
        },
      }}
      checked={isChecked}
      disabled={type === "VIEW"}
      inputProps={{ "aria-label": "controlled" }}
      onClick={(e) => {
        setIsChecked(!isChecked);
        if (!isChecked) {
          setPermission([...permission, data.title]);
        } else {
          setPermission(
            permission && permission?.filter((val, i) => val !== data.title)
          );
        }
      }}
      name={data.title}
    />
  );
};
export default AddSubAdmin;
