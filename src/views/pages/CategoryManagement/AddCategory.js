import {
  getAPIHandler,
  postAPIHandler,
  putAPIHandler,
} from "src/ApiConfig/service";
import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import * as yep from "yup";
import { MdEdit } from "react-icons/md";
import GoBack from "src/component/GoBack";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import PageLoading from "src/component/PageLoading";
const useStyles = makeStyles((theme) => ({
  main: {
    "& h3": {
      marginBottom: "30px",
    },
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
        right: "0px",
        bottom: "10px",
        color: "#fff",
        background: "rgba(0, 0, 0, 0.4)",
      },
    },
    "& .classRes": {
      gap: "50px",
      flexWrap: "wrap",
      [theme.breakpoints.down("xs")]: {
        gap: "5px !important",
      },
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

function AddCategory() {
  const classes = useStyles();
  const location = useLocation();
  const history = useNavigate();
  const [categoryData, setCategoryData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const formInitialSchema = {
    categoryTitle: categoryData?.categoryTitle
      ? categoryData?.categoryTitle
      : "",
    categoryIcon: categoryData?.categoryIcon ? categoryData?.categoryIcon : "",
    categoryIcon2: categoryData?.categoryIcon2
      ? categoryData?.categoryIcon2
      : "",
  };

  const formValidationSchema = yep.object().shape({
    categoryIcon: yep.string().required("Category icon is required"),
    categoryIcon2: yep.string().required("Category icon is required"),

    categoryTitle: yep
      .string()
      .max(256, "Should not exceeds 256 characters.")
      .required("Category title is required."),
  });

  const addCategoryApi = async (values) => {
    try {
      setIsUpdating(true);

      const response = await postAPIHandler({
        endPoint: "addCategory",
        dataToSend: {
          categoryTitle: values.categoryTitle,
          categoryIcon: values.categoryIcon,
          categoryIcon2: values.categoryIcon2,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/category-management");
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

  const editCategoryApi = async (values) => {
    try {
      setIsUpdating(true);
      const response = await putAPIHandler({
        endPoint: "editCategory",
        dataToSend: {
          categoryId: location?.state?.categoryId,
          categoryTitle: values.categoryTitle,
          categoryIcon: values.categoryIcon,
          categoryIcon2: values.categoryIcon2,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/category-management");
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
  const getCategoryApi = async (source) => {
    try {
      setCategoryData({});
      setIsUpdating(true);
      const response = await getAPIHandler({
        endPoint: "viewCategory",
        paramsData: {
          _id: location?.state.categoryId,
        },
        source: source,
      });
      if (response.data.responseCode === 200) {
        setCategoryData(response.data.result);
        setIsUpdating(false);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };
  useEffect(() => {
    getCategoryApi();
  }, [location?.state.categoryId]);
  return (
    <>
      {isUpdating ? (
        <PageLoading />
      ) : (
        <Box className={classes.main}>
          <Box mb={5}>
            <GoBack title="Add Category" />
          </Box>
          <Container maxWidth="md">
            <Formik
              enableReinitialize={true}
              initialValues={formInitialSchema}
              validationSchema={formValidationSchema}
              onSubmit={
                location?.state?.type === "EDIT"
                  ? (values) => editCategoryApi(values)
                  : (values) => addCategoryApi(values)
              }
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
                    <Box
                      className="displayCenter classRes"
                      style={{
                        gap: "50px",

                        flexWrap: "wrap",
                      }}
                      mb={4}
                    >
                      <Box>
                        <Box className="dropDownBoxProfile" mt={3}>
                          <Box>
                            <Avatar
                              src={
                                values.categoryIcon
                                  ? values.categoryIcon
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
                          </Box>
                          <input
                            accept="image/*"
                            style={{ display: "none" }}
                            id="raised-button-file-profile"
                            name="categoryIcon"
                            type="file"
                            onChange={(e) => {
                              getBase64(e.target.files[0], (result) => {
                                setFieldValue("categoryIcon", result);
                              });
                            }}
                          />
                        </Box>
                        <FormHelperText error className={classes.helperText}>
                          {touched.categoryIcon && errors.categoryIcon}
                        </FormHelperText>
                        <Box mt={1} textAlign="center">
                          <Typography variant="body2">Category Icon</Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Box className="dropDownBoxProfile" mt={3}>
                          <Box>
                            <Avatar
                              src={
                                values.categoryIcon2
                                  ? values.categoryIcon2
                                  : "/images/dashboard/profile.png"
                              }
                              style={{
                                height: "150px",
                                width: "150px",
                              }}
                            />

                            <IconButton className="editIcon displayCenter">
                              <label htmlFor="raised-button-file-profile2">
                                <MdEdit style={{ cursor: "pointer" }} />
                              </label>
                            </IconButton>
                          </Box>
                          <input
                            accept="image/*"
                            style={{ display: "none" }}
                            id="raised-button-file-profile2"
                            name="categoryIcon2"
                            type="file"
                            onChange={(e) => {
                              getBase64(e.target.files[0], (result) => {
                                setFieldValue("categoryIcon2", result);
                              });
                            }}
                          />
                        </Box>
                        <FormHelperText error className={classes.helperText}>
                          {touched.categoryIcon2 && errors.categoryIcon2}
                        </FormHelperText>
                        <Box mt={1} textAlign="center">
                          <Typography variant="body2">
                            Category Icon2
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box p={3}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Box mb={1}>
                            <Typography variant="body2">
                              Category Title
                            </Typography>
                          </Box>
                          <FormControl fullWidth>
                            <TextField
                              variant="outlined"
                              placeholder="Category Title"
                              name="categoryTitle"
                              value={values.categoryTitle}
                              error={Boolean(
                                touched.categoryTitle && errors.categoryTitle
                              )}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              disabled={location?.state?.type === "VIEW"}
                            />
                          </FormControl>
                          <FormHelperText error className={classes.helperText}>
                            {touched.categoryTitle && errors.categoryTitle}
                          </FormHelperText>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box className="displayCenter" py={4}>
                      {location?.state?.type !== "VIEW" && (
                        <Box>
                          <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={isUpdating}
                          >
                            {location?.state?.type === "ADD" ? "Add" : "Submit"}
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
                  </Paper>
                </Form>
              )}
            </Formik>
          </Container>
        </Box>
      )}
    </>
  );
}

export default AddCategory;
