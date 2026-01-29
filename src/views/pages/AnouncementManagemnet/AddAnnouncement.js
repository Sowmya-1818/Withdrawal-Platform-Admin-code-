import React, { useState, useEffect } from "react";
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
import { getAPIHandler, postAPIHandler, putAPIHandler } from "src/ApiConfig/service";
import { useNavigate, useLocation } from "react-router-dom";
import * as yup from "yup";
import { toast } from "react-hot-toast";
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

function BoosterSettings() {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions
  const [formData, setFormData] = useState({
    Notification: "",
  });

  const formValidationSchema = yup.object().shape({
    Notification: yup.string().required("Notification is required"),
  });

  const handleSubmit1 = async (values) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = {
        Notification: values.Notification,
      };

      console.log("Payload to be sent:", payload);

      let response;
      response = await postAPIHandler({
        endPoint: "SendNotification",
        dataToSend: payload,
      });

      console.log("Full response:", response);

      if (!response) {
        toast.error("No response received from the server.");
        return;
      }

      if (response?.data?.responseCode === 200) {
        toast.success(response.data.responseMessage);
        // navigate("/boostersettings");
      } else {
        toast.error(response?.data?.responseMessage || "Failed to save data.");
      }
    } catch (error) {
      console.error("Error submitting Booster Settings:", error);
      toast.error("Failed to save Booster Settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className={classes.main}>
      <Box mb={5}>
        <GoBack title="Announcement" />
      </Box>

      <Container maxWidth="md">
        <Formik
          enableReinitialize
          initialValues={formData} // Use formData here
          validationSchema={formValidationSchema}
          onSubmit={handleSubmit1}
        >

          {({ errors, touched, handleBlur, handleChange, values }) => (
            <Form>
              <Paper elevation={3}>
                <Box p={3}>
                  <Grid container spacing={2}>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Announcement</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Announcement"
                          name="Notification"
                          value={values.Notification}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.Notification && errors.Notification)}
                          disabled={location?.state?.type === "VIEW" || isSubmitting}
                          multiline
                          rows={12} // You can adjust the number of rows to fit your needs
                        />
                      </FormControl>
                      {touched.Notification && errors.Notification && (
                        <FormHelperText error>{errors.Notification}</FormHelperText>
                      )}
                    </Grid>



                  </Grid>

                  <Box mt={4}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Submit
                      {isSubmitting && <ButtonCircularProgress />}
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

export default BoosterSettings;
