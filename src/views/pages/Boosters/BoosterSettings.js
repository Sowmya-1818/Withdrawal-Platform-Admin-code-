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
    id: "", // Ensure id is part of the formData
    BoosterWalletAddress: "",
    Booster_Note1: "",
    Booster_Note2: "",
    Booster_Content: "",
    BoosterMintAddress: "",
    Status: "",
  });

  const formValidationSchema = yup.object().shape({
    BoosterWalletAddress: yup.string().required("Booster Wallet Address is required"),
    Booster_Note1: yup.string(),
    Booster_Note2: yup.string(),
    Booster_Content: yup.string(),
    BoosterMintAddress: yup.string(),
    Status: yup.string(),
  });

  const fetchBoosterSettings = async () => {
    try {
      const response = await getAPIHandler({ endPoint: "getBoostersetting" });
      console.log(response, "response from fetchBoosterSettings");
      if (response.data.responseCode === 200) {
        const boosterData = response.data.result[0]; // Assuming the first item is the one to edit
        if (boosterData) {
          setFormData({
            id: boosterData._id || "", // Ensure the correct field name (_id) is used
            BoosterWalletAddress: boosterData.BoosterWalletAddress || "",
            Booster_Note1: boosterData.Booster_Note1 || "",
            Booster_Note2: boosterData.Booster_Note2 || "",
            Booster_Content: boosterData.Booster_Content || "",
            BoosterMintAddress: boosterData.BoosterMintAddress || "",
            Status: boosterData.Status || "",
          });
        }
      } else {
        toast.error(response.data.responseMessage || "Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error fetching Booster Settings:", error);
      toast.error("Failed to load Booster Settings.");
    }
  };


  useEffect(() => {
    if (location?.state?.type !== "ADD") {
      fetchBoosterSettings();
    }
  }, [location]);

  const handleSubmit1 = async (values) => {
    if (isSubmitting) return; // Prevent submission if already submitting

    setIsSubmitting(true);
    try {
      const payload = {
        id: values.id, // Include id to ensure updates
        BoosterWalletAddress: values.BoosterWalletAddress,
        Booster_Note1: values.Booster_Note1,
        Booster_Note2: values.Booster_Note2,
        Booster_Content: values.Booster_Content,
        BoosterMintAddress: values.BoosterMintAddress,
        Status: values.Status,
      };

      let response;

      console.log(payload, "payload handleSubmit1");

      if (values.id) {
        // Update if id exists
        response = await postAPIHandler({
          endPoint: "createBoostersetting",
          dataToSend: payload,
        });
      } else {
        // Create if no id
        response = await postAPIHandler({
          endPoint: "createBoostersetting",
          dataToSend: payload,
        });
      }

      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        navigate("/boostersettings");
      } else {
        toast.error(response.data.responseMessage || "Failed to save data.");
      }
    } catch (error) {
      console.error("Error submitting Booster Settings:", error);
      toast.error("Failed to save Booster Settings.");
    } finally {
      setIsSubmitting(false); // Re-enable the button after submitting
    }
  };

  return (
    <Box className={classes.main}>
      <Box mb={5}>
        <GoBack title="Booster Settings" />
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
                      <Typography variant="body2">Booster Wallet Address</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Booster Wallet Address"
                          name="BoosterWalletAddress"
                          value={values.BoosterWalletAddress}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.BoosterWalletAddress && errors.BoosterWalletAddress)}
                          disabled={location?.state?.type === "VIEW" || isSubmitting}
                        />
                      </FormControl>
                      {touched.BoosterWalletAddress && errors.BoosterWalletAddress && (
                        <FormHelperText error>{errors.BoosterWalletAddress}</FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Booster Mint Address</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Booster Mint Address"
                          name="BoosterMintAddress"
                          value={values.BoosterMintAddress}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.BoosterMintAddress && errors.BoosterMintAddress)}
                          disabled={location?.state?.type === "VIEW" || isSubmitting}
                        />
                      </FormControl>
                      {touched.BoosterMintAddress && errors.BoosterMintAddress && (
                        <FormHelperText error>{errors.BoosterMintAddress}</FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Booster Content</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Booster Content"
                          name="Booster_Content"
                          value={values.Booster_Content}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.Booster_Content && errors.Booster_Content)}
                          disabled={location?.state?.type === "VIEW" || isSubmitting}
                        />
                      </FormControl>
                      {touched.Booster_Content && errors.Booster_Content && (
                        <FormHelperText error>{errors.Booster_Content}</FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Booster Note 1</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Booster Note 1"
                          name="Booster_Note1"
                          value={values.Booster_Note1}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.Booster_Note1 && errors.Booster_Note1)}
                          disabled={location?.state?.type === "VIEW" || isSubmitting}
                        />
                      </FormControl>
                      {touched.Booster_Note1 && errors.Booster_Note1 && (
                        <FormHelperText error>{errors.Booster_Note1}</FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Booster Note 2</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Booster Note 2"
                          name="Booster_Note2"
                          value={values.Booster_Note2}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.Booster_Note2 && errors.Booster_Note2)}
                          disabled={location?.state?.type === "VIEW" || isSubmitting}
                        />
                      </FormControl>
                      {touched.Booster_Note2 && errors.Booster_Note2 && (
                        <FormHelperText error>{errors.Booster_Note2}</FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Status</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          variant="outlined"
                          placeholder="Status"
                          name="Status"
                          value={values.Status}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.Status && errors.Status)}
                          disabled={location?.state?.type === "VIEW" || isSubmitting}
                        />
                      </FormControl>
                      {touched.Status && errors.Status && (
                        <FormHelperText error>{errors.Status}</FormHelperText>
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
