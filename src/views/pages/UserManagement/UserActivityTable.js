import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
  Avatar,
  FormControl,
  Paper,
  Grid,
  Typography,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Tooltip,
} from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination } from "@material-ui/lab";
import axios from "axios";
import { getAPIHandler } from "src/ApiConfig/service";
import moment from "moment";
import NoDataFound from "src/component/NoDataFound";
import ListLoder from "src/component/ListLoder";
import { useLocation, useNavigate } from "react-router-dom";
import CopyWalletAddress from "src/component/CopyWalletAddress";
import CopyToClipboard from "react-copy-to-clipboard";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { FaArrowDown } from "react-icons/fa6";

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

const useStyles = makeStyles((theme) => ({
  main: {
    "& th": {
      background: "#DE14FF !important",
      // textAlign: "center",
      color: "white",
      border: "1px solid white",
    },
    "& .MuiTableContainer-root": {
      marginTop: "30px",
    },
    "& .MuiTableCell-body": {
      // textAlign: "center",
      borderBottom: "1px solid #DE14FF",
    },
    "& .MuiPaginationItem-textPrimary.Mui-selected": {
      borderRadius: "50px",
      border: "1px solid #DE14FF",
      background: "#DE14FF",
    },
    "& .MuiPagination-root": {
      width: "fit-content",
      padding: "20px 0",
    },
    "& .MuiPaginationItem-rounded": {
      border: "1px solid ",
      borderRadius: "50px",
    },
    "& .filterTitle": {
      color: "#898989",
    },
    "& .MuiOutlinedInput-input": {
      padding: "13px 14px !important",
    },
  },
  dialog: {
    "& .MuiDialogTitle-root": {
      borderBottom: "1px solid",
      padding: "20px 100px",
      textAlign: "center",
    },
    "& .MuiDialogActions-root": {
      justifyContent: "center",
      gap: "20px",
    },
    "& .MuiDialogContent-root": {
      padding: "30px 24px",
    },
  },
}));

