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
  Select,
  MenuItem,
  InputLabel,
  makeStyles,
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
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
    "& .formControl": {
      minWidth: 120,
    },
  },
  formHeader: {
    marginBottom: theme.spacing(3),
  },
  // Custom styles for InputLabel
  inputLabel: {
    color: "#FFFFFF",
    "&.Mui-focused": {
      color: "#FFFFFF",
    },
  },
  // Custom styles for Select component
  select: {
    color: "#FFFFFF",
    "& .MuiSelect-icon": {
      color: "#FFFFFF",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FFFFFF",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FFFFFF",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FFFFFF",
    },
  },
  // Custom styles for the Select placeholder
  selectPlaceholder: {
    color: "#FFFFFF",
    opacity: 0.7,
  },
}));

const AddWithdrawalMethod = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine if the form is in 'ADD' or 'EDIT' mode
  const formType = location?.state?.type || "ADD";

  // Initial form values
  // const gameId = location?.state?.gameId; // This is the gameId passed in the state
  // console.log(gameId, "gameId");

  console.log(location.state, "location.state");
  
  
  const initialValues = {
    gameId: location?.state?.gameId || "",
  
    Symbol: location?.state?.Symbol || "",
    Token_Mint: location?.state?.Token_Mint || "",
    Min_Withdraw: location?.state?.Min_Withdraw || "",
    Max_Withdraw: location?.state?.Max_Withdraw || "",
    Fixed_Charge: location?.state?.Fixed_Charge || "",
    Percentage_Charge: location?.state?.Percentage_Charge || "",
    Fee_wallet: location?.state?.Fee_wallet || "",
  };

  console.log(initialValues, "initialValues");
  

  // Validation schema using Yup
  const validationSchema = yup.object().shape({

    Token_Mint: yup.string().required("Token address is required"),
    Symbol: yup.string().required("Symbol is required"),
    Min_Withdraw: yup.number().required("Minimum amount is required"),
    Max_Withdraw: yup.number().required("Maximum amount is required"),
    Fixed_Charge: yup.number().required("Fixed charge is required"),
    Percentage_Charge: yup.number().required("Percent charge is required"),
    Fee_wallet: yup.string().required("Fee wallet is required"),
    Withdraw_Note: yup.string().required("Withdrawal note is required"),
  });

  // API call to add a new withdrawal method
  const addWithdrawalMethodApi = async (values) => {
    try {
      setIsSubmitting(true);

      const payload = {
        withdraw_Id: values.gameId,
        walletMethod: values.walletMethod,
        Symbol: values.Symbol,
        Token_Mint: values.Token_Mint,
        Min_Withdraw: values.Min_Withdraw,
        Max_Withdraw: values.Max_Withdraw,
        Fixed_Charge: values.Fixed_Charge,
        Percentage_Charge: values.Percentage_Charge,
        Fee_wallet: values.Fee_wallet,
        Withdraw_Note: values.Withdraw_Note,
      };

      const response = await postAPIHandler({
        endPoint: "withdrawsettings",
        dataToSend: payload,
      });
      console.log(response, "response from withdrawal settings");

      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        navigate("/withdrawmethods"); // Navigate to the withdrawal methods list page
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error adding withdrawal method:", error);
      toast.error(
        error.response?.data?.responseMessage ||
          "Error adding withdrawal method."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // API call to edit an existing withdrawal method
  const editWithdrawalMethodApi = async (values) => {
    try {
      setIsSubmitting(true);

      const payload = {
       gameId: values.gameId,
        Symbol: values.Symbol,
        Token_Mint: values.Token_Mint,
        Min_Withdraw: values.Min_Withdraw,
        Max_Withdraw: values.Max_Withdraw,
        Fixed_Charge: values.Fixed_Charge,
        Percentage_Charge: values.Percentage_Charge,
        
      };
console.log(payload, "payload");  

      let response;

      if (values.id) {
        // Update if id exists
        response = await postAPIHandler({
          endPoint: "withdrawsettings",
          dataToSend: payload,
        });
      } else {
        // Create if no id
        response = await postAPIHandler({
          endPoint: "withdrawsettings",
          dataToSend: payload,
        });
      }
console.log(response, "response from withdrawalw settings");

      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        navigate("/withdrawmethods"); // Navigate to the withdrawal methods list page
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      console.error("Error editing withdrawal method:", error);
      toast.error(
        error.response?.data?.responseMessage ||
          "Error editing withdrawal method."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className={classes.main}>
      <Box mb={5}>
        <GoBack
          title={`${formType === "EDIT" ? "Edit" : "Add"} Withdrawal Method`}
        />
      </Box>

      <Container maxWidth="md">
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={
            formType === "EDIT"
              ? editWithdrawalMethodApi
              : addWithdrawalMethodApi
          }
        >
          {({
            errors,
            handleBlur,
            handleChange,
            touched,
            values,
            setFieldValue,
          }) => (
            <Form>
              <Paper elevation={3}>
                <Box p={3}>
                  <Grid container spacing={2}>
                    {/* Hidden Method ID Field for EDIT mode */}
                    {formType === "EDIT" && (
                      <Grid item xs={12}>
                        <Field type="hidden" name="methodId" />
                      </Grid>
                    )}

                     <Grid item xs={12} md={6}>
                      <Typography variant="body2">Token Address</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl
                        fullWidth
                        error={Boolean(touched.Token_Mint && errors.Token_Mint)}
                      >
                        <TextField
                          variant="outlined"
                          placeholder="Enter Token_Mint"
                          name="Token_Mint"
                          value={values.Token_Mint}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={formType === "VIEW" || isSubmitting}
                          InputProps={{
                            style: { color: "#FFFFFF" },
                          }}
                          InputLabelProps={{
                            classToken_Mint: classes.inputLabel,
                          }}
                        />
                        {touched.Token_Mint && errors.Token_Mint && (
                          <FormHelperText>{errors.Token_Mint}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    {/* Symbol Field */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Symbol</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl
                        fullWidth
                        error={Boolean(touched.Symbol && errors.Symbol)}
                      >
                        <TextField
                          variant="outlined"
                          placeholder="Enter Symbol"
                          name="Symbol"
                          value={values.Symbol}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={formType === "VIEW" || isSubmitting}
                          InputProps={{
                            style: { color: "#FFFFFF" },
                          }}
                          InputLabelProps={{
                            classSymbol: classes.inputLabel,
                          }}
                        />
                        {touched.Symbol && errors.Symbol && (
                          <FormHelperText>{errors.Symbol}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Minimum Amount Field */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Minimum Amount</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl
                        fullWidth
                        error={Boolean(
                          touched.Min_Withdraw && errors.Min_Withdraw
                        )}
                      >
                        <TextField
                          variant="outlined"
                          placeholder="Enter minimum amount"
                          name="Min_Withdraw"
                          type="number"
                          value={values.Min_Withdraw}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={formType === "VIEW" || isSubmitting}
                          InputProps={{
                            style: { color: "#FFFFFF" },
                          }}
                          InputLabelProps={{
                            className: classes.inputLabel,
                          }}
                        />
                        {touched.Min_Withdraw && errors.Min_Withdraw && (
                          <FormHelperText>
                            {errors.Min_Withdraw}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Maximum Amount Field */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Maximum Amount</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl
                        fullWidth
                        error={Boolean(
                          touched.Max_Withdraw && errors.Max_Withdraw
                        )}
                      >
                        <TextField
                          variant="outlined"
                          placeholder="Enter maximum amount"
                          name="Max_Withdraw"
                          type="number"
                          value={values.Max_Withdraw}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={formType === "VIEW" || isSubmitting}
                          InputProps={{
                            style: { color: "#FFFFFF" },
                          }}
                          InputLabelProps={{
                            className: classes.inputLabel,
                          }}
                        />
                        {touched.Max_Withdraw && errors.Max_Withdraw && (
                          <FormHelperText>
                            {errors.Max_Withdraw}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Fixed Charge Field */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Fixed Charge</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl
                        fullWidth
                        error={Boolean(
                          touched.Fixed_Charge && errors.Fixed_Charge
                        )}
                      >
                        <TextField
                          variant="outlined"
                          placeholder="Enter fixed charge"
                          name="Fixed_Charge"
                          type="number"
                          value={values.Fixed_Charge}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={formType === "VIEW" || isSubmitting}
                          InputProps={{
                            style: { color: "#FFFFFF" },
                          }}
                          InputLabelProps={{
                            className: classes.inputLabel,
                          }}
                        />
                        {touched.Fixed_Charge && errors.Fixed_Charge && (
                          <FormHelperText>{errors.Fixed_Charge}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Percent Charge Field */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">Percent Charge</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl
                        fullWidth
                        error={Boolean(
                          touched.Percentage_Charge && errors.Percentage_Charge
                        )}
                      >
                        <TextField
                          variant="outlined"
                          placeholder="Enter percent charge"
                          name="Percentage_Charge"
                          type="number"
                          value={values.Percentage_Charge}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={formType === "VIEW" || isSubmitting}
                          InputProps={{
                            style: { color: "#FFFFFF" },
                            endAdornment: (
                              <Typography
                                variant="body2"
                                style={{ color: "#FFFFFF", marginRight: 10 }}
                              >
                                %
                              </Typography>
                            ),
                          }}
                          InputLabelProps={{
                            className: classes.inputLabel,
                          }}
                        />
                        {touched.Percentage_Charge && errors.Percentage_Charge && (
                          <FormHelperText>
                            {errors.Percentage_Charge}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isSubmitting || formType === "VIEW"}
                        fullWidth
                      >
                        {formType === "ADD" ? "Add" : "Save"}
                        {isSubmitting && <ButtonCircularProgress />}
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
};

export default AddWithdrawalMethod;
