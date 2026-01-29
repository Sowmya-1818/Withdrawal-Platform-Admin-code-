import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Select,
  Typography,
  makeStyles,
  FormControl,
} from "@material-ui/core";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "src/context/Auth";
import AnalyticsGraph from "src/component/AnalyticsGraph";
import { getAPIHandler } from "src/ApiConfig/service";
import axios from "axios";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import GraphScore from "src/component/GraphScore";
import UserActivityTable from "../UserManagement/UserActivityTable";

const useStyle = makeStyles(() => ({
  mainDashBox: {
    "& .card": {
      padding: "50px 15px",
      borderRadius: "10px",
      textAlign: "center",
      boxShadow: "0px 0px 33px -20px rgba(0,0,0,0.75)",
    },
    "& .topPlayerBox": {
      backgroundImage: "url(images/playerbg.png)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      "& h3": {
        color: "rgba(255, 255, 255, 1)",
        fontWeight: "600",
        textAlign: "center",
        width: "auto",
        maxWidth: "600px",
      },
    },
    "& .mainStepBox": {
      height: "85%",
      padding: "20px",
      borderRadius: "20px",
      background: "rgba(255, 255, 255, 0.04)",
      "& h6": {
        fontWeight: 700,
        color: "#FFFFFF",
      },
      "& p": {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: "14px",
        margin: "10px 0px",
      },
      "& .buttonBox": {
        "& button": {
          background: "#19051C",
          boxShadow: "0px 0px 10px 0px #580665 inset",
          color: "rgba(255, 255, 255, 1)",
          fontWeight: 700,
        },
      },
    },

    "& .MuiOutlinedInput-root": {
      height: "40px",
      "& svg": {
        color: "#e1e1e1",
      },
    },
    "& .tabButton": {
      display: "flex",
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
export default function Analytics() {
  const classes = useStyle();
  const auth = useContext(AuthContext);

  const [categoryData, setCategoryData] = useState([]);
  const [gameList, setGameList] = useState([]);
  const [gameMonth, setGameMonth] = useState("YEAR");
  const [regisMonth, setRegisMonth] = useState("YEAR");
  const [fundMonth, setFundMonth] = useState("YEAR");
  const [gameName, setGameName] = useState("");
  const [leaderGameName, setLeaderGameName] = useState("1");
  const [gameHistory, setGameHistory] = useState([]);
  const [userHistory, setRegisterHistory] = useState([]);
  const [gameScoreTab, setGameScoreTab] = useState("graph");
  const [gameActivityTab, setGameActivityTab] = useState("graph");
  const [userScore, setUserScore] = useState([]);
  const [dashboardData, setDashboardData] = useState();
  const [fundActivity, setFundActivity] = useState("graph");

  const [isDepositeWithdrewUpdating, setIsDepositeWithdrewUpdating] = useState(
    true
  );
  const [
    isDepositeWithdrewUpdating1,
    setIsDepositeWithdrewUpdating1,
  ] = useState(true);
  const [
    isDepositeWithdrewUpdating2,
    setIsDepositeWithdrewUpdating2,
  ] = useState(true);
  const depositeWithdrewApi = async (source) => {
    try {
      setCategoryData([]);
      setIsDepositeWithdrewUpdating(true);
      const response = await getAPIHandler({
        endPoint: "graphDW",
        paramsData: {
          data: fundMonth,
        },
        source: source,
      });
      const gameList = await getAPIHandler({
        endPoint: "userGameList",
      });
      if (gameList.data.responseCode === 200) {
        setGameList(gameList.data.result.docs);
      }
      if (response.data.responseCode === 200) {
        setCategoryData(response.data.result);
        setIsDepositeWithdrewUpdating(false);
      }
      setIsDepositeWithdrewUpdating(false);
    } catch (error) {
      setIsDepositeWithdrewUpdating(false);
    }
  };
  const gameHistotyList = async (source) => {
    try {
      setIsDepositeWithdrewUpdating1(true);
      const response = await getAPIHandler({
        endPoint: "graphGameHistory",
        paramsData: {
          // data: filtersData?.status ? filtersData?.status : null,
          data: gameMonth,
          gameId: gameName ? gameName : undefined,
        },
        source: source,
      });

      if (response.data.responseCode === 200) {
        setGameHistory(response.data.result);
        setIsDepositeWithdrewUpdating1(false);
      }
      setIsDepositeWithdrewUpdating1(false);
    } catch (error) {
      setIsDepositeWithdrewUpdating1(false);
    }
  };
  const userRegistrationList = async (source) => {
    try {
      setIsDepositeWithdrewUpdating2(true);
      const response = await getAPIHandler({
        endPoint: "userRegistration",
        paramsData: {
          // data: filtersData?.status ? filtersData?.status : null,
          data: regisMonth ? regisMonth : undefined,
        },
        source: source,
      });

      if (response.data.responseCode === 200) {
        setRegisterHistory(response.data.result);
        setIsDepositeWithdrewUpdating2(false);
      }
      setIsDepositeWithdrewUpdating2(false);
    } catch (error) {
      setIsDepositeWithdrewUpdating2(false);
    }
  };

  const getUserActivity = async (endpoint) => {
    try {
      const responseScore = await getAPIHandler({
        endPoint: "graphGameScoreAll",
      });

      if (responseScore.data.responseCode === 200) {
        setUserScore(responseScore.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAnalyticsData = async () => {
    try {
      const responseScore = await getAPIHandler({
        endPoint: "dashboardV1",
      });
      if (responseScore.data.responseCode === 200) {
        setDashboardData(responseScore.data.result);
      } else {
        setDashboardData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const dashboadData = [
    {
      title: "Total Played",
      count: dashboardData?.totalUsers,
      borderTop: "2px solid #FFB02D",
      borderBottom: "2px solid #FFB02D",
    },
    {
      title: "Total Game",
      count: dashboardData?.totalGames,
      borderTop: "2px solid #DE14FF",
      borderBottom: "2px solid #DE14FF",
    },
    {
      title: "Total Deposit",
      count: `${parseFloat(dashboardData?.depositAmount).toFixed(3)} Sol`,
      borderTop: "2px solid #158743",
      borderBottom: "2px solid #158743",
    },
    {
      title: "Total Withdrawal",
      count: `${parseFloat(dashboardData?.withdrawAmount).toFixed(3)} Sol`,
      borderTop: "2px solid #2D73DD",
      borderBottom: "2px solid #2D73DD",
    },
  ];

  useEffect(() => {
    getUserActivity();
    getAnalyticsData();
  }, []);
  useEffect(() => {
    const source = axios.CancelToken.source();
    gameHistotyList(source);
  }, [gameName, gameMonth]);
  useEffect(() => {
    const source = axios.CancelToken.source();
    depositeWithdrewApi(source);
  }, [fundMonth]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    userRegistrationList(source);
  }, [regisMonth]);

  const fundActivityData = useMemo(() => {
    return (
      <>
        {categoryData && categoryData?.length > 0 && (
          <AnalyticsGraph
            categoryData={categoryData && categoryData}
            type="rejectFund"
          />
        )}
      </>
    );
  }, [categoryData]);

  useEffect(() => {
    if (gameList?.length > 0) {
      const gameId = gameList?.find((item) =>
        item?.gameTitle?.toUpperCase()?.includes("PACM")
      )?._id;
      setGameName(gameId);
    }
  }, [gameList]);

  return (
    <Box className={classes.mainDashBox}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box mt={2}>
            <Paper elevation={3}>
              <Grid container spacing={2}>
                {dashboadData &&
                  dashboadData?.map((el, i) => (
                    <Grid item key={i} xs={12} sm={6} md={3}>
                      <Box className="topPlayerBox">
                        <Box className="playerContentBox">
                          <Box
                            className="mainStepBox"
                            align="center"
                            style={{
                              borderTop: el && el?.borderTop,
                              borderBottom: el && el?.borderBottom,
                            }}
                          >
                            <Box mt={2}>
                              <Typography variant="h6">{el?.title}</Typography>
                              <Typography variant="body1">
                                {el?.count || "0"}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
              <Box mt={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box className="displaySpacebetween" style={{ gap: "8px" }}>
                      <Typography variant="h4" color="primary">
                        Fund Activity
                      </Typography>
                      <Box className="displayStart" style={{ gap: "8px" }}>
                        {fundActivity === "graph" && (
                          <Box>
                            <Select
                              value={fundMonth}
                              onChange={(e) => setFundMonth(e.target.value)}
                              variant="outlined"
                              MenuProps={{
                                anchorOrigin: {
                                  vertical: "bottom",
                                  horizontal: "left",
                                },
                                getContentAnchorEl: null,
                                ...menuProps,
                              }}
                              style={{ width: "160px" }}
                            >
                              <MenuItem>Select</MenuItem>
                              {["DAYS", "MONTH", "YEAR"].map((item) => (
                                <MenuItem value={item}>{item}</MenuItem>
                              ))}
                            </Select>
                          </Box>
                        )}

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
                    </Box>
                    {fundActivity === "graph" ? (
                      isDepositeWithdrewUpdating ? (
                        <ButtonCircularProgress />
                      ) : (
                        <Box mt={1.4}>{fundActivityData}</Box>
                      )
                    ) : (
                      <UserActivityTable
                        typeAnalytics="totalScore"
                        type="fundActivity"
                      />
                    )}
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box
                      className="displaySpacebetween"
                      style={{ flexWrap: "wrap" }}
                    >
                      <Typography variant="h5" color="primary">
                        Game Activity
                      </Typography>
                      <Box
                        className="displayStart"
                        style={{ flexWrap: "wrap", gap: "8px" }}
                      >
                        {gameActivityTab == "graph" && (
                          <Box style={{ display: "flex" }}>
                            <Select
                              value={gameMonth}
                              onChange={(e) => setGameMonth(e.target.value)}
                              variant="outlined"
                              MenuProps={{
                                anchorOrigin: {
                                  vertical: "bottom",
                                  horizontal: "left",
                                },
                                getContentAnchorEl: null,
                                ...menuProps,
                              }}
                              style={{ width: "160px" }}
                            >
                              <MenuItem>Select</MenuItem>
                              {["DAYS", "MONTH", "YEAR"].map((item) => (
                                <MenuItem value={item}>{item}</MenuItem>
                              ))}
                            </Select>
                            &nbsp;&nbsp;
                            <Select
                              value={gameName}
                              onChange={(e) => setGameName(e.target.value)}
                              variant="outlined"
                              MenuProps={{
                                anchorOrigin: {
                                  vertical: "bottom",
                                  horizontal: "left",
                                },
                                getContentAnchorEl: null,
                                ...menuProps,
                              }}
                              style={{ width: "160px" }}
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
                        )}

                        <Box className="tabButton">
                          <Button
                            variant="contained"
                            color={
                              gameScoreTab === "graph" ? "primary" : "secondary"
                            }
                            onClick={() => setGameActivityTab("graph")}
                          >
                            Graph
                          </Button>
                          &nbsp;&nbsp;
                          <Button
                            variant="contained"
                            color={
                              gameScoreTab === "table" ? "primary" : "secondary"
                            }
                            onClick={() => setGameActivityTab("table")}
                          >
                            Table
                          </Button>
                          {/* &nbsp;&nbsp;
                        <Button
                          variant="contained"
                          color={
                            gameScoreTab === "table" ? "primary" : "secondary"
                          }
                          onClick={() => setGameActivityTab("table")}
                        >
                          Table Lose
                        </Button> */}
                        </Box>
                      </Box>
                    </Box>
                    {gameActivityTab == "graph" ? (
                      <>
                        {isDepositeWithdrewUpdating1 ? (
                          <ButtonCircularProgress />
                        ) : (
                          <>
                            {gameHistory && gameHistory?.length > 0 && (
                              <AnalyticsGraph
                                type="history"
                                categoryData={gameHistory && gameHistory}
                              />
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <UserActivityTable
                        type="gameActivity"
                        typeAnalytics="totalScore"
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box className="displaySpacebetween">
                      <Typography variant="h5" color="primary">
                        User Registration Activity
                      </Typography>
                      <Box style={{ display: "flex" }} mt={1}>
                        <Select
                          value={regisMonth}
                          onChange={(e) => setRegisMonth(e.target.value)}
                          variant="outlined"
                          MenuProps={{
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "left",
                            },
                            getContentAnchorEl: null,
                            ...menuProps,
                          }}
                          style={{ width: "160px" }}
                        >
                          <MenuItem>Select</MenuItem>
                          {["DAYS", "MONTH", "YEAR"].map((item) => (
                            <MenuItem value={item}>{item}</MenuItem>
                          ))}
                        </Select>
                      </Box>
                    </Box>
                    {isDepositeWithdrewUpdating2 ? (
                      <ButtonCircularProgress />
                    ) : (
                      <>
                        {userHistory && userHistory?.length > 0 && (
                          <GraphScore
                            categoryData={userHistory}
                            type="userRegistation"
                          />
                        )}
                      </>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box className="displaySpacebetween">
                      <Typography variant="h5" color="primary">
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
                      userScore &&
                      userScore?.length > 0 && (
                        <GraphScore categoryData={userScore} />
                      )
                    ) : (
                      <UserActivityTable
                        type="gameScore"
                        typeAnalytics="totalScore"
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box className="displaySpacebetween" mt={1}>
                      <Box className="displayStart">
                        <Typography variant="h5" color="primary">
                          Leaderboard
                        </Typography>
                      </Box>
                      <Select
                        value={leaderGameName}
                        onChange={(e) => setLeaderGameName(e.target.value)}
                        variant="outlined"
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left",
                          },
                          getContentAnchorEl: null,
                          ...menuProps,
                        }}
                        style={{ width: "160px" }}
                      >
                        <MenuItem value="1">Select Game</MenuItem>
                        {gameList &&
                          gameList.map((item, i) => (
                            <MenuItem value={item?._id}>
                              {item?.gameTitle}
                            </MenuItem>
                          ))}
                      </Select>
                    </Box>

                    <UserActivityTable
                      type="leaderBoard"
                      typeAnalytics="totalScore"
                      gameId={
                        leaderGameName !== "1" ? leaderGameName : undefined
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
