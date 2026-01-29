import Filtter from "src/component/Filtter";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Pagination } from "@material-ui/lab";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { getAPIHandler } from "src/ApiConfig/service";
import moment from "moment";
import NoDataFound from "src/component/NoDataFound";
import { toast } from "react-hot-toast";
import ConfirmationModal from "src/component/ConfirmationModal";
import { IoMdEye } from "react-icons/io";
import GoBack from "src/component/GoBack";
import ListLoder from "src/component/ListLoder";
import PageLoading from "src/component/PageLoading";

const useStyles = makeStyles((theme) => ({
  main: {
    "& th": {
      background: "#DE14FF",
      textAlign: "center",
      color: "white",
      border: "1px solid white",
    },
    "& .MuiTableContainer-root": {
      marginTop: "30px",
    },
    "& .MuiTableCell-body": {
      textAlign: "center",
      borderBottom: "1px solid #DE14FF",
    },
    "& .MuiTableCell-root": {
      display: "table-cell",
      padding: "12px",

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

  },
}));

function AllWithdrawals() {
  let filterData = {};
  const classes = useStyles();
  const history = useNavigate();
  const [gameData, setGameData] = useState([]);
  const [isGameUpdating, setIsGameUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });
  const [filtersData, setFiltersData] = useState({
    fromDate: null,
    toDate: null,
    search: "",
    status: "",
    transactionType: "",
  });

  const gameManagementApi = async (source) => {
    try {
      filterData = {
        search: filtersData?.search ? filtersData?.search : null,
        fromDate: filtersData.fromDate
          ? moment(filtersData.fromDate).format("YYYY-MM-DD")
          : null,
        toDate: filtersData.toDate
          ? moment(filtersData.toDate).format("YYYY-MM-DD")
          : null,
        status: filtersData?.status ? filtersData?.status : null,
        transactionType: filtersData?.transactionType
          ? filtersData?.transactionType
          : null,
      };

      const response = await getAPIHandler({
        endPoint: "transactionHistory",
        paramsData: {
          page: page,
          limit: 10,
          ...filterData,
        },
        source: source,
      });
      console.log(response, "response from All transactions History");

      if (response.data.responseCode === 200) {
        setGameData(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setGameData([]);
      }
      setIsGameUpdating(false);
    } catch (error) {
      setIsGameUpdating(false);
      setGameData([]);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    gameManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [page, filtersData]);

  const handleClearFilter = () => {
    setFiltersData({
      ...filtersData,
      ["fromDate"]: null,
      ["toDate"]: null,
      ["search"]: "",
      ["status"]: "",
      ["transactionType"]: "",
    });
  };

  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title={"All Withdrawals"} />
      </Box>
      <Box mt={3} mb={3}>
        <Paper elevation={3}>
          <Filtter
            filter={filtersData}
            setFilter={(data) => {
              setFiltersData(data);
            }}
            clearFilters={handleClearFilter}
            onClickFun={gameManagementApi}
            type="wallet"
            placeholder="Search"
            filterData={{ ...filterData, limit: noOfPages.totalPages }}
            excelTableName="ALL Withdrawals"
            apiEndPoint="transactionHistory"
          />
        </Paper>
      </Box>

      <Grid container>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "S.No",
                    "User",
                    "Wallet Address",
                    "Initiated",
                    "Network",
                    "Amount",
                    "Charge",
                    "USDT_Amount",
                    "After Charge",
                    "Status",
                  ].map((item) => {
                    return <TableCell key={item}>{item}</TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {gameData && gameData.length > 0 ? (
                  gameData.map((item, i) => (
                    <TableRow key={item._id}>
                      <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                      {/* <TableCell>{item.userId?.userName || ""}</TableCell> */}
                      <TableCell>
                        <Link to={`/user-dashboard/${item.userId?._id}`} state={{ userName: item.userId?.userName }} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {item.userId?.userName || ""}
                        </Link>
                      </TableCell>
                      <TableCell>{item.walletAddress}</TableCell>
                      {/* <TableCell>{item.createdAt}</TableCell> */}
                      <TableCell>
                        {" "}
                        {moment(item?.createdAt).format("lll")
                          ? moment(item?.createdAt).format("lll")
                          : "--"}
                      </TableCell>
                      <TableCell>{item.token}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.charge}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>{item.AfterCharge}</TableCell>
                      <TableCell
                        style={
                          item?.status === "REJECTED"
                            ? { color: "red" }
                            : item?.status === "PENDING"
                              ? { color: "orange" }
                              : item?.status === "TRANSFERRED"
                                ? { color: "blue" }
                                : item?.status === "APPROVED"
                                  ? { color: "green" }
                                  : { color: "gray" }
                        }
                      >
                        {item?.status}
                      </TableCell>


                    </TableRow>
                  ))
                ) : (
                  <NoDataFound />
                )}
              </TableBody>
            </Table>

            {isGameUpdating && (
              [1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => <ListLoder key={i} />)
            )}
            {!isGameUpdating && gameData?.length === 0 && <NoDataFound text={"No data found!"} />}

          </TableContainer>
        </Grid>
      </Grid>

      <Box className="pagination">
        <Pagination
          count={noOfPages.pages}
          page={page}
          onChange={(e, pageNumber) => setPage(pageNumber)}
          color="primary"
        />
      </Box>
    </Box>
  );
}

export default AllWithdrawals;
