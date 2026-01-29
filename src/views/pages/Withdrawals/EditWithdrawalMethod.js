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
  inputLabel: {
    color: "#FFFFFF",
    "&.Mui-focused": {
      color: "#FFFFFF",
    },
  },
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
  verticalField: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(2),
  },
}));


const validationSchema = yup.object({
  Token_Mint: yup.string().required("Token address is required"),
  Symbol: yup.string().required("Symbol is required"),
  Min_Withdraw: yup.number().required("Minimum amount is required"),
  Max_Withdraw: yup.number().required("Maximum amount is required"),
  Fixed_Charge: yup.number().required("Fixed charge is required"),
  Percentage_Charge: yup.number().required("Percent charge is required"),
  Fee_wallet: yup.string().required("Fee wallet is required"),
  Withdraw_Note: yup.string().required("Withdrawal note is required"),
});



// const initialValues = {
//   methodId: "",
//   Token_Mint: "",
//   Symbol: "",
//   Min_Withdraw: "",
//   Max_Withdraw: "",
//   Fixed_Charge: "",
//   Percentage_Charge: "",
//   Fee_wallet: "",
//   Withdraw_Note: "",
// };


// console.log(initialValues, "initialValues");

const EditWithdrawalMethod = ({ formType }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);




  const initialValues = {
    gameId: location?.state?.gameId || "",
  
    Symbol: location?.state?.Symbol || "",
    Token_Mint: location?.state?.Token_Mint || "",
    Min_Withdraw: location?.state?.Min_Withdraw || "",
    Max_Withdraw: location?.state?.Max_Withdraw || "",
    Fixed_Charge: location?.state?.Fixed_Charge || "",
    Percentage_Charge: location?.state?.Percentage_Charge || "",
    Fee_wallet: location?.state?.Fee_wallet || "",
    Withdraw_Note: location?.state?.Withdraw_Note || "",
  };
  
  console.log(initialValues, "initialValues");

  const addWithdrawalMethodApi = async (values) => {
    try {
      setIsSubmitting(true);

      const payload = {
        id: values.gameId,
        // walletMethod: values.walletMethod,
        Symbol: values.Symbol,
        Token_Mint: values.Token_Mint,
        Min_Withdraw: values.Min_Withdraw,
        Max_Withdraw: values.Max_Withdraw,
        Fixed_Charge: values.Fixed_Charge,
        Percentage_Charge: values.Percentage_Charge,
        Fee_wallet: values.Fee_wallet,
        Withdraw_Note: values.Withdraw_Note,
      };

      let response;


      console.log(payload, "payload");
      


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

      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        navigate("/withdrawmethods"); // Navigate to the withdrawal methods list page
      } else {
        toast.error(response.data.responseMessage || "Unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error adding withdrawal method:", error);
      toast.error(error?.response?.data?.responseMessage || "Error adding withdrawal method.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // const editWithdrawalMethodApi = async (values) => {

  //   console.log(values, "values");
    
  //   try {
  //     setIsSubmitting(true);

    
      

  //     const payload = {
  //       methodId: values.methodId,
  //       walletMethod: values.walletMethod,
  //       Symbol: values.Symbol,
  //       Token_Mint: values.Token_Mint,
  //       Min_Withdraw: values.Min_Withdraw,
  //       Max_Withdraw: values.Max_Withdraw,
  //       Fixed_Charge: values.Fixed_Charge,
  //       Percentage_Charge: values.Percentage_Charge,
  //       Fee_wallet: values.Fee_wallet,
  //       Withdraw_Note: values.Withdraw_Note,
  //     };

  //     console.log(payload, "payload");

  //     const token = window.sessionStorage.getItem("token");
  //     if (!token) {
  //       toast.error("No authentication token found.");
  //       setIsSubmitting(false);
  //       return;
  //     }

  //     const response = await putAPIHandler({
  //       endPoint: "withdrawsettings",
  //       dataToSend: payload,
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response && response.data) {
  //       if (response.data.responseCode === 200) {
  //         toast.success(response.data.responseMessage);
  //         navigate("/withdrawal-methods"); // Navigate to the withdrawal methods list page
  //       } else {
  //         toast.error(response.data.responseMessage || "Unexpected error occurred.");
  //       }
  //     } else {
  //       console.error("Unexpected API response format:", response);
  //       toast.error("Failed to edit withdrawal method. Please try again later.");
  //     }
  //   } catch (error) {
  //     console.error("Error editing withdrawal method:", error);
  //     toast.error(error?.response?.data?.responseMessage || "Error editing withdrawal method.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

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
            
               addWithdrawalMethodApi
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
                  <Grid container spacing={3}>
                    {formType === "EDIT" && (
                      <Grid item xs={12}>
                        <Field type="hidden" name="methodId" />
                      </Grid>
                    )}

                    {/* Token Address Field */}
                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        error={Boolean(touched.Token_Mint && errors.Token_Mint)}
                      >
                        <Typography variant="body2" gutterBottom>
                          Token Address
                        </Typography>
                        <TextField
                          variant="outlined"
                          placeholder="Enter token address"
                          name="Token_Mint"
                          value={values.Token_Mint}
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
                        {touched.Token_Mint && errors.Token_Mint && (
                          <FormHelperText>{errors.Token_Mint}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Token Symbol Field */}
                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        error={Boolean(touched.Symbol && errors.Symbol)}
                      >
                        <Typography variant="body2" gutterBottom>
                          Token Symbol
                        </Typography>
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
                            className: classes.inputLabel,
                          }}
                        />
                        {touched.Symbol && errors.Symbol && (
                          <FormHelperText>{errors.Symbol}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Amount Limits Section */}
                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={3}
                        style={{
                          backgroundColor: "rgb(35 20 34)",
                          borderRadius: "8px",
                          padding: "16px",
                        }}
                      >
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            Amount Limits
                          </Typography>
                          <FormControl
                            fullWidth
                            error={Boolean(touched.Min_Withdraw && errors.Min_Withdraw)}
                            className={classes.verticalField}
                          >
                            <Typography variant="body2">
                              Minimum Amount
                            </Typography>
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
                                style: { color: "#000" },
                              }}
                            />
                            {touched.Min_Withdraw && errors.Min_Withdraw && (
                              <FormHelperText>{errors.Min_Withdraw}</FormHelperText>
                            )}
                          </FormControl>

                          <FormControl
                            fullWidth
                            error={Boolean(touched.Max_Withdraw && errors.Max_Withdraw)}
                            className={classes.verticalField}
                          >
                            <Typography variant="body2">
                              Maximum Amount
                            </Typography>
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
                                style: { color: "#000" },
                              }}
                            />
                            {touched.Max_Withdraw && errors.Max_Withdraw && (
                              <FormHelperText>{errors.Max_Withdraw}</FormHelperText>
                            )}
                          </FormControl>
                        </Box>
                      </Paper>
                    </Grid>

                    {/* Charges Section */}
                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={3}
                        style={{
                          backgroundColor: "rgb(35 20 34)",
                          borderRadius: "8px",
                          padding: "16px",
                        }}
                      >
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            Charges
                          </Typography>

                          <FormControl
                            fullWidth
                            error={Boolean(touched.Fixed_Charge && errors.Fixed_Charge)}
                          >
                            <Typography variant="body2">Fixed Charge</Typography>
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
                                style: { color: "#000" },
                              }}
                            />
                            {touched.Fixed_Charge && errors.Fixed_Charge && (
                              <FormHelperText>{errors.Fixed_Charge}</FormHelperText>
                            )}
                          </FormControl>

                          <FormControl
                            fullWidth
                            error={Boolean(
                              touched.Percentage_Charge && errors.Percentage_Charge
                            )}
                          >
                            <Typography variant="body2">Percentage Charge</Typography>
                            <TextField
                              variant="outlined"
                              placeholder="Enter percentage charge"
                              name="Percentage_Charge"
                              type="number"
                              value={values.Percentage_Charge}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              disabled={formType === "VIEW" || isSubmitting}
                              InputProps={{
                                style: { color: "#000" },
                              }}
                            />
                            {touched.Percentage_Charge && errors.Percentage_Charge && (
                              <FormHelperText>{errors.Percentage_Charge}</FormHelperText>
                            )}
                          </FormControl>
                        </Box>
                      </Paper>
                    </Grid>

                    {/* Fee Wallet */}
                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        error={Boolean(touched.Fee_wallet && errors.Fee_wallet)}
                      >
                        <Typography variant="body2">Fee Wallet</Typography>
                        <TextField
                          variant="outlined"
                          placeholder="Enter fee wallet"
                          name="Fee_wallet"
                          value={values.Fee_wallet}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={formType === "VIEW" || isSubmitting}
                          InputProps={{
                            style: { color: "#FFFFFF" },
                          }}
                        />
                        {touched.Fee_wallet && errors.Fee_wallet && (
                          <FormHelperText>{errors.Fee_wallet}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Withdrawal Note */}
                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        error={Boolean(touched.Withdraw_Note && errors.Withdraw_Note)}
                      >
                        <Typography variant="body2">Withdrawal Note</Typography>
                        <TextField
                          variant="outlined"
                          placeholder="Enter withdrawal note"
                          name="Withdraw_Note"
                          value={values.Withdraw_Note}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={formType === "VIEW" || isSubmitting}
                          InputProps={{
                            style: { color: "#FFFFFF" },
                          }}
                        />
                        {touched.Withdraw_Note && errors.Withdraw_Note && (
                          <FormHelperText>{errors.Withdraw_Note}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Box mt={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                      fullWidth
                    >
                      {isSubmitting ? (
                        <ButtonCircularProgress />
                      ) : (
                        formType === "EDIT" ? "Update Withdrawal Method" : "Add Withdrawal Method"
                      )}
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
};

export default EditWithdrawalMethod;
