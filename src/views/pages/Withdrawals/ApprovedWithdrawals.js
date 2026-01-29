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
import { getAPIHandler, postAPIHandler } from "src/ApiConfig/service";
import * as web3 from "@solana/web3.js";
import bs58 from "bs58";
import { makeStyles } from "@material-ui/core/styles";
import { MdDelete, MdEdit } from "react-icons/md";
import  {urlretro, urlmodren}  from "src/ApiConfig/ApiConfig";
import { TonConnectButton, useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { logger } from "ethers";
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

function ApprovedWithdrawals() {
  let filterData = {};
  const wallet = useTonWallet();
  const [tonConnectUI, setTonConnectUI] = useTonConnectUI();
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
    historyType: "modren",
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
  const [feeWallet, setFeeWallet] = useState(""); // Fee Wallet state
  const [historyType, setHistoryType] = useState("");
  const [selectedHistoryType, setSelectedHistoryType] = useState("");
  let storedtoken;
  let mainurl;
  let transferurl;
  let secret_key;


  const feeWalletFromEnv = process.env.REACT_APP_FEE_WALLET;

  console.log("Fee Wallet from env:", feeWalletFromEnv);
 
  
  
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

      // console.log("Updated Selected Data:", newSelectedRows);
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

  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if ( filtersData.historyType === "modren") {
      storedtoken = window.sessionStorage.getItem("moderntoken");
      transferurl = "approveRejectWithdrawalmodren"
      secret_key = process.env.REACT_APP_SECRET_KEY_Modern;
  
    } else {
 
      storedtoken = window.sessionStorage.getItem("retrotoken");
      transferurl = "approveRejectWithdrawalretro"
      secret_key = process.env.REACT_APP_SECRET_KEY_Retro;
     
    }

    console.log(selectedRows, "selectedRows");
    
    if (selectedRows.length < 1) {

      console.log(filtersData.historyType, 'producttype');
      
      toast.error("Please select at least one withdrawal to approve. ", historyType);
      return;
    }

    try {

      const messages = [];
  
      selectedRows.forEach((row) => {
        messages.push({
          address: row.walletAddress,
          amount: Math.round(row.Token_Amount * 1e9),
        });
        messages.push({
          address: feeWalletFromEnv,
          amount: Math.round(row.Fee_tokens * 1e9),
        });
      });
      console.log("Messages for Transaction:", messages);
      
      // const messages = selectedRows.map((row) => ({
      //   address: row.walletAddress,
      //   amount: Math.round(row.Token_Amount * 1e9),
      // }));
      
      // messages.push({
      //   address: feeWalletFromEnv, 
      //   amount: Math.round(selectedRows[0].Fee_tokens * 1e9),
      // });

      const myTransaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 seconds
        messages,
      };

      console.log("Transaction details:", myTransaction);

      const result = await tonConnectUI.sendTransaction(myTransaction);
      console.log("Transaction result:", result);
     
      if(result){
        const responseData = {
          hash: result.boc,
          userIds: selectedRows.map((row) => row._id),
          status: "TRANSFERRED",
        };
        console.log("Response Data", responseData);
       
        
        try {
          setIsGameUpdating(true);
          const response = await postAPIHandler({
            endPoint: transferurl,
            dataToSend: responseData,
            tokenDATA: storedtoken,
            secret_key: secret_key,
          });

        
          console.log("API Response:", response);
          if (response && response.data.responseCode === 200) {
            toast.success("Transaction data successfully posted.");
            setTimeout(() => {
              window.location.reload()
            }, 1000);
          } else {
            toast.error("Failed to post transaction data.");
          }
        } 
        catch (error) {
          console.error("Error posting transaction data:", error);
          toast.error("An error occurred while posting transaction data.");
        }
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("An error occurred during the transaction.");
    }
  };


  useEffect(() => {
    if (gameData.length > 0 && selectedRows.length === gameData.length) {
      setSelectAllChecked(true);
    } else {
      setSelectAllChecked(false);
    }
  }, [gameData, selectedRows]);

  useEffect(() => {

  }, [selectedRows, feeWallet])

  
 
  const getwithdrawarsfunction = async (type) => {
  
    if (type === "modren") {
      storedtoken = window.sessionStorage.getItem("moderntoken");
      mainurl = "gettransactionHistorymodren"
      secret_key = process.env.REACT_APP_SECRET_KEY_Modern;

  
    } else {
 
      storedtoken = window.sessionStorage.getItem("retrotoken");
      mainurl = "gettransactionHistoryretro"
      secret_key = process.env.REACT_APP_SECRET_KEY_Retro;
     
    }

    console.log("Fetching withdrawals from:", mainurl);


    try {
      filterData = {
        search: filtersData?.search ? filtersData?.search : null,
        fromDate: filtersData.fromDate
          ? moment(filtersData.fromDate).format("YYYY-MM-DD")
          : null,
        toDate: filtersData.toDate
          ? moment(filtersData.toDate).format("YYYY-MM-DD")
          : null,
        // status: filtersData?.status !== "ALL" ? filtersData.status : undefined,
      };
      
console.log(filterData, 'filterDatarm');

      const response = await getAPIHandler({
        endPoint: mainurl,
        tokenDATA: storedtoken,
        secret_key: secret_key,
        paramsData: {
          page: page,
          limit: 10,
          status: "APPROVED",
          Symbol:"TON",
          ...filterData,
        },
       
      });

      console.log(response, "response from APPROVED");

      if (response.data.responseCode === 200) {
        // Filter the data to only include approved items
        const approvedData = response.data.result.docs;
        console.log(approvedData, "approvedData");
        setGameData(approvedData);
        setIsClear(false);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      }
      setIsGameUpdating(false);
    } catch (error) {
      setGameData([]);
      setIsGameUpdating(false);
    }

   
  };
  useEffect(() => {
    const source = axios.CancelToken.source();

    return () => {
      source.cancel();
    };
  }, [page]);
  useEffect(() => {
    getwithdrawarsfunction(filtersData.historyType);
  }, [filtersData.historyType,page]);

  

const handleDownload = async () => {
  try {
    let tokendata;
    let apiEndpoint;
    let secretKey;

    if (filtersData.historyType === "modren") {
      tokendata = window.sessionStorage.getItem("moderntoken");
      apiEndpoint = "gettransactionHistorymodren";
      secretKey = process.env.REACT_APP_SECRET_KEY_Modern;
    } else if (filtersData.historyType === "retro") {
      tokendata = window.sessionStorage.getItem("retrotoken");
      apiEndpoint = "gettransactionHistoryretro";
      secretKey = process.env.REACT_APP_SECRET_KEY_Retro;
    } else {
      toast.error("Invalid history type selected.");
      return;
    }

    let allData = [];
    let currentPage = 1;
    let totalPages = 1;

    // Loop to fetch all pages
    do {
      const response = await getAPIHandler({
        endPoint: apiEndpoint,
        tokenDATA: tokendata,
        secret_key: secretKey,
        paramsData: {
          status: "APPROVED",
          Symbol: "TON",
          page: currentPage,      // Add pagination param
          // limit: 1000,            // Increase limit if your API supports it
        },
      });

      const data = response.data.result.docs || [];
      totalPages = response.data.result.pages || 1;

      allData = allData.concat(data);
      currentPage++;
    } while (currentPage <= totalPages);

    if (allData.length === 0) {
      toast.error("No data available for export.");
      return;
    }

    // Flatten nested objects like userId
    const flatData = allData.map((item) => {
      const newItem = {};
      for (const key in item) {
        if (typeof item[key] === "object" && item[key] !== null) {
          newItem[key] = JSON.stringify(item[key]);
        } else {
          newItem[key] = item[key];
        }
      }
      return newItem;
    });

    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();

    const sheetName =
      filtersData.historyType === "modren"
        ? "Approved Withdrawals Modern"
        : "Approved Withdrawals Retro";

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    XLSX.writeFile(workbook, `Approved_Withdrawals_${filtersData.historyType}.xlsx`);
  } catch (error) {
    console.error("Error generating Excel file:", error);
    toast.error("Failed to download Excel");
  }
};


  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title={"Approved Withdrawals TON"} />
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
            type="ledger"
            placeholder="Search"
            // filterData={filterData}
            filterData={{
              ...filterData,
              limit: noOfPages.totalPages,
              status: "APPROVED",
            }}
            excelTableName="Approved Withdrawals TON"
            apiEndPoint="transactionHistory"
          />
           <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDownload}
                        className="exportButton"
                      >
                        Export to Excel
                      </Button>
                    </div>
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
                  <TableCell>Network</TableCell>
                  <TableCell>Initiated</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>USDT Amount</TableCell>
                  <TableCell>Charge</TableCell>
                  <TableCell>After Charge</TableCell>
                  <TableCell>Token Amount</TableCell>
                  <TableCell>Fee Tokens</TableCell>
                  <TableCell>Token</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Transaction Type</TableCell>
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
                      {/* <TableCell>{index + 1}</TableCell> */}
                      <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                      <TableCell>{row.userId?.userName || ""}</TableCell>
                      {/* <TableCell>
                        <Link
                          to={`/user-dashboard/${row.userId?._id}`}
                          state={{ userName: row.userId?.userName }}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {row.userId?.userName || ""}
                        </Link>
                      </TableCell> */}
                      <TableCell>{row?.walletAddress}</TableCell>
                      <TableCell>{row?.token}</TableCell>
                      <TableCell>
                        {moment(row?.createdAt).format("lll")
                          ? moment(row?.createdAt).format("lll")
                          : "--"}
                      </TableCell>
                      <TableCell>{row?.quantity}</TableCell>
                      <TableCell>{row?.amount}</TableCell>
                      <TableCell>{row?.charge}</TableCell>
                      <TableCell>
                        {row?.AfterCharge
                          ? parseFloat(row.AfterCharge).toFixed(4)
                          : "0.0000"}
                      </TableCell>
                      <TableCell>{row?.Token_Amount}</TableCell>
                      <TableCell>{row?.Fee_tokens || 0.0022} </TableCell>
                      <TableCell>{row?.Symbol}</TableCell>
                      <TableCell
                        style={{
                          color: row?.status === "REJECTED"
                            ? "red"
                            : row?.status === "PENDING"
                            ? "orange"
                            : row?.status === "APPROVED"
                            ? "green"
                            : "gray",
                        }}
                      >
                        {row?.status}
                      </TableCell>
                      <TableCell>{row?.transactionType}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.some(
                            (item) =>
                              JSON.stringify(item) === JSON.stringify(row)
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

      <Grid container justify="center">
        <Pagination
          count={noOfPages.pages}
          page={page}
          onChange={(_, page) => setPage(page)}
        />
        
      </Grid>
    </Box>
  );
}

export default ApprovedWithdrawals;
