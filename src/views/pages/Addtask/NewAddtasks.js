// src\views\pages\Addtask\NewAddtasks.js

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
import { Form, Formik, Field } from "formik"; // Imported Field
import { useNavigate, useLocation } from "react-router-dom";
import * as yup from "yup"; // Corrected import from 'yep' to 'yup'
import { toast } from "react-hot-toast";
import { postAPIHandler, putAPIHandler } from "src/ApiConfig/service";
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
        backgroundSize: "cover !important",
        backgroundRepeat: "no-repeat !important",
        objectFit: "cover !important",
        borderRadius: "50%",
      },
      "& .editIcon": {
        height: "35px",
        width: "35px",
        borderRadius: "50%",
        color: "#fff",
        position: "absolute",
        right: "10px",
        bottom: "10px",
        background: "rgba(0, 0, 0, 0.4)",
        [theme.breakpoints.down("sm")]: {
          right: "10px",
        },
      },
    },
    "& .helperText": {
      color: theme.palette.error.main,
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

function NewAddtasks() {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate(); // Defined correctly
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize form schema based on received data, including taskId
  const formInitialSchema = {
    taskId: location?.state?.taskId || "", // Added taskId
    TaskName: location?.state?.taskName || "",
    TaskImage: location?.state?.taskImage || "",
    Subtask: location?.state?.subTask || "",
    Description: location?.state?.description || "",
    Rewardpoints: location?.state?.rewardPoints || "",
    Sitelink: location?.state?.siteLink || "",
    Siteimg: location?.state?.siteImage || "",
    Status: location?.state?.Status || "",
  };

  // Validation schema for form fields
  const formValidationSchema = yup.object().shape({
    TaskName: yup.string().required("Task Name is required."),
    // Add other validations as needed
    TaskImage: yup.string(),
    Subtask: yup.string(),
    Description: yup.string(),
    Rewardpoints: yup.number().min(0, "Reward Points cannot be negative."),
    Sitelink: yup
    .string()
    .url("Enter a valid URL.")
    .required("Site link is required."),
    Siteimg: yup.string().required("Site image is required."),
    Status: yup.string(),
  });

  // Add new task API
  const addTaskApi = async (values) => {
    try {
      setIsUpdating(true);

      // Construct the payload for the new task
      const payload = {
        TaskName: values.TaskName || "",
        TaskImage: values.TaskImage || "",
        Subtask: values.Subtask || "",
        Description: values.Description || "",
        Rewardpoints: values.Rewardpoints || 0,
        Sitelink: values.Sitelink || "",
        Siteimg: values.Siteimg || "",
      };

      // Send POST request to add task
      const response = await postAPIHandler({
        endPoint: "addTask",
        dataToSend: payload,
      });

      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        navigate("/addtask");
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error(error.response?.data?.responseMessage || "Error adding task");
    } finally {
      setIsUpdating(false);
    }
  };

  // Edit task API
  const editTaskApi = async (values) => {
    try {
      setIsUpdating(true);

      const payload = {
        _id: values.taskId, // Ensure taskId is included
        TaskName: values.TaskName || "",
        TaskImage: values.TaskImage || "",
        Subtask: values.Subtask || "",
        Description: values.Description || "",
        Rewardpoints: values.Rewardpoints || 0,
        Sitelink: values.Sitelink || "",
        Siteimg: values.Siteimg || "",
        Status: values.Status || "",
      };

      const token = window.sessionStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found.");
        setIsUpdating(false);
        return;
      }

      // Sending PUT request with the token and payload
      const response = await putAPIHandler({
        endPoint: "editTask", // Ensure this is the correct endpoint
        dataToSend: payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Edit Task Response:", response);
      if (response?.data?.responseCode === 200) {
        toast.success(response.data.responseMessage);
        navigate("/addtask");
      } else {
        toast.error(response?.data?.responseMessage || "Error saving task");
      }
    } catch (error) {
      console.error("Error editing task:", error);
      toast.error(
        error.response?.data?.responseMessage || "Error editing task"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box className={classes.main}>
      <Box mb={5}>
        <GoBack title={`${location?.state?.type} Task`} />
      </Box>

      <Container maxWidth="md">
        <Formik
          enableReinitialize={true} // Reinitialize the form with new data
          initialValues={formInitialSchema}
          validationSchema={formValidationSchema}
          onSubmit={
            location?.state?.type === "EDIT"
              ? (values) => editTaskApi(values) // Call the edit API
              : (values) => addTaskApi(values) // Call the add API
          }
        >
          {({ errors, handleBlur, handleChange, touched, values }) => (
            <Form>
              <Paper elevation={3}>
                <Box p={3}>
                  <Grid container spacing={2}>
                    {/* Hidden Task ID Field */}
                    {location?.state?.type === "EDIT" && (
                      <Grid item xs={12}>
                        <Field type="hidden" name="taskId" />
                      </Grid>
                    )}

                    {/* Task Name Field */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Task Name</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Task Name"
                          name="TaskName"
                          value={values.TaskName}
                          error={Boolean(touched.TaskName && errors.TaskName)}
                          inputProps={{ maxLength: 56 }}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={
                            location?.state?.type === "VIEW" || isUpdating
                          }
                        />
                      </FormControl>
                      {touched.TaskName && errors.TaskName && (
                        <FormHelperText error className={classes.helperText}>
                          {errors.TaskName}
                        </FormHelperText>
                      )}
                    </Grid>

                    {/* Task Image */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Task Image</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Task Image"
                          name="TaskImage"
                          value={values.TaskImage}
                          error={Boolean(touched.TaskImage && errors.TaskImage)}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={
                            location?.state?.type === "VIEW" || isUpdating
                          }
                        />
                      </FormControl>
                      {touched.TaskImage && errors.TaskImage && (
                        <FormHelperText error className={classes.helperText}>
                          {errors.TaskImage}
                        </FormHelperText>
                      )}
                    </Grid>

                    {/* Subtask */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Sub Task</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Subtask"
                          name="Subtask"
                          value={values.Subtask}
                          error={Boolean(touched.Subtask && errors.Subtask)}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={
                            location?.state?.type === "VIEW" || isUpdating
                          }
                        />
                      </FormControl>
                      {touched.Subtask && errors.Subtask && (
                        <FormHelperText error className={classes.helperText}>
                          {errors.Subtask}
                        </FormHelperText>
                      )}
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Description</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Description"
                          name="Description"
                          value={values.Description}
                          error={Boolean(
                            touched.Description && errors.Description
                          )}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={
                            location?.state?.type === "VIEW" || isUpdating
                          }
                        />
                      </FormControl>
                      {touched.Description && errors.Description && (
                        <FormHelperText error className={classes.helperText}>
                          {errors.Description}
                        </FormHelperText>
                      )}
                    </Grid>

                    {/* Reward Points */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Reward Points</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Reward Points"
                          name="Rewardpoints"
                          type="number" // Added type number for numerical input
                          value={values.Rewardpoints}
                          error={Boolean(
                            touched.Rewardpoints && errors.Rewardpoints
                          )}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={
                            location?.state?.type === "VIEW" || isUpdating
                          }
                        />
                      </FormControl>
                      {touched.Rewardpoints && errors.Rewardpoints && (
                        <FormHelperText error className={classes.helperText}>
                          {errors.Rewardpoints}
                        </FormHelperText>
                      )}
                    </Grid>

                    {/* Site Link */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Site Link</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        {/* <TextField
                          variant="outlined"
                          placeholder="Site Link"
                          name="Sitelink"
                          value={values.Sitelink}
                          error={Boolean(touched.Sitelink && errors.Sitelink)}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={
                            location?.state?.type === "VIEW" || isUpdating
                          }
                        /> */}
                        <TextField
                          variant="outlined"
                          placeholder="Site Link"
                          name="Sitelink"
                          value={values.Sitelink}
                          error={Boolean(touched.Sitelink && errors.Sitelink)}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="url"
                          disabled={location?.state?.type === "VIEW" || isUpdating}
                        />

                      </FormControl>
                      {touched.Sitelink && errors.Sitelink && (
                        <FormHelperText error className={classes.helperText}>
                          {errors.Sitelink}
                        </FormHelperText>
                      )}
                    </Grid>

                    {/* Site Image */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Site Image</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField 
                          variant="outlined"
                          placeholder="Site Image"
                          name="Siteimg"
                          value={values.Siteimg}
                          error={Boolean(touched.Siteimg && errors.Siteimg)}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={
                            location?.state?.type === "VIEW" || isUpdating
                          }
                        />
                      </FormControl>
                      {touched.Siteimg && errors.Siteimg && (
                        <FormHelperText error className={classes.helperText}>
                          {errors.Siteimg}
                        </FormHelperText>
                      )}
                    </Grid>

                    {/* Task Status */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Task Status</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Task Status"
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

                    {/* Submit Button */}
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isUpdating}
                        fullWidth
                      >
                        {location?.state?.type === "ADD" ? "Add" : "Save"}
                        {isUpdating && <ButtonCircularProgress />}
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

export default NewAddtasks;
