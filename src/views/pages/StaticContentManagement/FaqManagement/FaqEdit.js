import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  makeStyles,
  Typography,
  Paper,
  TextField,
  FormHelperText,
  Container,
  Grid,
} from "@material-ui/core";
import { useNavigate, useLocation } from "react-router-dom";
import JoditEditor from "jodit-react";
import PageLoading from "src/component/PageLoading";
import {
  getAPIHandler,
  postAPIHandler,
  putAPIHandler,
} from "src/ApiConfig/service";
import { toast } from "react-hot-toast";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import * as yep from "yup";
import { Form, Formik } from "formik";
import GoBack from "src/component/GoBack";
import { Autocomplete } from "@material-ui/lab";
import axios from "axios";
const useStyles = makeStyles((theme) => ({
  muiMainContainer: {},
}));
const FaqEdit = () => {
  const classes = useStyles();
  const history = useNavigate();
  const location = useLocation();
  const editor = useRef(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [gameData, setGameData] = useState([]);
  const [isCategoryUpdating, setIsCategoryUpdating] = useState(false);
  const config = {
    readonly: false,
  };
  const formValidationSchema = yep.object().shape({
    question: yep
      .string()
      .required("Question is required.")
      .min(3, "Should be 3 character long.")
      .max(320, "Should not exceed 320 characters."),
    faqType: yep.string().required("Screen Name is required."),
    answer: yep.string().trim().required("Answer is required."),
  });

  const initialSchema = {
    question: location?.state?.data?.question
      ? location?.state?.data?.question
      : "",
    faqType: location?.state?.data?.screenName
      ? location?.state?.data?.screenName
      : "",
    answer: location?.state?.data?.answer ? location?.state?.data?.answer : "",
  };
  const gameManagementApi = async (source) => {
    try {
      setGameData([]);
      setIsCategoryUpdating(true);
      const response = await getAPIHandler({
        endPoint: "listGameAll",
        source: source,
      });

      if (response.data.responseCode === 200) {
        setGameData([...response?.data?.result, { gameTitle: "GLOBAL" }]);
        setIsCategoryUpdating(false);
      }
      setIsCategoryUpdating(false);
    } catch (error) {
      setIsCategoryUpdating(false);
    }
  };
  const editFaqsApi = async (values) => {
    try {
      setIsUpdating(true);
      const response = await putAPIHandler({
        endPoint: "editFAQ",
        dataToSend: {
          _id: location?.state?.data?._id,
          question: values.question,
          screenName: values.faqType,
          answer: values?.answer,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/faq-management");
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      console.log(error);
      toast.error(error.response.data.responseMessage);
    }
  };

  const addFaqsApi = async (values) => {
    try {
      setIsUpdating(true);

      const response = await postAPIHandler({
        endPoint: "addFAQ",
        dataToSend: {
          question: values.question,
          screenName: values.faqType,
          answer: values?.answer,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/faq-management");
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      console.log(error);
      toast.error(error.response.data.responseMessage);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    gameManagementApi(source);
    return () => {
      source.cancel();
    };
  }, []);
  return (
    <Box className={classes.muiMainContainer}>
      {isUpdating ? (
        <PageLoading />
      ) : (
        <>
          <Box className="displaySpacebetween">
            <Box mb={5}>
              <GoBack title={`${location?.state?.type} FAQ`} />
            </Box>
          </Box>
          <Container maxWidth="md">
            <Formik
              initialValues={initialSchema}
              validationSchema={formValidationSchema}
              onSubmit={
                location?.state?.type === "EDIT"
                  ? (values) => editFaqsApi(values)
                  : (values) => addFaqsApi(values)
              }
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
                  <Paper elevation={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">Question</Typography>
                        </Box>
                        <TextField
                          variant="outlined"
                          name="question"
                          placeholder="Please enter the question."
                          inputProps={{ maxLength: 320 }}
                          fullWidth
                          value={values.question}
                          error={Boolean(touched.question && errors.question)}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        <FormHelperText error className={classes.helperText}>
                          {touched.question && errors.question}
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">Screen Name</Typography>
                        </Box>

                        <Autocomplete
                          fullWidth
                          disableClearable={true}
                          name="faqType"
                          value={values.faqType}
                          onChange={(event, value) => {
                            setFieldValue("faqType", value);
                          }}
                          options={
                            (gameData &&
                              gameData.map((data) => data.gameTitle)) ||
                            []
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Status"
                              variant="outlined"
                              fullWidth
                            />
                          )}
                        />
                        <FormHelperText error className={classes.helperText}>
                          {touched.faqType && errors.faqType}
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">Answer</Typography>
                        </Box>
                        <JoditEditor
                          ref={editor}
                          name="answer"
                          config={config}
                          value={values.answer}
                          tabIndex={1}
                          onBlur={(e) => setFieldValue("answer", e)}
                          variant="outlined"
                          fullWidth
                          size="small"
                        />
                        <FormHelperText error className={classes.helperText}>
                          {touched.answer && errors.answer}
                        </FormHelperText>
                      </Grid>
                    </Grid>
                    <Box className="displayCenter btnBox" mt={4}>
                      <Button variant="contained" color="primary" type="submit">
                        {location?.state?.type === "EDIT" ? "Save" : "Add"}
                        {isUpdating && <ButtonCircularProgress />}
                      </Button>
                      <Box ml={1}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => {
                            history(-1);
                          }}
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
        </>
      )}
    </Box>
  );
};
export default FaqEdit;
