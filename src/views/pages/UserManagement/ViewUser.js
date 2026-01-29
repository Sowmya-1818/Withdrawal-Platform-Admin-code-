import { getAPIHandler, putAPIHandler } from "src/ApiConfig/service";
import {
  Avatar,
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
  MenuItem,
  Select,
  Checkbox,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GoBack from "src/component/GoBack";
import { validateAccountAddress } from "src/utils";
import * as yep from "yup";
import { toast } from "react-hot-toast";
import { Form, Formik } from "formik";
import PageLoading from "src/component/PageLoading";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import axios from "axios";
import ActivityTable from "./UserActivityTable";
import UserActivityTable from "./UserActivityTable";
import UserReferredTable from "./UserReferredTable";
import AnalyticsGraph from "src/component/AnalyticsGraph";
import GraphScore from "src/component/GraphScore";
import NoDataFound from "src/component/NoDataFound";

const useStyles = makeStyles((theme) => ({
  main: {
    height: "100%",
    "& .detailsBG": {
      maxWidth: "900px",
      width: "100%",
      height: "auto",
      padding: "30px",
      borderRadius: "15px",
      background: "#fff",
      flexDirection: "column",
      boxShadow: "0px 0px 33px -20px rgba(0,0,0,0.75)",
    },
    "& .dropDownBoxProfile": {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      position: "relative",

      "& img": {
        height: "150px",
        width: "100%",
        maxWidth: "150px",
        height: "150px",
        backgroundSize: "cover !important",
        backgroundRepeat: "no-repeat !important",
        objectFit: "cover !important",
        borderRadius: "50%",
      },

      "& .editIcon": {
        height: "35px",
        width: "35px",
        borderRadius: "50%",
        color: "#000",
        position: "absolute",
        left: "478px",
        bottom: "10px",
        color: "#fff",
        background: "rgba(0, 0, 0, 0.87)",
        [theme.breakpoints.down("sm")]: {
          left: "382px",
        },
      },
    },
    "& .MuiTableCell-head": {
      background: "none",
    },

    "& .activtab": {
      background: "#28192A",
      borderRadius: "10px",
      padding: "11px 23px",
      border: "1px solid #656565",
      cursor: "pointer",
      margin: "5px",
      whiteSpace: "pre",
      color: "#fff",
    },
    "& .butontab": {
      background: "#28192A",
      borderRadius: "10px",
      padding: "11px 23px",
      border: "1px solid transparent",
      cursor: "pointer",
      margin: "5px",
      whiteSpace: "pre",
    },
    "& .selectClx": {
      "& .MuiOutlinedInput-root": {
        height: "40px",
        "& svg": {
          color: "#e1e1e1",
        },
      },
    },
    "& .tabButton": {
      "& button": {
        padding: "5px 19px",
        height: "32px",
      },
    },
  },
}));
const menuProps = {
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
  elevation: 0,
  PaperProps: {
    style: {
      top: "0px !important",
      maxHeight: 250,
    },
  },
};

function ViewUser() {
  const classes = useStyles();
  const location = useLocation();
  const history = useNavigate();
  const [userData, setUserData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [userActivityData, setUserActivityData] = useState([]);
  const [userScore, setUserScore] = useState([]);
  const [activityTab, setActivityTab] = useState("userActivity");
  const [gameMonth, setGameMonth] = useState("YEAR");
  const [gameHistory, setGameHistory] = useState([]);
  const [gameList, setGameList] = useState([]);
  const [gameName, setGameName] = useState("");
  const [googleChecked, setGoogleChecked] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [gameScoreTab, setGameScoreTab] = useState("graph");
  const [fundActivity, setFundActivity] = useState("graph");
  const [gameActivity, setGameActivity] = useState("graph");

  const formInitialSchema = {
    firstName: userData?.firstName ? userData?.firstName : "",
    lastName: userData?.lastName ? userData?.lastName : "",
    email: userData?.email ? userData?.email : "",
    walletAddress: userData?.wallet ? userData?.wallet : "",
    referralCode: userData?.referralCode ? userData?.referralCode : "",
    userName: userData?.userName ? userData?.userName : "",
    referrerId:
      userData && userData?.referrerId && userData?.referrerId?._id
        ? userData?.referrerId?._id
        : "",
  };

  const formValidationSchema = yep.object().shape({
    firstName: yep
      .string()
      .min(3, "Please enter atleast 3 characters.")
      .max(256, "You can enter only 256 characters.")
      .matches(
        /^[a-zA-Z]+(([',. -][a-zA-Z])?[a-zA-Z]*)*$/g,
        "Please enter your first name."
      ),
    lastName: yep
      .string()
      .min(3, "Please enter atleast 3 characters.")
      .max(256, "You can enter only 256 characters.")
      .matches(
        /^[a-zA-Z]+(([',. -][a-zA-Z])?[a-zA-Z]*)*$/g,
        "Please enter your last name."
      ),
    email: yep
      .string()
      .trim()
      .email("Please enter valid email.")
      .max(256, "Should not exceeds 256 characters.")
      .matches("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"),
    referralCode: yep
      .string()
      .trim()
      .min(6, "Please enter atleast 6 characters."),
    referrerId: yep
      .string()
      .trim()
      .min(6, "Please enter atleast 6 characters."),

    walletAddress: yep
      .string()
      .trim()
      .test(
        "validate-address",
        "Please enter a valid Solana wallet address.",
        async function (value) {
          if (value) {
            return await validateAccountAddress(value);
          } else {
            return true;
          }
        }
      ),
  });
  const editUserApi = async (values) => {
    try {
      setIsUpdating(true);

      const response = await putAPIHandler({
        endPoint: "editUserProfile",
        dataToSend: {
          userId: location?.state.userId,
          wallet: values.walletAddress ? values.walletAddress : "",
          firstName: values.firstName ? values.firstName : undefined,
          lastName: values.lastName ? values.lastName : undefined,
          google2FA: googleChecked,
          email2FA: emailChecked,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        history("/user-management");
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

  const getUserDataApi = async (endpoint) => {
    try {
      setIsUpdating(true);
      const response = await getAPIHandler({
        endPoint: "viewUser",
        paramsData: {
          userId: location?.state.userId,
        },
      });
      if (response.data.responseCode === 200) {
        setUserData(response.data.result);
        setIsUpdating(false);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };
  const getUserActivity = async (endpoint) => {
    try {
      const param = {
        userId: location?.state.userId,
      };
      const response = await getAPIHandler({
        endPoint: "graphForUser",
        paramsData: param,
      });
      const responseScore = await getAPIHandler({
        endPoint: "graphGameScoreAll",
        paramsData: param,
      });
      const gameList = await getAPIHandler({
        endPoint: "userGameList",
      });
      if (gameList.data.responseCode === 200) {
        setGameList(gameList.data.result.docs);
      }
      if (response.data.responseCode === 200) {
        setUserActivityData(response.data.result);
      }
      if (responseScore.data.responseCode === 200) {
        setUserScore(responseScore.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const gameHistotyList = async (source) => {
    try {
      const response = await getAPIHandler({
        endPoint: "graphUserGameHistory",
        paramsData: {
          userId: location?.state.userId,

          data: gameMonth,
          gameId: gameName ? gameName : undefined,
        },
        source: source,
      });

      if (response.data.responseCode === 200) {
        setGameHistory(response.data.result);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (location?.state.userId) {
      getUserDataApi();
      getUserActivity();
    }
  }, [location?.state.userId]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (gameName && gameMonth && location?.state.userId) {
      gameHistotyList(source);
    }
  }, [gameName, gameMonth, location?.state.userId]);

  useEffect(() => {
    if (gameList?.length > 0) {
      setGameName(
        gameList?.find((item) =>
          item?.gameTitle?.toUpperCase()?.includes("PACM")
        )?._id
      );
    }
  }, [gameList]);

  useEffect(() => {
    if (userData?.google2FA) {
      setGoogleChecked(userData?.google2FA);
    }
    if (userData?.email2FA) {
      setEmailChecked(userData?.email2FA);
    }
  }, [userData]);

  return (
    <Box className={classes.main}>
      {isUpdating ? (
        <PageLoading />
      ) : (
        <>
          <Box mb={5}>
            <GoBack title="User Detail" />
          </Box>
          <Container maxWidth="md">
            <Formik
              initialValues={formInitialSchema}
              validationSchema={formValidationSchema}
              onSubmit={(values) => editUserApi(values)}
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
                    <Box className="displayColumn" mb={4}>
                      <Box className="dropDownBoxProfile" mt={3}>
                        <Box>
                          <Avatar
                            src={
                              userData?.profilePic
                                ? userData?.profilePic
                                : "/images/profile_img.png"
                            }
                            style={{
                              height: "150px",
                              width: "150px",
                            }}
                          />
                        </Box>
                      </Box>
                      <Box mt={1}>
                        <Typography variant="body2">User Image</Typography>
                      </Box>
                    </Box>
                    <Box mb={1} className="displayEnd">
                      <Box
                        onClick={() => setGoogleChecked(false)}
                        style={{ cursor: "pointer" }}
                        className="displayStart"
                      >
                        <Checkbox checked={googleChecked} />
                        <Typography variant="body1">Google 2FA</Typography>
                      </Box>
                      &nbsp;&nbsp;
                      <Box
                        onClick={() => setEmailChecked(false)}
                        style={{ cursor: "pointer" }}
                        className="displayStart"
                      >
                        <Checkbox checked={emailChecked} />
                        <Typography variant="body1">Email 2FA</Typography>
                      </Box>
                    </Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">First Name</Typography>
                        </Box>
                        <FormControl fullWidth>
                          <TextField
                            variant="outlined"
                            type="text"
                            placeholder="Please enter first name."
                            name="firstName"
                            value={values.firstName}
                            error={Boolean(
                              touched.firstName && errors.firstName
                            )}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={location?.state?.type === "VIEW"}
                          />
                        </FormControl>
                        <FormHelperText error className={classes.helperText}>
                          {touched.firstName && errors.firstName}
                        </FormHelperText>
                      </Grid>

                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">Last Name</Typography>
                        </Box>
                        <FormControl fullWidth>
                          <TextField
                            fullWidth
                            type="text"
                            variant="outlined"
                            placeholder="Please enter last name."
                            name="lastName"
                            value={values.lastName}
                            error={Boolean(touched.lastName && errors.lastName)}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={location?.state?.type === "VIEW"}
                          />
                        </FormControl>
                        <FormHelperText error className={classes.helperText}>
                          {touched.lastName && errors.lastName}
                        </FormHelperText>
                      </Grid>

                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">Username</Typography>
                        </Box>
                        <FormControl fullWidth>
                          <TextField
                            variant="outlined"
                            type="text"
                            placeholder="Username"
                            name="userName"
                            value={values.userName}
                            disabled
                          />
                        </FormControl>
                        <FormHelperText error className={classes.helperText}>
                          {touched.userName && errors.userName}
                        </FormHelperText>
                      </Grid>

                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">Email</Typography>
                        </Box>
                        <FormControl fullWidth>
                          <TextField
                            type="email"
                            variant="outlined"
                            placeholder="Please enter email address."
                            name="email"
                            value={values.email}
                            error={Boolean(touched.email && errors.email)}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled
                          />
                        </FormControl>
                        <FormHelperText error className={classes.helperText}>
                          {touched.email && errors.email}
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">Referral Code</Typography>
                        </Box>
                        <FormControl fullWidth>
                          <TextField
                            variant="outlined"
                            type="number"
                            placeholder="Please enter referral code."
                            name="referralCode"
                            value={values.referralCode}
                            disabled
                          />
                        </FormControl>
                        <FormHelperText error className={classes.helperText}>
                          {touched.referralCode && errors.referralCode}
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">Referred Id</Typography>
                        </Box>
                        <FormControl fullWidth>
                          <TextField
                            variant="outlined"
                            type="text"
                            placeholder="Please enter referrer id."
                            name="referrerId"
                            value={values.referrerId}
                            disabled
                          />
                        </FormControl>
                        <FormHelperText error className={classes.helperText}>
                          {touched.referrerId && errors.referrerId}
                        </FormHelperText>
                      </Grid>

                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="body2">Address</Typography>
                        </Box>
                        <FormControl fullWidth>
                          <TextField
                            fullWidth
                            type="text"
                            variant="outlined"
                            placeholder="Please enter wallet address."
                            name="walletAddress"
                            value={values.walletAddress}
                            error={Boolean(
                              touched.walletAddress && errors.walletAddress
                            )}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={location?.state?.type === "VIEW"}
                          />
                        </FormControl>
                        <FormHelperText error className={classes.helperText}>
                          {touched.walletAddress && errors.walletAddress}
                        </FormHelperText>
                      </Grid>

                      <Grid
                        container
                        xs={12}
                        alignItems="center"
                        justifyContent="center"
                        style={{ marginTop: "10px" }}
                      >
                        <Grid item xs={3} align="center">
                          <Box className="displayCenter" py={4}>
                            {location?.state?.type !== "VIEW" && (
                              <Box>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  type="submit"
                                  disabled={isUpdating}
                                >
                                  Save
                                  {isUpdating && <ButtonCircularProgress />}
                                </Button>
                              </Box>
                            )}

                            <Box style={{ marginLeft: "16px" }}>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => history(-1)}
                              >
                                Back
                              </Button>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Form>
              )}
            </Formik>
            <Box className={classes.displayBox} mt={3}>
              <Box className="ButtonBox">
                <Button
                  className={
                    activityTab === "userActivity" ? "activtab" : "butontab"
                  }
                  onClick={() => setActivityTab("userActivity")}
                >
                  <Typography variant="body2">User Activity</Typography>
                </Button>
                <Button
                  className={
                    activityTab === "userReferredDetails"
                      ? "activtab"
                      : "butontab"
                  }
                  onClick={() => setActivityTab("userReferredDetails")}
                >
                  <Typography variant="body2">User Referred Details</Typography>
                </Button>
                <Button
                  className={
                    activityTab === "Anayltics" ? "activtab" : "butontab"
                  }
                  onClick={() => {
                    setActivityTab("Anayltics");
                  }}
                >
                  <Typography variant="body2">Anayltics</Typography>
                </Button>
              </Box>
            </Box>
            <Box mt={2}>
              {activityTab === "userActivity" && (
                <UserActivityTable data={userData} type="userActivity" />
              )}
              {activityTab === "userReferredDetails" && (
                <UserReferredTable data={userData} />
              )}
              {activityTab === "Anayltics" && (
                <Grid container spacing={2}>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box className="displaySpacebetween">
                      <Typography variant="h4" color="primary">
                        Fund Activity
                      </Typography>
                      <Box className="tabButton">
                        <Button
                          variant="contained"
                          color={
                            fundActivity === "graph" ? "primary" : "secondary"
                          }
                          onClick={() => setFundActivity("graph")}
                        >
                          Graph
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          variant="contained"
                          color={
                            fundActivity === "table" ? "primary" : "secondary"
                          }
                          onClick={() => setFundActivity("table")}
                        >
                          Table
                        </Button>
                      </Box>
                    </Box>

                    {fundActivity === "graph" ? (
                      <>
                        {userActivityData?.length > 0 ? (
                          <AnalyticsGraph
                            categoryData={userActivityData}
                            type="rejectFund"
                          />
                        ) : (
                          <NoDataFound data="No Fund Activity!" />
                        )}
                      </>
                    ) : (
                      <UserActivityTable data={userData} type="fundActivity" />
                    )}
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box className="displaySpacebetween" mt={1}>
                      <Typography variant="h4" color="primary">
                        Game Score
                      </Typography>
                      <Box className="tabButton">
                        <Button
                          variant="contained"
                          color={
                            gameScoreTab === "graph" ? "primary" : "secondary"
                          }
                          onClick={() => setGameScoreTab("graph")}
                        >
                          Graph
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          variant="contained"
                          color={
                            gameScoreTab === "table" ? "primary" : "secondary"
                          }
                          onClick={() => setGameScoreTab("table")}
                        >
                          Table
                        </Button>
                      </Box>
                    </Box>
                    {gameScoreTab === "graph" ? (
                      <GraphScore categoryData={userScore} />
                    ) : (
                      <UserActivityTable data={userData} type="gameScore" />
                    )}
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box className="displaySpacebetween" mt={1}>
                      <Typography variant="h4" color="primary">
                        Game Activity
                      </Typography>
                      <Box className="tabButton">
                        <Button
                          variant="contained"
                          color={
                            gameActivity === "graph" ? "primary" : "secondary"
                          }
                          onClick={() => setGameActivity("graph")}
                        >
                          Graph
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          variant="contained"
                          color={
                            gameActivity === "table" ? "primary" : "secondary"
                          }
                          onClick={() => setGameActivity("table")}
                        >
                          Table
                        </Button>
                      </Box>
                    </Box>
                    {gameActivity === "graph" ? (
                      <>
                        <Box
                          style={{ display: "flex" }}
                          className="selectClx"
                          mt={1}
                        >
                          <Select
                            value={gameMonth}
                            onChange={(e) => setGameMonth(e.target.value)}
                            variant="outlined"
                            fullWidth
                            MenuProps={{
                              anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "left",
                              },
                              getContentAnchorEl: null,
                              ...menuProps,
                            }}
                          >
                            <MenuItem>Select</MenuItem>
                            {["DAYS", "MONTH", "YEAR"].map((item) => (
                              <MenuItem value={item}>{item}</MenuItem>
                            ))}
                          </Select>
                          &nbsp;
                          <Select
                            value={gameName}
                            onChange={(e) => setGameName(e.target.value)}
                            variant="outlined"
                            fullWidth
                            MenuProps={{
                              anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "left",
                              },
                              getContentAnchorEl: null,
                              ...menuProps,
                            }}
                          >
                            <MenuItem>Select Game</MenuItem>
                            {gameList &&
                              gameList.map((item, i) => (
                                <MenuItem value={item?._id}>
                                  {item?.gameTitle}
                                </MenuItem>
                              ))}
                          </Select>
                        </Box>
                        {gameHistory && gameHistory?.length > 0 && (
                          <AnalyticsGraph
                            categoryData={gameHistory}
                            type="history"
                            title="Game Earn"
                          />
                        )}
                      </>
                    ) : (
                      <UserActivityTable data={userData} type="gameActivity" />
                    )}
                  </Grid>
                </Grid>
              )}
            </Box>
          </Container>
        </>
      )}
    </Box>
  );
}

export default ViewUser;
