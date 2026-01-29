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
  Checkbox,
} from "@material-ui/core";
import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as yep from "yup";
/* import { useNavigate } from "react-router-dom"; */
import { IoMdClose } from "react-icons/io";

const useStyle = makeStyles((theme) => ({
  cardDetailModalBox: {},
  displayBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "16px 0px 32px",
    "& .MuiCheckbox-root": {
      padding: "2px",
    },
    "& .MuiCheckbox-colorSecondary.Mui-checked": {
      color: "#EC1F24",
    },
  },
}));

export default function CardDetailModal({ cardModal, setcardModal }) {
  const classes = useStyle();
  /* const history = useNavigate(); */
  const [checked, setChecked] = useState(false);
  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
  };

  const formInitialSchema = {
    cardNo: "",
    validity: "",
    cvv: "",
  };

  const formValidationSchema = yep.object().shape({
    cardNo: yep.string().required("Please enter a valid card number."),
    validity: yep.string().required("Please enter a valid expiry date."),
    cvv: yep.string().required("Please enter valid cvv."),
  });
  return (
    <Box className={classes.cardDetailModalBox}>
      <Dialog
        open={cardModal}
        onClose={() => setcardModal(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent>
          <IconButton
            style={{ position: "absolute", top: "5px", right: "5px" }}
            onClick={() => setcardModal(false)}
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
                              placeholder="Card number."
                              name="cardNo"
                              value={values.cardNo}
                              error={Boolean(touched.cardNo && errors.cardNo)}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            <FormHelperText
                              error
                              className={classes.helperText}
                            >
                              {touched.cardNo && errors.cardNo}
                            </FormHelperText>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Expiry/Validity"
                              name="validity"
                              value={values.validity}
                              error={Boolean(
                                touched.validity && errors.validity
                              )}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            <FormHelperText
                              error
                              className={classes.helperText}
                            >
                              {touched.validity && errors.validity}
                            </FormHelperText>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="CVV"
                              name="cvv"
                              value={values.cvv}
                              error={Boolean(touched.cvv && errors.cvv)}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            <FormHelperText
                              error
                              className={classes.helperText}
                            >
                              {touched.cvv && errors.cvv}
                            </FormHelperText>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box className={classes.displayBox}>
                      <Checkbox
                        checked={checked}
                        onChange={handleCheckChange}
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                      <Typography variant="body1">
                        Save card as per latest guidelines
                      </Typography>
                    </Box>
                    <Box className="buttonBox" mb={4}>
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
