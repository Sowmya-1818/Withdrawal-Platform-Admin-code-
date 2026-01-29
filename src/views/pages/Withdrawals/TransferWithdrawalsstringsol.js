import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Tooltip,
  Table,
  IconButton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
} from "@material-ui/core";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { toast } from "react-hot-toast";
import Filtter from "src/component/Filtter";
import NoDataFound from "src/component/NoDataFound";
import GoBack from "src/component/GoBack";
import Pagination from "@material-ui/lab/Pagination";
import { getAPIHandler, getAPIHandlerspin, postAPIHandler, postAPIHandlerspin } from "src/ApiConfig/service";
import * as web3 from "@solana/web3.js";
import bs58 from "bs58";
import { makeStyles } from "@material-ui/core/styles";
import { MdDelete, MdEdit } from "react-icons/md";

import { TonConnectButton, useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { GetApprovedWithdrawalsApi, GettransferredWithdrawalsApi } from "../../../ApiConfig/Utils/APIs/Admin_Apis"
import * as XLSX from "xlsx";

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
}));

function TransferWithdrawalsstringsol() {
  let filterData = {};
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const classes = useStyles();
  const history = useNavigate();
  const [gameData, setGameData] = useState([]);
  const [withdrawSettings, setwithdrawSettings] = useState([]);
  const [isGameUpdating, setIsGameUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filtersData, setFiltersData] = useState({
    fromDate: null,
    toDate: null,
    search: "",
    status: "ALL",
  });
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });
  const controllers = []
  const [walletAddress, setWalletAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [totalPage, setTotalPage] = useState('');
  const [totalRecord, setTotalRecord] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10)
  const [isPrivateKeyInputVisible, setIsPrivateKeyInputVisible] =
    useState(false);
  const [isPrivateKeyApproved, setIsPrivateKeyApproved] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false); // For "Select All" checkbox state
  const [isDownloading, setIsDownloading] = useState(false);
  // const [feeWallet, setFeeWallet] = useState(
  // //  "UQBOzyKE3f-KCbp02noe3SmmKJDVN4C34jP62nPG6w4fHIy6"
  //  "0QBEnCcKUwkAsCjMNgrdh2jr7chIQ0JV0f7fQW8-tguIy9Dy"
  // ); // Fee Wallet state

  const feeWallet = process.env.REACT_APP_FEE_WALLET;

  console.log("Fee Wallet from env:", feeWallet);

  useEffect(() => {
    if (totalRecord || totalRecord === 0) {
      var page = totalRecord / limit;
      console.log(page, "page");
      setNoOfPages({
        pages: page.toFixed(0),
        totalPages: totalRecord,
      });
      setTotalPage(page);
    }
  }, [totalRecord, limit])
  // const fetchTransferWithdrawals = async (currentPage) => {

  //   console.log(currentPage, "currentPage");

  //   const controller = new AbortController();
  //   controllers.push(controller)
  //   const response = await GettransferredWithdrawalsApi(
  //     currentPage,
  //     limit,
  //     controller
  //   );
  //   console.log(response, "response GettransferredWithdrawalsApi");
  //   if (response.status === 200) {
  //     setGameData(response.data.data);
  //     for (let i = 0; i < response.data.data.length; i++) {
  //       console.log(`Item ${i + 1}:`, response.data.data[i].user_id?.username);
  //     }
  //     // console.log(response.data.data.TokenAddress, "response manu");  

  //     console.log(totalPage, "totalPage");
  //     setTotalRecord(response.data.totalRecord);

  //   }
  // }
  const fetchTransferWithdrawals = async (currentPage) => {
    try {
      console.log(currentPage, "currentPage");
      console.log(filtersData, "filtersData"); // Debugging the filtersData

      // Extract and format dates from filtersData
      const formattedStartDate = filtersData?.fromDate
        ? moment(filtersData.fromDate).format("YYYY-MM-DD")
        : "";
      const formattedEndDate = filtersData?.toDate
        ? moment(filtersData.toDate).format("YYYY-MM-DD")
        : "";

      // Prepare filterData for request
      const filterData = {
        search: filtersData?.search || "",
        fromDate: formattedStartDate,
        toDate: formattedEndDate,
      };
      console.log(filtersData?.search, 'filterDatastring'); // Debugging the filterData
      console.log(filterData,"filterData");
      

      const controller = new AbortController();
      controllers.push(controller);
      const Symbol = "SOL";
      const response = await GettransferredWithdrawalsApi(
        filtersData?.search || "",
        formattedStartDate,
        formattedEndDate,
        currentPage,
        filterData,
        limit,
        Symbol,
        controller,
        
      );

      console.log(response, "response GettransferredWithdrawalsApi");
      const solanaData = response.data.data

      console.log(solanaData, "🌟 Solana filtered datatransferred");

      if (response.status === 200) {
        setGameData(response.data.data);
        for (let i = 0; i < response.data.data.length; i++) {
          console.log(`Item ${i + 1}:`, response.data.data[i].user_id?.username);
        }
        // console.log(response.data.data.TokenAddress, "response manu");  

        console.log(totalPage, "totalPage");
        setTotalRecord(response.data.totalRecord);
      }
    } catch (error) {
      console.error("Error fetching transferred withdrawals:", error);
    }
  };


  useEffect(() => {

    fetchTransferWithdrawals(page);

  }, [page, filtersData])

  // Fetch all transferred withdrawals for Excel download
  const fetchAllTransferredWithdrawals = async () => {
    let currentPage = 1;
    const aggregatedData = [];

    while (true) {
      const controller = new AbortController();
      const Symbol = "SOL";
      
      const response = await GettransferredWithdrawalsApi(
        "",
        "",
        "",
        currentPage,
        { search: "", fromDate: "", toDate: "" },
        100,
        Symbol,
        controller
      );

      if (!response || !response.data) {
        break;
      }

      const pageData = Array.isArray(response.data.data) ? response.data.data : [];
      aggregatedData.push(...pageData);

      const totalPages = Math.ceil(response.data.totalRecord / 100);
      if (!totalPages || currentPage >= totalPages) {
        break;
      }

      currentPage += 1;
    }

    return aggregatedData;
  };

  const handleDownload = async () => {
    if (isDownloading) {
      return;
    }

    try {
      setIsDownloading(true);
      toast.loading("Fetching data for export...");
      const data = await fetchAllTransferredWithdrawals();

      if (!Array.isArray(data) || data.length === 0) {
        toast.dismiss();
        toast.error("No data available for export.");
        return;
      }

      const flatData = data.map((item) => {
        const formattedItem = {};

        Object.keys(item || {}).forEach((key) => {
          const value = item[key];

          if (value && typeof value === "object") {
            formattedItem[key] = JSON.stringify(value);
          } else {
            formattedItem[key] = value;
          }
        });

        return formattedItem;
      });

      const worksheet = XLSX.utils.json_to_sheet(flatData);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Transferred Withdrawals SOL");
      XLSX.writeFile(workbook, "Transferred_Withdrawals_SOL.xlsx");
      
      toast.dismiss();
      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.dismiss();
      toast.error("Failed to download Excel");
    } finally {
      setIsDownloading(false);
    }
  };






  const handleClearFilter = () => {
    setFiltersData({
      ...filtersData,
      ["fromDate"]: null,
      ["toDate"]: null,
      ["search"]: "",
      ["status"]: "ALL",
    });
    setIsClear(true);
  };


  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title={"Transferred Withdrawals String SOL"} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? "Downloading..." : "Download Excel"}
        </Button>
      </Box>

      <Box mt={3} mb={3}>
        <Paper elevation={3}>
          <Filtter
            filter={filtersData}
            setFilter={(data) => setFiltersData(data)}
            clearFilters={handleClearFilter}
            // onClickFun={gameManagementApi}
            // onClickFun={fetchTransferWithdrawals}
            type="withdraw"
            placeholder="Search"
            filterData={{
              ...filterData,
              limit: noOfPages.totalPages,
              status: "APPROVED",
            }}
            excelTableName="Approved Withdrawals String SOL" 
            apiEndPoint="Pending"
          />
        </Paper>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S/N</TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell>Wallet</TableCell>
                  <TableCell>Initiated At</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell>Network</TableCell>
                  {/* <TableCell>Symbol</TableCell> */}
                  <TableCell>Tokens</TableCell>
                  <TableCell>USDT Amount</TableCell>
                  <TableCell>After Charge</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Transaction Type</TableCell>
                  {/* <TableCell>Actions</TableCell> */}

                </TableRow>
              </TableHead>
              <TableBody>
                {gameData.length === 0 ? (
                  <NoDataFound />
                ) : (
                  gameData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                      {/* <TableCell>{row?.userId?.userName}</TableCell>{" "} */}
                      {/* <TableCell>
                        <Link
                          to={`/user-dashboard/${row.user.id}`} state={{ username: row.user?.username }}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {row.user?.username || "Anonymous"}
                        </Link>
                      </TableCell> */}
                      {/* <TableCell>
                        <Link
                          to={`/user-dashboard/${row.user_id?._id}`} state={{ username: row.user_id?.username }}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {row.user_id?.username || "Anonymous"}
                        </Link>
                      </TableCell> */}
                      <TableCell>{row.user_id?.username || "Anonymous"}</TableCell>


                      <TableCell>{row.wallet_id}</TableCell>
                      {/* <TableCell>{row?.token}</TableCell> */}
                      {/* <TableCell>TON</TableCell> */}
                      {/* <TableCell>{row?.created_at}</TableCell> */}
                      <TableCell>
                        {" "}
                        {moment(row?.createdAt).format("lll")
                          ? moment(row?.createdAt).format("lll")
                          : "--"}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {moment(row?.updatedAt).format("lll")
                          ? moment(row?.updatedAt).format("lll")
                          : "--"}
                      </TableCell>
                      <TableCell>{row?.method_id?.name}</TableCell>
                      {/* <TableCell>{row?.TokenSymbol}</TableCell> */}
                      <TableCell>{row?.amount}</TableCell>
                      <TableCell>{row?.USDT_Amount}</TableCell>

                      <TableCell>{row?.after_charge}</TableCell>

                      <TableCell
                        style={
                          row?.status === 1
                            ? { color: "green" }
                            : row?.status === 2
                              ? { color: "orange" }
                              : row?.status === 3
                                ? { color: "red" }
                                : row?.status === 4
                                  ? { color: "blue" }
                                  : { color: "black" } // Default color
                        }
                      >
                        {row?.status === 1
                          ? "approved"
                          : row?.status === 2
                            ? "pending"
                            : row?.status === 3
                              ? "rejected"
                              : row?.status === 4
                                ? "TRANSFERRED"
                                : "unknown"}
                      </TableCell>
                      <TableCell>{row?.transactionType}</TableCell>
                      {/* <TableCell>
                        <Tooltip title="View">
                          <IconButton
                            onClick={() => history(`/withdrawal/${row._id}`)}
                          >
                            <MdEdit size={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton>
                            <MdDelete size={20} />
                          </IconButton>
                        </Tooltip>
                      </TableCell> */}

                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>


      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={noOfPages.pages}
          page={page}
          onChange={(event, value) => setPage(value)}
          shape="rounded"
          color="primary"
        />
      </Box>
    </Box>
  );
}

export default TransferWithdrawalsstringsol;
