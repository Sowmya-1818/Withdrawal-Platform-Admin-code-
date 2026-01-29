import Filtter from "src/component/Filtter";
import {
  Box,
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
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Pagination } from "@material-ui/lab";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAPIHandler } from "src/ApiConfig/service";
import moment from "moment";
import NoDataFound from "src/component/NoDataFound";
import { IoMdEye } from "react-icons/io";
import GoBack from "src/component/GoBack";
import ListLoder from "src/component/ListLoder";
import { sortAddress } from "src/utils";
import CopyWalletAddress from "src/component/CopyWalletAddress";

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

function WalletManagement() {
  let filterData = {};
  const classes = useStyles();
  const history = useNavigate();
  const [walletData, setWalletData] = useState([]);
  const [isWalletUpdating, setIsWalletUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [isClear, setIsClear] = useState(false);
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
    walletAddress: "",
  });

  const walletManagementApi = async (source) => {
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
      console.log(response, "response from transactions History");
      if (response.data.responseCode === 200) {
        setWalletData(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setWalletData([]);
      }
      setIsClear(false);
      setIsWalletUpdating(false);
    } catch (error) {
      setIsClear(false);
      setWalletData([]);
      setIsWalletUpdating(false);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    walletManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [page]);

  useEffect(() => {
    if (isClear) {
      walletManagementApi();
    }
  }, [isClear]);

  const handleClearFilter = () => {
    setFiltersData({
      ...filtersData,
      ["fromDate"]: null,
      ["toDate"]: null,
      ["search"]: "",
      ["walletAddress"]: "",
      ["status"]: "",
      ["transactionType"]: "",
    });
    setIsClear(true);
  };

  return (
    <Box className={classes.main}>
      <GoBack title={"Wallet Management"} />
      <Box mt={3} mb={3}>
        <Paper elevation={3}>
          <Filtter
            filter={filtersData}
            setFilter={(data) => {
              setFiltersData(data);
            }}
            clearFilters={handleClearFilter}
            onClickFun={walletManagementApi}
            type="wallet"
            placeholder="Search by email."
            filterData={{ ...filterData, limit: noOfPages.totalPages }}
            excelTableName="Walletmanagement"
            apiEndPoint="transactionHistory"
          />
        </Paper>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Sr.No",
                "Token",
                "TXN Type",
                "Date & Time",
                "Wallet Address",
                "TXN Hash",
                "TICKET ID",
                "Quantity",
                "Amount",
                "Email",
                "Status",
                "Reason",
                "Action",
              ].map((item) => {
                return <TableCell>{item}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {walletData &&
              walletData?.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                  <TableCell>{item?.token ? item?.token : "..."}</TableCell>
                  <TableCell>
                    {item?.transactionType ? item?.transactionType : "..."}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {moment(item?.createdAt).utc().format("DD-MM-YYYY")
                      ? moment(item?.createdAt).utc().format("DD-MM-YYYY")
                      : "..."}
                  </TableCell>
                  <TableCell>
                    {item?.walletAddress ? (
                      <CopyWalletAddress address={item?.walletAddress} />
                    ) : (
                      "..."
                    )}
                  </TableCell>
                  <TableCell>
                    {item?.hash ? (
                      <CopyWalletAddress address={item?.hash} />
                    ) : (
                      "..."
                    )}
                  </TableCell>
                  <TableCell>
                    {item?.ticketId ? (
                      <CopyWalletAddress address={item?.ticketId} />
                    ) : (
                      "..."
                    )}
                  </TableCell>
                  <TableCell>{item?.quantity || "0"}</TableCell>
                  <TableCell>
                    {item?.amount > 0
                      ? `${parseFloat(item?.amount).toFixed(3)} Sol`
                      : "0"}
                  </TableCell>
                  <TableCell>{item?.email ? item?.email : "..."}</TableCell>

                  {/* <TableCell
                    style={
                      item?.status == "REJECT"
                        ? { color: "red" }
                        : item?.status == "PENDING"
                        ? { color: "orange" }
                        : { color: "green" }
                    }
                  >
                    {item?.status}
                  </TableCell> */}

                  <TableCell
                    style={
                      item?.status == "REJECT"
                        ? { color: "red" }
                        : item?.status == "PENDING"
                          ? { color: "orange" }
                          : item?.status == "TRANSFERRED"
                            ? { color: "blue" }
                            : { color: "green" }
                    }
                  >
                    {item?.status}
                  </TableCell>

                  {item?.reason?.length > 20 ? (
                    <Tooltip title={item?.reason}>
                      <TableCell>{item?.reason?.slice(0, 20)}...</TableCell>
                    </Tooltip>
                  ) : (
                    <TableCell>{item?.reason || "..."}</TableCell>
                  )}
                  <TableCell>
                    <Box>
                      <Tooltip title="View Static Content" arrow>
                        <IconButton>
                          <IoMdEye
                            onClick={() =>
                              history("/deposit-transaction-detail", {
                                state: {
                                  transactionId: item?._id,
                                  data: item,
                                },
                              })
                            }
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {isWalletUpdating &&
          [1, 2, 3, 4, 5, 6, 7, 8]?.map((item, i) => {
            return <ListLoder />;
          })}
        {!isWalletUpdating && walletData && walletData?.length === 0 && (
          <NoDataFound text={"No wallet data found!"} />
        )}
      </TableContainer>
      {!isWalletUpdating && noOfPages?.totalPages > (page === 1 ? 10 : 0) && (
        <Box mt={3} mb={2} className="displayEnd">
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

export default WalletManagement;
