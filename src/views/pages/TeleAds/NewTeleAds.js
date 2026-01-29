import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import * as yep from "yup";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import GoBack from "src/component/GoBack";
import { postAPIHandler, putAPIHandler } from "src/ApiConfig/service";

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

function NewTeleAds() {
  const classes = useStyles();
  const location = useLocation();
  const history = useNavigate();

  // Retrieve Ad data and type (ADD or EDIT)
  const adData = location?.state?.adData || {};
  const type = location?.state?.type || "ADD";

  const [isUpdating, setIsUpdating] = useState(false);

  const formInitialSchema = {
    AdImage: adData.AdImage || "",
    AdName: adData.AdName || "",
    AdSDK: adData.AdSDK || "",
    AdCount: adData.AdCount || "",
    AdTimer_InMinutes: adData.AdTimer_InMinutes || "",
    Rewardpoints: adData.Rewardpoints || "",
    Status: adData.Status || "",
  };

  const formValidationSchema = yep.object().shape({
    AdImage: yep.string().url("Enter a valid URL for Ad Image.").required("Ad Image is required."),
    AdName: yep.string().required("Ad Name is required."),
    AdSDK: yep.string().required("Ad Function is required."),
    AdCount: yep.string().required("Ad Count is required."),
    AdTimer_InMinutes: yep.number()
    .typeError("Ad Timer must be a number.")
    .required("Ad Timer are required.")
    .min(0, "Ad Timer cannot be negative."),
    Rewardpoints: yep
      .number()
      .typeError("Reward Points must be a number.")
      .required("Reward Points are required.")
      .min(0, "Reward Points cannot be negative."),
      Status: yep.string(),
  });

  const addAdApi = async (values) => {
    try {
      console.log(values, "values from add ad api");
      
      setIsUpdating(true);
      const response = await postAPIHandler({
        endPoint: "addAds",
        dataToSend: values,
      });
    
       console.log(response, "response from add ad api");
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        history(-1); // Navigate back after success
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.responseMessage || "An unexpected error occurred."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const editAdApi = async (values) => {
    try {
      console.log(values, "values from add ad api");
      setIsUpdating(true);
      const response = await putAPIHandler({
        endPoint: "editAds",
        dataToSend: { ...values, _id: adData._id },
      });
      
      console.log(response, "response from add ad api");
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        history(-1); // Navigate back after success
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.responseMessage || "An unexpected error occurred."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box className={classes.main}>
      <Box mb={5}>
        <GoBack title={`${type} Telegram Ads`} />
      </Box>
      <Container maxWidth="md">
        <Formik
          enableReinitialize
          initialValues={formInitialSchema}
          validationSchema={formValidationSchema}
          onSubmit={(values) => (type === "EDIT" ? editAdApi(values) : addAdApi(values))}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            touched,
            values,
          }) => (
            <Form>
              <Paper elevation={3}>
                <Box p={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Ad Name</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Ad Name"
                          value={values.AdName}
                          name="AdName"
                          error={Boolean(touched.AdName && errors.AdName)}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </FormControl>
                      <FormHelperText error>
                      </FormHelperText>
                        {touched.AdName && errors.AdName}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Ad SDK</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Ad SDK"
                          value={values.AdSDK}
                          name="AdSDK"
                          error={Boolean(touched.AdSDK && errors.AdSDK)}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </FormControl>
                      <FormHelperText error>
                      </FormHelperText>
                        {touched.AdSDK && errors.AdSDK}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Ad Count</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Ad Count"
                          name="AdCount"
                          value={values.AdCount}
                          error={Boolean(touched.AdCount && errors.AdCount)}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </FormControl>
                      <FormHelperText error>
                        {touched.AdCount && errors.AdCount}
                      </FormHelperText>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Timer IN MIN</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Timer IN MIN"
                          name="AdTimer_InMinutes"
                          value={values.AdTimer_InMinutes}
                          error={Boolean(touched.AdTimer_InMinutes && errors.AdTimer_InMinutes)}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </FormControl>
                      <FormHelperText error>
                        {touched.AdTimer_InMinutes && errors.AdTimer_InMinutes}
                      </FormHelperText>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Ad Image URL</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Ad Image URL"
                          name="AdImage"
                          value={values.AdImage}
                          error={Boolean(touched.AdImage && errors.AdImage)}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </FormControl>
                      <FormHelperText error>
                        {touched.AdImage && errors.AdImage}
                      </FormHelperText>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Reward Points</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Reward Points"
                          name="Rewardpoints"
                          value={values.Rewardpoints}
                          error={Boolean(touched.Rewardpoints && errors.Rewardpoints)}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </FormControl>
                      <FormHelperText error>
                        {touched.Rewardpoints && errors.Rewardpoints}
                      </FormHelperText>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Ad Status</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth> 
                        <TextField
                          variant="outlined"
                          placeholder="Ad Status"
                          name="Status"
                          
                          value={values.Status}
                          error={Boolean(
                            touched.Status && errors.Status
                          )}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={
                            location?.state?.type === "VIEW" || isUpdating
                          }
                        />
                      </FormControl>
                      {touched.Status && errors.Status && (
                        <FormHelperText error className={classes.helperText}>
                          {errors.Status}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Box>
                <Box className="displayCenter" pt={2} pb={4}>
                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isUpdating}
                    >
                      {type === "ADD" ? "Add" : "Save"}
                      {isUpdating && <ButtonCircularProgress />}
                    </Button>
                  </Box>
                  <Box ml={2}>
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

export default NewTeleAds;
