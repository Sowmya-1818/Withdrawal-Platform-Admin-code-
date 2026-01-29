import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  makeStyles,
  Button,
  Divider,
  Grid,
  FormHelperText,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as yep from "yup";
/* import { useNavigate } from "react-router-dom"; */
import { IoMdClose } from "react-icons/io";

const useStyle = makeStyles((theme) => ({
  upiDetailModalBox: {},
}));

export default function UpiDetailModal({ upiModal, setupiModal }) {
  const classes = useStyle();
  /* const history = useNavigate(); */

  const formInitialSchema = {
    Amount: "",
    upiId: "",
    utrId: "",
  };

  const formValidationSchema = yep.object().shape({
    Amount: yep.string().required("Please enter a Amount."),
    upiId: yep.string().required("Please enter a valid UPI ID."),
    utrId: yep.string().required("Please enter valid UTR ID."),
  });
  return (
    <Box className={classes.upiDetailModalBox}>
      <Dialog
        open={upiModal}
        onClose={() => setupiModal(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent>
          <IconButton
            style={{ position: "absolute", top: "5px", right: "5px" }}
            onClick={() => setupiModal(false)}
          >
            <IoMdClose />
          </IconButton>
          <Box align="center">
            <Box my={2}>
              <Typography variant="h6">Card Details</Typography>
            </Box>
            <Divider style={{ height: "2px", marginBottom: "20px" }} />
            <Box className="cardDetailsFiels">
              <Formik
                initialValues={formInitialSchema}
                initialStatus={{
                  success: false,
                  successMsg: "",
                }}
                validationSchema={formValidationSchema}
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
                    <Box>
                      <Grid container>
                        <Grid item xs={12} sm={12}>
                          <Box mb={2}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Amount"
                              name="Amount"
                              value={values.Amount}
                              error={Boolean(touched.Amount && errors.Amount)}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            <FormHelperText
                              error
                              className={classes.helperText}
                            >
                              {touched.Amount && errors.Amount}
                            </FormHelperText>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <Box mb={2}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter UPI ID"
                              name="upiId"
                              value={values.upiId}
                              error={Boolean(touched.upiId && errors.upiId)}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            <FormHelperText
                              error
                              className={classes.helperText}
                            >
                              {touched.upiId && errors.upiId}
                            </FormHelperText>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <Box mb={2}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Enter UTR ID"
                              name="utrId"
                              value={values.utrId}
                              error={Boolean(touched.utrId && errors.utrId)}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            <FormHelperText
                              error
                              className={classes.helperText}
                            >
                              {touched.utrId && errors.utrId}
                            </FormHelperText>
                          </Box>
                        </Grid>
                      </Grid>
                      <Box align="start">
                        <Typography variant="body1">
                          Platform Fee:
                          <span style={{ color: "#000" }}> DT 10</span>
                        </Typography>
                        <Typography variant="body1">
                          Minimum Deposit Amount Fee:
                          <span style={{ color: "#000" }}> DT 100</span>
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="buttonBox" mt={3} mb={4}>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        style={{ paddingLeft: "55px", paddingRight: "55px" }}
                      >
                        pay DT 1000
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
