import {
  getAPIHandler,
  postAPIHandler,
  putAPIHandler,
} from "src/ApiConfig/service";
import {
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
import axios from "axios";
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
        borderRadius: "10px",
      },

      "& .editIcon": {
        height: "35px",
        width: "35px",
        borderRadius: "50%",
        color: "#000",
        position: "absolute",
        left: "489px",
        bottom: "10px",
        color: "#fff",
        background: "rgba(0, 0, 0, 0.4)",
        [theme.breakpoints.down("sm")]: {
          left: "392px",
        },
      },
    },
  },
}));

function AddBanner() {
  const classes = useStyles();
  const location = useLocation();
  const history = useNavigate();
  const [categoryData, setCategoryData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const formInitialSchema = {
    bannerURL: categoryData?.bannerURL ? categoryData?.bannerURL : "",
    profilePic: categoryData?.bannerImage ? categoryData?.bannerImage : "",
    profilePicUpload: "",
  };

  const formValidationSchema = yep.object().shape({
    profilePic: yep.string().required("Banner image is required"),
    bannerURL: yep
      .string()
      .url("Invalid URL format")
      .matches(
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
        "Invalid URL format"
      )
      .max(255, "URL must be at most 255 characters"),
  });

  const addCategoryApi = async (values) => {
    try {
      setIsUpdating(true);
      const formData = new FormData();
      values.bannerURL && formData.append("bannerURL", values.bannerURL);
      formData.append("bannerImage", values.profilePic);
      const response = await postAPIHandler({
        endPoint: "addBanner",
        dataToSend: formData,
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/banner-management");
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
      const formData = new FormData();
      values.bannerURL && formData.append("bannerURL", values.bannerURL);
      formData.append("bannerImage", values.profilePic);
      formData.append("bannerId", location?.state?.bannerId);
      const response = await putAPIHandler({
        endPoint: "editBanner",
        dataToSend: formData,
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/banner-management");
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
        endPoint: "viewBanner",
        paramsData: {
          _id: location?.state?.bannerId,
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
    const source = axios.CancelToken.source();
    getCategoryApi();
    return () => {
      source.cancel();
    };
  }, [location?.state?.announcementId]);
  return (
    <Box className={classes.main}>
      {isUpdating ? (
        <PageLoading />
      ) : (
        <>
          <Box mb={5}>
            <GoBack title="Add Banner" />
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
                    <Box className="displayColumn" mb={4}>
                      <Box className="dropDownBoxProfile" mt={3}>
                        <Box>
                          <img
                            src={
                              values.profilePicUpload
                                ? URL.createObjectURL(values.profilePicUpload)
                                : values.profilePic || "/images/banner.png"
                            }
                            style={{
                              height: "150px",
                              width: "150px",
                            }}
                          />
                          {location?.state?.type === "VIEW" ? (
                            ""
                          ) : (
                            <IconButton className="editIcon displayCenter">
                              <label htmlFor="raised-button-file-profile">
                                <MdEdit style={{ cursor: "pointer" }} />
                              </label>
                            </IconButton>
                          )}
                        </Box>

                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="raised-button-file-profile"
                          name="profilePic"
                          type="file"
                          onChange={(e) => {
                            setFieldValue("profilePic", e.target.files[0]);
                            setFieldValue(
                              "profilePicUpload",
                              e.target.files[0]
                            );
                          }}
                        />
                      </Box>
                      <FormHelperText error className={classes.helperText}>
                        {touched.profilePic && errors.profilePic}
                      </FormHelperText>
                      <Box mt={1}>
                        <Typography variant="body2">Banner Image</Typography>
                      </Box>
                      <Box mt={1}>
                        <Typography variant="body2">
                          Please upload the image with the size 950*350.
                        </Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">Banner URL</Typography>
                        </Box>
                        <FormControl fullWidth>
                          <TextField
                            variant="outlined"
                            placeholder="Banner Url"
                            name="bannerURL"
                            value={values.bannerURL}
                            error={Boolean(
                              touched.bannerURL && errors.bannerURL
                            )}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={location?.state?.type === "VIEW"}
                          />
                        </FormControl>
                        <FormHelperText error className={classes.helperText}>
                          {touched.bannerURL && errors.bannerURL}
                        </FormHelperText>
                      </Grid>
                    </Grid>

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
                  </Paper>
                </Form>
              )}
            </Formik>
          </Container>
        </>
      )}
    </Box>
  );
}

export default AddBanner;
