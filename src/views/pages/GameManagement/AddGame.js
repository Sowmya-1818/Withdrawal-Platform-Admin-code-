import {
  getAPIHandler,
  postAPIHandler,
  putAPIHandler,
} from "src/ApiConfig/service";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
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
import { Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import * as yep from "yup";
import { MdEdit } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import axios from "axios";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import GoBack from "src/component/GoBack";

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
              left: "478px",
              bottom: "10px",
              color: "#fff",
              background: "rgba(0, 0, 0, 0.4)",
              [theme.breakpoints.down("sm")]: {
                  left: "382px",
              },
          },
      },
  },
}));

const camelCase = (str) => {
  return str
      .replace(/\s(.)/g, function (match, group1) {
          return group1.toUpperCase();
      })
      .replace(/\s/g, "")
      .replace(/^(.)/, function (match, group1) {
          return group1.toLowerCase();
      });
};

function AddGame() {
  const classes = useStyles();
  const location = useLocation();
  const history = useNavigate();
  const [categoryDataList, setCategoryDataList] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [isCategoryUpdating, setIsCategoryUpdating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [checked, setChecked] = useState(false);
  const [newParamName, setNewParamName] = useState("");
  const [additionalParams, setAdditionalParams] = useState({});

  // const formInitialSchema = {
  //   gameTitle: categoryData?.gameTitle ? categoryData?.gameTitle : "",
  //   profilePic: categoryData?.gamePic ? categoryData?.gamePic : "",
  //   profilePicUpload: "",
  //   gameDetails: categoryData?.gameDetails ? categoryData?.gameDetails : "",
  //   selectCategory: categoryData?.category ? categoryData?.category : "",
  //   disclaimer: categoryData?.disclaimer ? categoryData?.disclaimer : "",
  //   latest: categoryData?.latest ? categoryData?.latest : "",

  // };
  // Utility function to deeply merge categoryData with default values
  const formInitialSchema = {
      // Basic Fields
      _id: categoryData?._id || "",
      gameTitle: categoryData?.gameTitle || "",
      profilePic: categoryData?.gamePic || "",
      profilePicUpload: "", // For file uploads, remains empty initially
      gameDetails: categoryData?.gameDetails || "",
      selectCategory: categoryData?.category || "",
      disclaimer: categoryData?.disclaimer || "",
      latest: typeof categoryData?.latest === "boolean" ? categoryData.latest : false,

      // Numeric Fields
      levelPrice: categoryData?.levelPrice ?? 0, // Use nullish coalescing to allow 0
      min: categoryData?.min ?? 0,
      max: categoryData?.max ?? 0,

      // Arrays
      level: Array.isArray(categoryData?.level)
          ? categoryData.level.map((lvl) => ({
              level: lvl.level || "",
              multiplier: lvl.multiplier || "",
              additionalParams: {
                  score: lvl.additionalParams?.score || "",
                  withdraw_popup: lvl.additionalParams?.withdraw_popup || "",
                  // Include other dynamic additionalParams if any
                  ...lvl.additionalParams,
              },
              _id: lvl._id || "",
          }))
          : [],

      rules: Array.isArray(categoryData?.rules)
          ? categoryData.rules.map((rule) => ({
              // Dynamically include all properties of each rule
              ...rule,
          }))
          : [],

      withdrawalRules: Array.isArray(categoryData?.withdrawalRules)
          ? categoryData.withdrawalRules.map((withdrawRule) => ({
              // Dynamically include all properties of each withdrawal rule
              ...withdrawRule,
          }))
          : [],

      // Additional Parameters
      additionalParams: categoryData?.additionalParams || {},

      // Metadata Fields
      status: categoryData?.status || "ACTIVE",
      createdAt: categoryData?.createdAt || "", // Consider using Date objects if applicable
      updatedAt: categoryData?.updatedAt || "",
      __v: categoryData?.__v ?? 0,
  }

  console.log(formInitialSchema, 'formInitialSchema');



  // Usage in React (assuming categoryData is available)
  //   const formInitialSchema = createFormInitialSchema(categoryData);

  const formValidationSchema = yep.object().shape({
      gameTitle: yep
          .string()
          .max(56, "Should not exceed 56 characters.")
          .required("Game title is required."),
      gameDetails: yep.string().required("Game detail is required."),
      selectCategory: yep.string().required("Category is required."),
      profilePic: yep.string().required("Game image is required"),
  });

  const addCategoryApi = async (values) => {
      try {
          setIsUpdating(true);
          const formData = new FormData();
          formData.append("gameTitle", values.gameTitle);
          formData.append("gamePic", values.profilePic);
          formData.append("gameDetails", values.gameDetails);
          formData.append("category", values.selectCategory);
          formData.append("latest", checked);
          formData.append("level", JSON.stringify([{ additionalParams }]));
          formData.append("additionalParams", JSON.stringify(additionalParams));
          const response = await postAPIHandler({
              endPoint: "addGame",
              dataToSend: formData,
          });
          if (response.data.responseCode == 200) {
              toast.success(response.data.responseMessage);
              history("/game-management");
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

  // const editCategoryApi = async (values) => {
  //   try {
  //     setIsUpdating(true);
  //     const formData = new FormData();
  //     formData.append("gameTitle", values.gameTitle);
  //     formData.append("gamePic", values.profilePic);
  //     formData.append("gameDetails", values.gameDetails);
  //     formData.append("category", values.selectCategory);
  //     formData.append("_id", location?.state?.gameId);
  //     formData.append("latest", checked);
  //     formData.append("level", JSON.stringify([{ additionalParams }]));
  //     formData.append("additionalParams", JSON.stringify(additionalParams));

  //     const response = await putAPIHandler({
  //       endPoint: "editgame",
  //       dataToSend: formData,
  //     });
  //     if (response.data.responseCode == 200) {
  //       toast.success(response.data.responseMessage);
  //       history("/game-management");
  //     } else {
  //       toast.error(response.data.responseMessage);
  //     }
  //     setIsUpdating(false);
  //   } catch (error) {
  //     setIsUpdating(false);
  //     console.log(error);
  //     toast.error(error.response.data.responseMessage);
  //   }
  // };


  const editCategoryApi = async (values) => {
      try {
          setIsUpdating(true);
          const formData = new FormData();

          // Merge existing data with updated values
          const dataToSubmit = {
              ...categoryData,
              ...values,
              // Ensure nested fields are properly merged
              level: values.level
                  ? values.level.map((lvl, index) => ({
                      ...categoryData.level[index],
                      ...lvl,
                      additionalParams: {
                          ...categoryData.level[index]?.additionalParams,
                          ...lvl.additionalParams,
                      },
                  }))
                  : categoryData.level,
              rules: values.rules ? values.rules : categoryData.rules,
              withdrawalRules: values.withdrawalRules
                  ? values.withdrawalRules
                  : categoryData.withdrawalRules,
              additionalParams: values.additionalParams
                  ? { ...categoryData.additionalParams, ...values.additionalParams }
                  : categoryData.additionalParams,
          };

          // Append all fields to FormData
          Object.keys(dataToSubmit).forEach((key) => {
              if (key === "level" || key === "rules" || key === "withdrawalRules" || key === "additionalParams") {
                  formData.append(key, JSON.stringify(dataToSubmit[key]));
              } else if (key === "profilePicUpload" && values.profilePicUpload) {
                  formData.append(key, values.profilePicUpload);
              } else {
                  formData.append(key, dataToSubmit[key]);
              }
          });

          // If you have files to upload (e.g., profilePicUpload), append them
          if (values.profilePicUpload) {
              formData.append("profilePicUpload", values.profilePicUpload);
              console.log(formData, "formData1");

          }

          // Make the API call
          if (formData) {
              console.log(formData.values, "formData");

          }



          const response = await putAPIHandler({
              endPoint: "editgame",
              dataToSend: formData,
          });

          if (response.data.responseCode === 200) {
              toast.success(response.data.responseMessage);
              history("/game-management");
          } else {
              toast.error(response.data.responseMessage);
          }
          setIsUpdating(false);
      } catch (error) {
          setIsUpdating(false);
          console.error(error);
          // Handle different error scenarios
          if (error.response && error.response.data && error.response.data.responseMessage) {
              toast.error(error.response.data.responseMessage);
          } else {
              toast.error("An unexpected error occurred.");
          }
      }
  };



  const getCategoryApi = async (source) => {
      try {
          setCategoryData({});
          setIsUpdating(true);
          const response = await getAPIHandler({
              endPoint: "viewgame",
              paramsData: {
                  _id: location?.state?.gameId,
              },
              source: source,
          });
          console.log(response, "response category");

          if (response?.data?.responseCode === 200) {
              setCategoryData(response?.data?.result);
              setAdditionalParams(response?.data?.result?.additionalParams || {});
              setIsUpdating(false);
          }
          setIsUpdating(false);
      } catch (error) {
          setIsUpdating(false);
      }
  };

  const gameManagementApi = async (source) => {
      try {
          setCategoryDataList([]);
          setIsCategoryUpdating(true);
          const response = await getAPIHandler({
              endPoint: "listCategory",
              source: source,
          });

          if (response.data.responseCode === 200) {
              setCategoryDataList(response.data.result.docs);
              setIsCategoryUpdating(false);
          }
          setIsCategoryUpdating(false);
      } catch (error) {
          setIsCategoryUpdating(false);
      }
  };

  useEffect(() => {
      getCategoryApi();
  }, [location?.state?.gameId]);

  useEffect(() => {
      if (categoryData) {
          setChecked(categoryData?.latest ? categoryData?.latest : false);
      }
  }, [categoryData]);

  useEffect(() => {
      const source = axios.CancelToken.source();
      gameManagementApi(source);
      return () => {
          source.cancel();
      };
  }, []);

  const addNewParam = () => {
      const camelCasedName = camelCase(newParamName);
      if (camelCasedName && !additionalParams[camelCasedName]) {
          setAdditionalParams({
              ...additionalParams,
              [camelCasedName]: "1",
          });
          setNewParamName("");
      }
  };

  return (
      <Box className={classes.main}>
          <Box mb={5}>
              <GoBack title={`${location?.state?.type} Game`} />
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
                                          <Avatar
                                              src={
                                                  values.profilePicUpload
                                                      ? URL.createObjectURL(values.profilePicUpload)
                                                      : values.profilePic || "/images/profile_img.png"
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
                                          disabled={isUpdating}
                                          onChange={(e) => {
                                              setFieldValue("profilePic", e.target.files[0]);
                                              setFieldValue("profilePicUpload", e.target.files[0]);
                                          }}
                                      />
                                  </Box>
                                  <Box mt={1} textAlign="center">
                                      <FormHelperText error className={classes.helperText}>
                                          {touched.profilePic && errors.profilePic}
                                      </FormHelperText>
                                      <Typography variant="body2">Game Image</Typography>
                                  </Box>
                              </Box>
                              <Box p={3}>
                                  <Grid container spacing={2}>
                                      <Grid item xs={12} sx={12} md={6}>
                                          <Typography variant="body2">Game Title</Typography>
                                      </Grid>
                                      <Grid item xs={12} sx={12} md={6}>
                                          <FormControl fullWidth>
                                              <TextField
                                                  variant="outlined"
                                                  placeholder="Game Title"
                                                  name="gameTitle"
                                                  value={values.gameTitle}
                                                  error={Boolean(touched.gameTitle && errors.gameTitle)}
                                                  inputProps={{ maxLength: 56 }}
                                                  onBlur={handleBlur}
                                                  onChange={handleChange}
                                                  disabled={
                                                      location?.state?.type === "VIEW" || isUpdating
                                                  }
                                              />
                                          </FormControl>
                                          <FormHelperText error className={classes.helperText}>
                                              {touched.gameTitle && errors.gameTitle}
                                          </FormHelperText>
                                      </Grid>

                                      <Grid item xs={12} sx={12} md={6}>
                                          <Typography variant="body2">Game Details</Typography>
                                      </Grid>
                                      <Grid item xs={12} sx={12} md={6}>
                                          <FormControl fullWidth>
                                              <TextField
                                                  variant="outlined"
                                                  placeholder="Game Details"
                                                  name="gameDetails"
                                                  inputProps={{ maxLength: 52 }}
                                                  multiline
                                                  maxRows={2}
                                                  value={values.gameDetails}
                                                  error={Boolean(
                                                      touched.gameDetails && errors.gameDetails
                                                  )}
                                                  onBlur={handleBlur}
                                                  onChange={handleChange}
                                                  disabled={
                                                      location?.state?.type === "VIEW" || isUpdating
                                                  }
                                              />
                                          </FormControl>
                                          <Box className="displaySpacebetween">
                                              <FormHelperText error className={classes.helperText}>
                                                  {touched.gameDetails && errors.gameDetails}
                                              </FormHelperText>
                                          </Box>
                                      </Grid>

                                      <Grid item xs={12} sx={12} md={6}>
                                          <Typography variant="body2">Category</Typography>
                                      </Grid>
                                      <Grid item xs={12} sx={12} md={6}>
                                          <FormControl fullWidth>
                                              <Autocomplete
                                                  fullWidth
                                                  disableClearable={true}
                                                  value={values.selectCategory}
                                                  onChange={(e, newValue) => {
                                                      setFieldValue(
                                                          "selectCategory",
                                                          newValue ? newValue : "Enter Game"
                                                      );
                                                  }}
                                                  options={
                                                      (categoryDataList &&
                                                          categoryDataList?.map(
                                                              (data, index) => data.categoryTitle
                                                          )) ||
                                                      []
                                                  }
                                                  disabled={
                                                      location?.state?.type === "VIEW" || isUpdating
                                                  }
                                                  renderInput={(params) => (
                                                      <TextField
                                                          {...params}
                                                          placeholder="Category"
                                                          variant="outlined"
                                                          fullWidth
                                                      />
                                                  )}
                                              />
                                          </FormControl>
                                          <FormHelperText error className={classes.helperText}>
                                              {touched.selectCategory && errors.selectCategory}
                                          </FormHelperText>
                                      </Grid>
                                      {location?.state?.type !== "VIEW" && (
                                          <>
                                              <Grid item xs={12} sx={12} md={6}>
                                                  <Typography variant="body2">
                                                      Additional Parameters
                                                  </Typography>
                                              </Grid>
                                              <Grid
                                                  item
                                                  xs={12}
                                                  sx={12}
                                                  md={6}
                                                  style={{ display: "flex", alignItems: "center" }}
                                              >
                                                  <FormControl fullWidth>
                                                      <TextField
                                                          variant="outlined"
                                                          placeholder="Enter parameter name"
                                                          value={newParamName}
                                                          onChange={(e) => setNewParamName(e.target.value)}
                                                          disabled={isUpdating}
                                                      />
                                                  </FormControl>
                                                  <IconButton
                                                      onClick={addNewParam}
                                                      disabled={isUpdating}
                                                  >
                                                      <IoAddSharp />
                                                  </IconButton>
                                              </Grid>
                                          </>
                                      )}
                                      {Object.keys(additionalParams).length > 0 ? (
                                          <>
                                              <Grid item xs={12} sx={12} md={6}>
                                                  <Typography variant="body2">
                                                      Additional Parameters
                                                  </Typography>
                                              </Grid>
                                              <div
                                                  style={{
                                                      display: "flex",
                                                      gap: "40px",
                                                      color: "black",
                                                      backgroundColor: "rgba(255, 255, 255, 0.47)",
                                                      borderRadius: "10px",
                                                      padding: "20px",
                                                  }}
                                              >
                                                  {Object.keys(additionalParams).map((param, index) => (
                                                      <Typography variant="body2">{param}</Typography>
                                                  ))}
                                              </div>
                                          </>
                                      ) : (
                                          <div></div>
                                      )}
                                  </Grid>
                              </Box>
                              <Box
                                  className="displayCenter"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                      if (location?.state?.type != "VIEW" && !isUpdating) {
                                          setChecked(!checked);
                                      }
                                  }}
                              >
                                  <Checkbox checked={checked} />
                                  <Typography variant="body1">Add to home page.</Typography>
                              </Box>

                              <Box className="displayCenter" pt={2} pb={4}>
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
                                          disabled={isUpdating}
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
  );
}

export default AddGame;