function UserActivityTable({ data, type, typeAnalytics, gameId }) {
  const classes = useStyles();
  const location = useLocation();
  const history = useNavigate();

  const [userData, setUserData] = useState([]);
  const [isUserUpdating, setIsUserUpdating] = useState(true);
  const [page, setPage] = useState(1);
  const [toDate, setToDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [isClear, setIsClear] = useState(false);
  const [sortLevel, setSortLevel] = useState(false);
  const [amountSorting, setAmountSorting] = useState(false);
  const [isApply, setIsApply] = useState(false);
  const [search, setSearch] = useState("");
  const [gameMonth, setGameMonth] = useState("All");
  const [gameFund, setGameFund] = useState("All");

  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });
  const handleClear = () => {
    setToDate(null);
    setFromDate(null);
    setSearch("");
    setGameMonth("All");
    setGameFund("All");
    setIsClear(true);
  };

  useEffect(() => {
    if (isClear) {
      userManagementApi();
    }
  }, [isClear]);
  const userManagementApi = async (source) => {
    try {
      const checkKey =
        type === "fundActivity"
          ? {
            notEqual: "PENDING",
            ...(gameFund === "Rejected"
              ? { status: "REJECT" }
              : {
                transactionType:
                  gameFund !== "All"
                    ? gameFund == "Deposit"
                      ? "BUY"
                      : "WITHDRAW"
                    : undefined,
              }),
          }
          : type === "leaderBoard"
            ? { gameId: gameId ? gameId : undefined }
            : type === "gameActivity"
              ? { playedStatus: gameMonth !== "All" ? gameMonth : undefined }
              : {};
      const response = await getAPIHandler({
        endPoint:
          type === "fundActivity"
            ? "transactionHistory"
            : type === "userActivity"
              ? "getUserActivity"
              : type === "leaderBoard"
                ? "getLeaderBoard"
                : "getUserGameHistory",

        paramsData: {
          userId:
            typeAnalytics && typeAnalytics == "totalScore"
              ? undefined
              : location?.state?.userId,
          page: page,
          limit: 10,
          fromDate: fromDate
            ? moment(fromDate).format("YYYY-MM-DDT00:00").toString()
            : undefined,
          toDate: toDate
            ? moment(toDate).format("YYYY-MM-DDT11:59").toString()
            : undefined,
          ...checkKey,
          search: search !== "" ? search : undefined,
        },
        source: source,
      });
      if (response.data.responseCode === 200) {
        setUserData(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setUserData([]);
      }

      setIsClear(false);

      setIsUserUpdating(false);
    } catch (error) {
      setUserData([]);
      setIsUserUpdating(false);

      setIsClear(false);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    if ((location?.state?.userId && page) || typeAnalytics == "totalScore") {
      userManagementApi(source);
    }
    return () => {
      source.cancel();
    };
  }, [page, location?.state?.userId, typeAnalytics, gameId]);

  // const checkSortedArray = useMemo(() => {
  //   return type == "fundActivity"
  //     ? userData
  //     : sortLevel
  //     ? userData.slice().sort((a, b) => a.level - b.level)
  //     : userData.slice().sort((a, b) => b.level - a.level);
  // }, [sortLevel, userData, type]);

  const checkHeading =
    type === "fundActivity"
      ? [
        "Sr.No",
        "Amount",
        "Ticket",
        "Wallet Address",
        "Type",
        "Status",
        "Reason",
        "Date & Time",
      ]
      : type === "gameActivity"
        ? [
          "Sr.No",
          "Amount",
          "Type",
          "Level",
          typeAnalytics == "totalScore" ? "Email" : "",
          "Game name",
          "Date & Time",
        ]
        : type === "gameScore"
          ? [
            "Sr.No",
            "Score",
            "Level",
            typeAnalytics == "totalScore" ? "Email" : "",
            "Game name",
            "Date & Time",
          ]
          : type === "leaderBoard"
            ? [
              "Sr.No",
              "Player",
              "Email",
              "Bet Amount",
              "Level",
              "Game Name",
              "High Score",
              "Profit",
              "Date & Time",
            ]
            : ["Sr.No", "Email", "Type", "Old Details", "New Details", "Date & Time"];

  return (
    <Box className={classes.main} mt={2} mb={3}>
      {/* <Paper elevation={3}> */}
      <Grid container spacing={2} alignItems="center">
        {typeAnalytics == "totalScore" && (
          <Grid item xs={12} sm={6} md={2} lg={2}>
            <Box>
              <Typography className="filterTitle">Search</Typography>
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Search..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                className="textfields"
              />
            </Box>
          </Grid>
        )}
        <Grid item lg={2} md={2} sm={6} xs={12}>
          <Typography className="filterTitle">From</Typography>
          <FormControl fullWidth>
            <KeyboardDatePicker
              inputVariant="outlined"
              id="date-picker-dialog"
              format="MM/DD/YYYY"
              placeholder="DD/MM/YYYY"
              className="keyboardPicker"
              disableFuture
              InputProps={{ readOnly: true }}
              keyboardButtonProps={{
                "aria-label": "change date",
              }}
              fullWidth
              value={fromDate || null}
              onChange={(date) => {
                setFromDate(new Date(date || null));
              }}
            />
          </FormControl>
        </Grid>
        <Grid item lg={2} md={2} sm={6} xs={12}>
          <Typography className="filterTitle">To</Typography>
          <FormControl fullWidth>
            <KeyboardDatePicker
              inputVariant="outlined"
              id="date-picker-dialog"
              format="MM/DD/YYYY"
              placeholder="DD/MM/YYYY"
              className="keyboardPicker"
              InputProps={{ readOnly: true }}
              keyboardButtonProps={{
                "aria-label": "change date",
              }}
              fullWidth
              disableFuture
              disabled={!fromDate}
              minDate={fromDate}
              value={toDate || null}
              onChange={(date) => {
                setToDate(new Date(date || null));
              }}
            />
          </FormControl>
        </Grid>
        {type == "gameActivity" && (
          <Grid item lg={2} md={2} sm={6} xs={12}>
            <Typography className="filterTitle">Status</Typography>
            <Select
              value={gameMonth}
              onChange={(e) => {
                setPage(1);
                setGameMonth(e.target.value);
              }}
              variant="outlined"
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
                ...menuProps,
              }}
              fullWidth
            >
              {["All", "WON", "LOSE"].map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))}
            </Select>
          </Grid>
        )}
        {type == "fundActivity" && (
          <Grid item lg={2} md={2} sm={6} xs={12}>
            <Typography className="filterTitle">Status</Typography>
            <Select
              value={gameFund}
              onChange={(e) => {
                setPage(1);
                setGameFund(e.target.value);
              }}
              variant="outlined"
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
                ...menuProps,
              }}
              fullWidth
            >
              {["All", "Deposit", "Withdraw", "Rejected"].map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))}
            </Select>
          </Grid>
        )}

        <Grid
          item
          lg={2}
          md={2}
          sm={6}
          xs={12}
          style={{ display: "flex", alignSelf: "end" }}
        >
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              setIsApply(true);
              userManagementApi();
            }}
          >
            Apply
          </Button>
        </Grid>
        <Grid
          item
          lg={2}
          md={2}
          sm={6}
          xs={12}
          style={{ display: "flex", alignSelf: "end" }}
        >
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              setIsApply(false);
              handleClear();
            }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
      {/* </Paper> */}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {checkHeading
                ?.filter((item) => item !== "")
                ?.map((item) => {
                  return (
                    <TableCell align="left">
                      {item}
                      {item == "Level" && (
                        <IconButton
                          style={{ padding: "0px 9px" }}
                          onClick={() => {
                            const sortedData = userData
                              .slice()
                              .sort((a, b) =>
                                !sortLevel
                                  ? a.level - b.level
                                  : b.level - a.level
                              );
                            setUserData(sortedData);
                            setSortLevel(!sortLevel);
                          }}
                        >
                          <FaArrowDown
                            style={{
                              fontSize: "14px",
                              fontWeight: "800",
                              transform: sortLevel ? "rotate(180deg)" : "",
                            }}
                          />
                        </IconButton>
                      )}
                      {item == "Amount" &&
                        type == "gameActivity" &&
                        gameMonth != "All" &&
                        isApply && (
                          <IconButton
                            style={{ padding: "0px 9px" }}
                            onClick={() => {
                              const sortedData = userData
                                .slice()
                                .sort((a, b) =>
                                  gameMonth == "LOSE"
                                    ? !amountSorting
                                      ? a.betAmount - b.betAmount
                                      : b.betAmount - a.betAmount
                                    : !amountSorting
                                      ? a.prize - b.prize
                                      : b.prize - a.prize
                                );
                              setUserData(sortedData);
                              setAmountSorting(!amountSorting);
                            }}
                          >
                            <FaArrowDown
                              style={{
                                fontSize: "14px",
                                fontWeight: "800",
                                transform: amountSorting
                                  ? "rotate(180deg)"
                                  : "",
                              }}
                            />
                          </IconButton>
                        )}
                      {item == "Amount" && type == "fundActivity" && (
                        <IconButton
                          style={{ padding: "0px 9px" }}
                          onClick={() => {
                            const sortedData = userData
                              .slice()
                              .sort((a, b) =>
                                !amountSorting
                                  ? a.amount - b.amount
                                  : b.amount - a.amount
                              );
                            setUserData(sortedData);
                            setAmountSorting(!amountSorting);
                          }}
                        >
                          <FaArrowDown
                            style={{
                              fontSize: "14px",
                              fontWeight: "800",
                              transform: amountSorting ? "rotate(180deg)" : "",
                            }}
                          />
                        </IconButton>
                      )}
                    </TableCell>
                  );
                })}
            </TableRow>
          </TableHead>
          <TableBody>
            {userData &&
              userData?.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{(page - 1) * 10 + i + 1}</TableCell>

                  <TableCell>
                    {type == "leaderBoard" ? (
                      <Box
                        className="displayStart"
                        onClick={() =>
                          history("/view-user", {
                            state: {
                              type: "VIEW",
                              userId: item?.userData?._id,
                            },
                          })
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <Avatar
                          src={
                            item?.userData?.profilePic
                              ? item?.userData?.profilePic
                              : "/img.png"
                          }
                          alt={item?.userData?.firstName}
                        />
                        &nbsp;&nbsp;
                        {item?.userData?.userName}
                      </Box>
                    ) : type == "userActivity" ? (
                      data?.email
                    ) : type == "gameActivity" ? (
                      item?.playedStatus == "LOSE" ? (
                        item?.betAmount
                      ) : (
                        item?.prize
                      )
                    ) : type == "gameScore" ? (
                      item?.highestScore == "0" ? (
                        "0"
                      ) : (
                        item?.highestScore
                      )
                    ) : item?.amount == "0" ? (
                      "0"
                    ) : (
                      `${item?.amount} Sol` || "..."
                    )}
                  </TableCell>
                  {type == "leaderBoard" && (
                    <TableCell>
                      <CopyWalletAddress address={item?.userData?.email} />
                    </TableCell>
                  )}

                  {type !== "gameScore" && (
                    <TableCell>
                      {type == "userActivity"
                        ? item?.type
                        : type == "gameActivity"
                          ? item?.playedStatus
                          : item?.quantity || item?.betAmount || "..."}
                    </TableCell>
                  )}

                  <TableCell>
                    {item?.old ||
                      (item?.walletAddress && (
                        <CopyWalletAddress address={item?.walletAddress} />
                      )) ||
                      item?.level ||
                      "..."}
                  </TableCell>
                  {typeAnalytics == "totalScore" &&
                    (type == "gameScore" || type == "gameActivity") && (
                      <TableCell>
                        <CopyWalletAddress address={item?.userId?.email} />
                      </TableCell>
                    )}
                  {type == "leaderBoard" && (
                    <TableCell>{item?.gameTitle || "..."}</TableCell>
                  )}
                  <TableCell>
                    {type == "leaderBoard"
                      ? item?.highestScore == "0"
                        ? "0"
                        : item?.highestScore
                      : item?.new
                        ? item?.new
                        : item?.transactionType == "BUY"
                          ? "DEPOSIT"
                          : item?.transactionType || item?.gameTitle || "..."}
                  </TableCell>
                  {type === "fundActivity" && (
                    <>
                      <TableCell>{item?.status || "..."}</TableCell>
                      {item?.reason?.length > 20 ? (
                        <Tooltip title={item?.reason}>
                          <TableCell>{item?.reason?.slice(0, 20)}...</TableCell>
                        </Tooltip>
                      ) : (
                        <TableCell>{item?.reason || "..."}</TableCell>
                      )}
                    </>
                  )}
                  <TableCell>
                    {type == "leaderBoard"
                      ? item?.prize
                      : moment(item?.createdAt).format("lll")}
                  </TableCell>

                  {type === "leaderBoard" && (
                    <TableCell>
                      {item?.createdAt
                        ? moment(item?.createdAt).format("lll")
                        : "..."}
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {isUserUpdating &&
          [1, 2, 3, 4].map((item, i) => {
            return <ListLoder />;
          })}
        {!isUserUpdating && userData && userData?.length === 0 && (
          <NoDataFound text={"No activity data found!"} />
        )}
      </TableContainer>
      {!isUserUpdating &&
        userData?.length > 0 &&
        noOfPages?.totalPages > (page === 1 ? 10 : 0) && (
          <Box className="displayEnd">
            <Pagination
              page={page}
              count={noOfPages?.pages}
              onChange={(e, v) => {
                setPage(v);
              }}
              shape="rounded"
              color="primary"
            />
          </Box>
        )}
    </Box>
  );
}

export default UserActivityTable;
