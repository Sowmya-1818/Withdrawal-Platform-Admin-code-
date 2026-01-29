import { getAPIHandler, putAPIHandler } from "src/ApiConfig/service";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
  makeStyles,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import * as yup from "yup";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import GoBack from "src/component/GoBack";
import PageLoading from "src/component/PageLoading";
import { handleNegativeValue } from "src/utils";

const useStyles = makeStyles((theme) => ({
  main: {
    "& h3": {
      marginBottom: "30px",
    },
  },
}));

function AddTicket() {
  const classes = useStyles();
  const location = useLocation();
  const history = useNavigate();

  // State for Admin Settings
  const [settingsData, setSettingsData] = useState({});
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);

  // State for Ticket Management
  const [ticketData, setTicketData] = useState({});
  const [ticketListData, setTicketListData] = useState([]);
  const [isTicketListUpdating, setIsTicketListUpdating] = useState(false);
  const [isUpdatingTicket, setIsUpdatingTicket] = useState(false);

  // Initial form schema for Admin Settings
  const settingsInitialSchema = {
    signupTicketBalance: settingsData?.signupTicketBalance || "",
    referralTicketBalance: settingsData?.referralTicketBalance || "",
    Referral_Note: settingsData?.Referral_Note || "",
    Bot_Name: settingsData?.Bot_Name || "",
  };

  // Validation schema for Admin Settings
  const settingsValidationSchema = yup.object().shape({
    signupTicketBalance: yup.number().required("Signup Ticket Balance is required."),
    referralTicketBalance: yup.number().required("Referral Ticket Balance is required."),
    Referral_Note: yup.string().required("Referral Note is required."),
    Bot_Name: yup.string().required("Bot Name is required."),
  });

  // Initial form schema for Ticket Management
  const ticketInitialSchema = {
    amountInToken: ticketData?.amountInToken ? ticketData?.amountInToken : "",
    ticketQuantity: ticketData?.ticketQuantity ? ticketData?.ticketQuantity : "",

  };

  // Validation schema for Ticket Management
  const ticketValidationSchema = yup.object().shape({
    amountInToken: yup
      .string()
      .required("USDT amount is required.")
      .test("non-zero", "USDT amount must be greater than 0.", function (
        value
      ) {
        return parseFloat(value) > 0;
      }),
      ticketQuantity: yup
      .string()
      .required("Token amount is required.")
      .test("non-zero", "Token amount must be greater than 0.", function (
        value
      ) {
        return parseFloat(value) > 0;
      }),
  });

  // Fetch settings data from the API
  const fetchSettingsApi = async () => {
    try {
      setIsFetchingSettings(true);
      const response = await getAPIHandler({
        endPoint: "ReferralTicketManagement",
      });

      console.log(response, "response from fetchSettingsApi");
      
      if (response?.data?.responseCode === 200) {
        setSettingsData(response.data.result);
      } else {
        setSettingsData({});
        toast.error(
          response.data.responseMessage || "Failed to fetch tickets"
        );
      }
      setIsFetchingSettings(false);
    } catch (error) {
      setIsFetchingSettings(false);
    }
  };

  // Update settings data using the API
  const updateSettingsApi = async (values) => {
    try {
      setIsUpdatingSettings(true);
      const response = await putAPIHandler({
        endPoint: "ReferralTicketManagement",
        dataToSend: {
          signupTicketBalance: values.signupTicketBalance,
          referralTicketBalance: values.referralTicketBalance,
          Referral_Note: values.Referral_Note,
          Bot_Name: values.Bot_Name,
        },
      });

      console.log(response, "response from updateSettingsApi");
      
      if (response.data.responseCode === 200) {
        toast.success(
          response.data.responseMessage || "Tickets updated successfully."
        );
        fetchSettingsApi();
        history("/add-ticket");
      } else {
        toast.error(
          response.data.responseMessage || "Failed to update tickets"
        );
      }
      setIsUpdatingSettings(false);
    } catch (error) {
      setIsUpdatingSettings(false);
      toast.error("Error updating tickets.");
    }
  };

  const ticketManagementApi = async (source) => {
    try {
      const response = await getAPIHandler({
        endPoint: "getTickets",
        source: source,
      });
      console.log(response, "response from fetchSettingsApi1");
      if (response.data.responseCode === 200) {
        setTicketListData(response.data.result.docs[0]);
      } else {
        setTicketListData([]);
      }
      setIsTicketListUpdating(false);
    } catch (error) {
      setTicketListData([]);
      setIsTicketListUpdating(false);
    }
  };

  const viewTicketApi = async (source) => {
    try {
      setTicketData({});
      setIsUpdatingTicket(true);
      const response = await getAPIHandler({
        endPoint: "viewTicket",
        paramsData: {
          _id: ticketListData?._id,
        },
        source: source,
      });
      if (response?.data?.responseCode === 200) {
        setTicketData(response?.data?.result);
        setIsUpdatingTicket(false);
      }
      setIsUpdatingTicket(false);
    } catch (error) {
      setIsUpdatingTicket(false);
    }
  };

  const editTicketApi = async (values) => {
    try {
      setIsUpdatingTicket(true);
      const response = await putAPIHandler({
        endPoint: "updateTicket",
        dataToSend: {
          ticketId: ticketListData?._id,
          amountInToken: values.amountInToken,
          ticketQuantity: values.ticketQuantity
        },
      });
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        viewTicketApi();
        history("/add-ticket");
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdatingTicket(false);
    } catch (error) {
      setIsUpdatingTicket(false);
      toast.error(error.response.data.responseMessage);
    }
  };

  useEffect(() => {
    fetchSettingsApi();
    ticketManagementApi();
  }, []);

  useEffect(() => {
    if (ticketListData?._id) {
      viewTicketApi();
    }
  }, [ticketListData?._id]);

  return (
    <Box className={classes.main}>
      {isFetchingSettings || isTicketListUpdating || isUpdatingTicket ? (
        <PageLoading />
      ) : (
        <>
          <Box mb={5}>
            <GoBack title={`Ticket Management`} />
          </Box>
          <Container maxWidth="sm">
            <Formik
              enableReinitialize={true}
              initialValues={ticketInitialSchema}
              validationSchema={ticketValidationSchema}
              onSubmit={(values) => editTicketApi(values)}
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
                        <Grid item xs={12}>
                          <Box mb={1}>
                            <Typography variant="body2">
                              USDT Amount
                            </Typography>
                          </Box>
                          <FormControl fullWidth>
                            
                            <TextField
                              variant="outlined"
                              placeholder="USDT Amount"
                              name="amountInToken"
                              type="number"
                              value={values.amountInToken}
                              error={Boolean(
                                touched.amountInToken && errors.amountInToken
                              )}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              onKeyDown={(event) => handleNegativeValue(event)}
                              onKeyPress={(event) => {
                                if (
                                  event?.key === "-" ||
                                  event?.key === "+" ||
                                  event?.key === "*" ||
                                  event?.key === "/"
                                ) {
                                  event.preventDefault();
                                }
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton edge="end">
                                      <Box>
                                        <img
                                          src="/images/Tether.png"
                                          alt="solanaImg"
                                        />
                                      </Box>
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              disabled={location?.state?.type === "VIEW"}
                            />
                          </FormControl>
                          <FormHelperText error className={classes.helperText}>
                            {touched.amountInToken && errors.amountInToken}
                          </FormHelperText>
                          
                        </Grid>
                        <Grid item xs={12}>
                          <Box mb={1}>
                            <Typography variant="body2">
                            Ticket Amount
                            </Typography>
                          </Box>
                          <FormControl fullWidth>
                            
                            <TextField
                              variant="outlined"
                              placeholder="Ticket Quantity"
                              name="ticketQuantity"
                              type="number"
                              value={values.ticketQuantity}
                              error={Boolean(
                                touched.ticketQuantity && errors.ticketQuantity
                              )}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              onKeyDown={(event) => handleNegativeValue(event)}
                              onKeyPress={(event) => {
                                if (
                                  event?.key === "-" ||
                                  event?.key === "+" ||
                                  event?.key === "*" ||
                                  event?.key === "/"
                                ) {
                                  event.preventDefault();
                                }
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton edge="end">
                                      <Box>
                                        <img
                                          src="/images/ticket.png"
                                          alt="solanaImg"
                                        />
                                      </Box>
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              disabled={location?.state?.type === "VIEW"}
                            />
                          </FormControl>
                          <FormHelperText error className={classes.helperText}>
                            {touched.ticketQuantity && errors.ticketQuantity}
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
                            disabled={isUpdatingTicket}
                          >
                            Save
                            {isUpdatingTicket && <ButtonCircularProgress />}
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Form>
              )}
            </Formik>

            <Formik
              enableReinitialize={true}
              initialValues={settingsInitialSchema}
              validationSchema={settingsValidationSchema}
              onSubmit={(values) => updateSettingsApi(values)}
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
                  <Paper elevation={3} style={{ marginTop: "40px" }}>
                    <Box p={3}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box mb={1}>
                            <Typography variant="body2">
                              Signup Ticket Balance
                            </Typography>
                          </Box>
                          <FormControl fullWidth>
                            <TextField
                              variant="outlined"
                              placeholder="Signup Ticket Balance"
                              name="signupTicketBalance"
                              type="number"
                              defaultValue={values.signupTicketBalance || 0}
                              error={Boolean(
                                touched.signupTicketBalance &&
                                  errors.signupTicketBalance
                              )}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Typography>Tickets</Typography>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </FormControl>
                          {touched.signupTicketBalance &&
                            errors.signupTicketBalance && (
                              <Typography color="error" variant="caption">
                                {errors.signupTicketBalance}
                              </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                          <Box mb={1}>
                            <Typography variant="body2">
                              Referral Ticket Balance
                            </Typography>
                          </Box>
                          <FormControl fullWidth>
                            <TextField
                              variant="outlined"
                              placeholder="Referral Ticket Balance"
                              name="referralTicketBalance"
                              type="number"
                              defaultValue={values.referralTicketBalance || 0}
                              error={Boolean(
                                touched.referralTicketBalance &&
                                  errors.referralTicketBalance
                              )}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Typography>Tickets</Typography>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </FormControl>
                          {touched.referralTicketBalance &&
                            errors.referralTicketBalance && (
                              <Typography color="error" variant="caption">
                                {errors.referralTicketBalance}
                              </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" gutterBottom>
                            Referral Content
                          </Typography>
                          <FormControl fullWidth>
                            <TextField
                              variant="outlined"
                              name="Referral_Note"
                              type="text"
                              value={values.Referral_Note}
                              error={Boolean(touched.Referral_Note && errors.Referral_Note)}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                          </FormControl>
                          <FormHelperText error>
                            {touched.Referral_Note && errors.Referral_Note}
                          </FormHelperText>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="body2" gutterBottom>
                            Bot Name
                          </Typography>
                          <FormControl fullWidth>
                            <TextField
                              variant="outlined"
                              name="Bot_Name"
                              type="text"
                              value={values.Bot_Name}
                              error={Boolean(touched.Bot_Name && errors.Bot_Name)}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                          </FormControl>
                          <FormHelperText error>
                            {touched.Bot_Name && errors.Bot_Name}
                          </FormHelperText>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box className="displayCenter" py={4}>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isUpdatingSettings}
                      >
                        Save
                        {isUpdatingSettings && <ButtonCircularProgress />}
                      </Button>
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

export default AddTicket;
