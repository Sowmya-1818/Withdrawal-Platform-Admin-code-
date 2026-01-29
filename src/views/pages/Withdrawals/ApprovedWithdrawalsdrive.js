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
import { getAPIHandler, getAPIHandlercarrace, getAPIHandlerspin, postAPIHandler, postAPIHandlercarrace, postAPIHandlerspin } from "src/ApiConfig/service";
import * as web3 from "@solana/web3.js";
import bs58 from "bs58";
import { makeStyles } from "@material-ui/core/styles";
import { MdDelete, MdEdit } from "react-icons/md";
import { TonConnectButton, useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CryptoJS from "crypto-js";

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

function ApprovedWithdrawalsDrive() {
  let filterData = {};
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const classes = useStyles();
  const history = useNavigate();
  const [gameData, setGameData] = useState([]);
  const [withdrawSettings, setwithdrawSettings] = useState([]);
  const [isGameUpdating, setIsGameUpdating] = useState(false);
  const [page, setPage] = useState(1);
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

  const [walletAddress, setWalletAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPrivateKeyInputVisible, setIsPrivateKeyInputVisible] =
    useState(false);
  const [isPrivateKeyApproved, setIsPrivateKeyApproved] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false); // For "Select All" checkbox state

  const feeWallet = process.env.REACT_APP_FEE_WALLET;

  console.log("Fee Wallet from env:", feeWallet);

  

 const gameManagementApi = async (source) => {
  try {
    const tokendata = window.sessionStorage.getItem("carrace"); // Get the token data
console.log("Token Data:", tokendata);

    const filterData = {
      search: filtersData?.search || null,
      fromDate: filtersData?.fromDate
        ? moment(filtersData.fromDate).format("YYYY-MM-DD")
        : null,
      toDate: filtersData?.toDate
        ? moment(filtersData.toDate).format("YYYY-MM-DD")
        : null,
      page, // <-- Add this line
      limit: 10, // <-- Add this line (or use your preferred page size)
      status: "approved", // <-- Add this if you want only approved
     token:"TON"
    };
console.log("Filter Data:", filterData);

    const response = await getAPIHandlercarrace({
      endPoint: "getallwithdrawstatus",
       paramsData: filterData, // <-- Pass filterData here
      tokenDATA: tokendata,
     
    });

    console.log("Response from getallwithdrawstatus:", response);
    
      // Check if response is valid
      if (response && response.status === 200) {
        const responseData = response.data;
        console.log("Response Data:", responseData);

        if (responseData && responseData.withdrawals && responseData.withdrawals.length > 0) {
          // Filter out only approved withdrawals
          const approvedWithdrawals = responseData.withdrawals.filter(
            (row) => row.status === "approved"
          );
          setGameData(approvedWithdrawals); // Set withdrawals data
        } else {
          console.warn("No withdrawal data found.");
          setGameData([]); // Set an empty array if no withdrawals data is found
        }

        setNoOfPages({
          pages: responseData.totalPages,
          totalPages: responseData.total,
        });
        setIsClear(false);
      } else {
        console.error("Unexpected response status:", response ? response.status : "No response");
        setGameData([]); // Set an empty array if the response is not valid
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setGameData([]); // Set an empty array if there is an error fetching data
    } finally {
      setIsGameUpdating(false);
    }
  };


  useEffect(() => {
    const source = axios.CancelToken.source();
    gameManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [page]);

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

  const handleRowSelect = (row) => {
    setSelectedRows((prevSelected) => {
      const exists = prevSelected.find((item) => item._id === row._id);
      let newSelectedRows;

      if (exists) {
        newSelectedRows = prevSelected.filter((item) => item._id !== row._id);
      } else {
        newSelectedRows = [...prevSelected, row];
      }

      // Assign selected rows to Rows state
      setSelectedRows(newSelectedRows);

      console.log("Updated Selected Data:", newSelectedRows);
      return newSelectedRows;
    });
  };
console.log("Selected Rows:", selectedRows);

  const handleSelectAll = () => {
    if (selectAllChecked) {
      setSelectedRows([]); // Deselect all rows if "Select All" checkbox is unchecked
    } else {
      setSelectedRows([...gameData]); // Store entire objects instead of just IDs
    }
    setSelectAllChecked(!selectAllChecked); // Toggle the "Select All" checkbox state
  };
console.log("Selected Rows after Select All:", selectedRows);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedRows.length < 1) {
      toast.error("Please select at least one withdrawal to approve.");
      return;
    }

    try {
      const tokendata = window.sessionStorage.getItem("carrace");
      console.log("Token Data for Transaction:", tokendata);
      
      const messages = [];

      selectedRows.forEach((row) => {
        messages.push({
          address: row.walletAddress,
          amount: Math.round(row.Token_Amount * 1e9),
        });
        messages.push({
          address: feeWallet,
          amount: Math.round(row.Fee_tokens * 1e9),
        });
      });
      console.log("Messages for Transaction:", messages);
      

      const myTransaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
        messages,
      };
console.log("Transaction Data:", myTransaction);

      const result = await tonConnectUI.sendTransaction(myTransaction);
console.log("Transaction Result:", result);

      if (result) {
        console.log("transaction", result);

        const responseData = {
          hash: result.boc,
          // userIds: selectedRows.map((row) => row.reqId),
          _id: selectedRows,
          status: "TRANSFERRED",
        };
        console.log("responseData", responseData)
        setIsGameUpdating(true);

       const response = await postAPIHandlercarrace({
  endPoint: "transferWithdraw",
  dataToSend: responseData,
  tokenDATA: tokendata,
  
});
console.log(response, "responsetransferWithdraw");

        if (response && response.status === 200) {
          toast.success("Transaction data successfully posted.");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.error("Failed to post transaction data.");
        }
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("An error occurred during the transaction.");
    }
  };

  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title={"Approved Withdrawals Drive TON"} />
        <Box className="p-4" display="flex" alignItems="center">
          <TonConnectButton />
          {wallet ? (
            <Button
              variant="contained"
              color="primary"
              className="bg-green-600 hover:bg-green-700 text-white font-medium"
              style={{ marginLeft: "10px" }}
              onClick={handleSubmit}
            >
              Approve
            </Button>
          ) : (
            <></>
          )}
        </Box>
      </Box>

      <Box mt={3} mb={3}>
        <Paper elevation={3}>
          <Filtter
            filter={filtersData}
            setFilter={(data) => setFiltersData(data)}
            clearFilters={handleClearFilter}
            onClickFun={gameManagementApi}
            type="withdraw"
            placeholder="Search"
            filterData={{
              ...filterData,
              limit: noOfPages.totalPages,
              status: "APPROVED",
            }}
            excelTableName="Approved Withdrawals String Drive"
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
                  <TableCell>Initiated</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>USDT Amount</TableCell>
                  <TableCell>Charge</TableCell>
                  <TableCell>After Charge</TableCell>
                  <TableCell>Token</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectAllChecked}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gameData.length === 0 ? (
                  <NoDataFound />
                ) : (
                  gameData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                      <TableCell>{row.username || "Anonymous"}</TableCell>
                      <TableCell>{row.walletAddress}</TableCell>
                      <TableCell>{moment(row.createdAt).format("lll") || "--"}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>{row.USDT_Amount}</TableCell>
                      <TableCell>{row.charge}</TableCell>
                      <TableCell>{row.After_Charge ? parseFloat(row.After_Charge).toFixed(4) : "0.0000"}</TableCell>
                      <TableCell>{row.token}</TableCell>
                      {/* <TableCell>{row.status}</TableCell> */}
                       <TableCell
                                                                    style={
                                                                      row?.status == "approved"
                                                                        ? { color: "green" }
                                                                        : row?.status == "pending"
                                                                          ? { color: "orange" }
                                                                          : row?.status == "transferred"
                                                                            ? { color: "blue" }
                                                                            : { color: "green" }
                                                                    }
                                                                  >
                                                                    {row?.status}
                                                                  </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.some(
                            (item) => JSON.stringify(item) === JSON.stringify(row)
                          )}
                          onChange={() => handleRowSelect(row)}
                        />
                      </TableCell>
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

export default ApprovedWithdrawalsDrive;
