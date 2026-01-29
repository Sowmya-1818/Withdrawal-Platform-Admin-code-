
import React, { useState } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { postAPIHandler, putAPIHandler } from "src/ApiConfig/service";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import GoBack from "src/component/GoBack";

const useStyles = makeStyles((theme) => ({
  main: {
    "& h3": {
      marginBottom: "30px",
    },
    "& .helperText": {
      color: theme.palette.error.main,
    },
  },
}));

function NewBooster() {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  // Form initial values, populated when editing
  const formInitialSchema = {
    boosterId: location?.state?.boosterId || "",
    BoosterName: location?.state?.boosterName || "",
    BoosterImage: location?.state?.Image || "",
    Price: location?.state?.Price || "", // Correctly map Price
    Description: location?.state?.Description || "", // Correctly map Description
    TimerInMinutes: location?.state?.timerInMinutes || "",
    RewardMultiplier: location?.state?.Booster_Multiplier || 1, // Correctly map RewardMultiplier
    Status: location?.state?.Status || "",
  };

  // Validation schema
  const formValidationSchema = yup.object().shape({
    BoosterName: yup.string().required("Booster Name is required."),
    BoosterImage: yup.string().required("Booster Image URL is required."),
    Price: yup
      .number()
      .required("Price is required.")
      .min(0, "Price cannot be negative."),
    Description: yup.string().required("Description is required."),
    TimerInMinutes: yup
      .number()
      .required("Boost Duration is required.")
      .min(1, "Boost Duration must be at least 1 minute."),
    RewardMultiplier: yup
      .number()
      .required("Reward Multiplier is required.")
      .min(1, "Multiplier must be at least 1."),
    Status: yup.string().required("Booster Status is required."),
  });

  // Add Booster API// Add Booster API
  const addBoosterApi = async (values) => {
    try {
      setIsUpdating(true);
      const payload = {
        Name: values.BoosterName,
        Image: values.BoosterImage,
        Price: values.Price,
        Description: values.Description,
        Timer_InMinutes: values.TimerInMinutes,
        Booster_Multiplier: values.RewardMultiplier,
        Status: values.Status,
      };
      console.log(payload, "payload in add booster api");
      const response = await postAPIHandler({
        endPoint: "addBoosters",
        dataToSend: payload,
      });

      console.log(response, "response from add booster api");

      // Check for success using the correct response property
      if (response.data.responseCode === 200) {
        toast.success("Booster added successfully!");
        navigate("/addboosters");
      } else {
        toast.error(response.data.message || "Failed to add booster.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding booster.");
    } finally {
      setIsUpdating(false);
    }
  };


  // Edit Booster API
  const editBoosterApi = async (values) => {
    try {
      setIsUpdating(true);

      const payload = {
        Id: values.boosterId,
        Name: values.BoosterName,
        Image: values.BoosterImage,
        Price: values.Price,
        Description: values.Description,
        Timer_InMinutes: values.TimerInMinutes,
        Booster_Multiplier: values.RewardMultiplier,
        Status: values.Status,
      };

      const response = await putAPIHandler({
        endPoint: "editBoosters",
        dataToSend: payload,
      });
console.log(response, "response response")
      if (response.data.responseCode === 200) {
        toast.success("Booster updated successfully!");
        navigate("/addboosters");
      } else {
        toast.error(response.data.responseMessage|| "Failed to update booster.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error editing booster.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box className={classes.main}>
      <Box mb={5}>
        <GoBack title={location?.state?.type === "EDIT" ? "Edit Booster" : "Add Booster"} />
      </Box>

      <Container maxWidth="md">
        <Formik
          enableReinitialize
          initialValues={formInitialSchema}
          validationSchema={formValidationSchema}
          onSubmit={(values) => {
            if (location?.state?.type === "EDIT") {
              editBoosterApi(values);
            } else {
              addBoosterApi(values);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Paper elevation={3}>
                <Box p={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2">Booster Name</Typography>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Enter Booster Name"
                          name="BoosterName"
                          value={values.BoosterName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(touched.BoosterName && errors.BoosterName)}
                        />
                        {touched.BoosterName && errors.BoosterName && (
                          <FormHelperText error>{errors.BoosterName}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">Booster Image</Typography>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Enter Booster Image URL"
                          name="BoosterImage"
                          value={values.BoosterImage}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(touched.BoosterImage && errors.BoosterImage)}
                        />
                        {touched.BoosterImage && errors.BoosterImage && (
                          <FormHelperText error>{errors.BoosterImage}</FormHelperText>
                        )}
                      </FormControl>


                      
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">Price</Typography>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          type="number"
                          placeholder="Enter Price"
                          name="Price"
                          value={values.Price}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(touched.Price && errors.Price)}
                        />
                        {touched.Price && errors.Price && (
                          <FormHelperText error>{errors.Price}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">Description</Typography>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Enter Description"
                          name="Description"
                          value={values.Description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(touched.Description && errors.Description)}
                        />
                        {touched.Description && errors.Description && (
                          <FormHelperText error>{errors.Description}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">Boost Duration (minutes)</Typography>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          type="number"
                          placeholder="Enter Boost Duration"
                          name="TimerInMinutes"
                          value={values.TimerInMinutes}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(touched.TimerInMinutes && errors.TimerInMinutes)}
                        />
                        {touched.TimerInMinutes && errors.TimerInMinutes && (
                          <FormHelperText error>{errors.TimerInMinutes}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">Reward Multiplier</Typography>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          type="number"
                          placeholder="Enter Reward Multiplier"
                          name="RewardMultiplier"
                          value={values.RewardMultiplier}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(touched.RewardMultiplier && errors.RewardMultiplier)}
                        />
                        {touched.RewardMultiplier && errors.RewardMultiplier && (
                          <FormHelperText error>{errors.RewardMultiplier}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">Booster Status</Typography>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Enter Booster Status"
                          name="Status"
                          value={values.Status}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(touched.Status && errors.Status)}
                        />
                        {touched.Status && errors.Status && (
                          <FormHelperText error>{errors.Status}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isUpdating}
                      >
                        {isUpdating ? <ButtonCircularProgress /> : (location?.state?.type === "EDIT" ? "Save Booster" : "Add Booster")}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Form>
          )}
        </Formik>
      </Container>
    </Box>
  );
}

export default NewBooster;

