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

function TransferWithdrawalssol() {
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
  const [isDownloading, setIsDownloading] = useState(false);
  let storedtoken;
  let mainurl;

  
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

 
  const getwithdrawarsfunction = async (type) => {
  
    if (type === "modren") {
      storedtoken = window.sessionStorage.getItem("moderntoken");
      mainurl = "gettransactionHistorymodren"
  
    } else {
 
      storedtoken = window.sessionStorage.getItem("retrotoken");
      mainurl = "gettransactionHistoryretro"
     
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
console.log(filterData, 'filterDatatransfer');

      const response = await getAPIHandler({
        endPoint: mainurl,
        tokenDATA: storedtoken,
        paramsData: {
          page: page,
          limit: 10,
          status: "TRANSFERRED",
          Symbol:"SOL",
          ...filterData,
        },
       
      });

      console.log(response, "response from TRANSFERRED");

      if (response.data.responseCode === 200) {
        // Filter the data to only include approved items
        const approvedData = response.data.result.docs;
        console.log(approvedData, "TRANSFERRED");
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

  const fetchAllTransferredWithdrawals = async (type) => {
    let storedtoken;
    let mainurl;
    
    if (type === "modren") {
      storedtoken = window.sessionStorage.getItem("moderntoken");
      mainurl = "gettransactionHistorymodren";
    } else {
      storedtoken = window.sessionStorage.getItem("retrotoken");
      mainurl = "gettransactionHistoryretro";
    }

    let currentPage = 1;
    const aggregatedData = [];

    while (true) {
      const response = await getAPIHandler({
        endPoint: mainurl,
        tokenDATA: storedtoken,
        paramsData: {
          page: currentPage,
          limit: 100,
          status: "TRANSFERRED",
          Symbol: "SOL",
        },
      });

      if (!response || !response.data || response.data.responseCode !== 200) {
        break;
      }

      const pageData = Array.isArray(response.data.result.docs)
        ? response.data.result.docs
        : [];
      aggregatedData.push(...pageData);

      const totalPages = Number(response.data.result.pages);
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
      toast.loading(`Fetching ${filtersData.historyType} data for export...`);
      
      // Fetch data based on currently selected history type
      const data = await fetchAllTransferredWithdrawals(filtersData.historyType);

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

      // Sheet name includes history type
      const sheetName = `Transferred ${filtersData.historyType === "modren" ? "Modern" : "Retro"} SOL`;
      const fileName = `Transferred_${filtersData.historyType === "modren" ? "Modern" : "Retro"}_SOL.xlsx`;

      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      XLSX.writeFile(workbook, fileName);
      
      toast.dismiss();
      toast.success(`${filtersData.historyType === "modren" ? "Modern" : "Retro"} Excel file downloaded successfully!`);
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.dismiss();
      toast.error("Failed to download Excel");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title={"Transferred Withdrawals SOL"} />
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
            type="ledger"
            placeholder="Search"
            // filterData={filterData}
            filterData={{
              ...filterData,
              limit: noOfPages.totalPages,
              status: "TRANSFERRED",
            }}
            excelTableName="Transferred Withdrawals SOL"
            apiEndPoint="transactionHistory"
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
                  <TableCell>Wallet Address</TableCell>
                  <TableCell>Network</TableCell>
                  <TableCell>Initiated At</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>USDT Amount</TableCell>
                  <TableCell>Charge</TableCell>
                  <TableCell>After Charge</TableCell>
                  {/* <TableCell>Token Amount</TableCell> */}
                  {/* <TableCell>Fee Tokens</TableCell> */}
                  {/* <TableCell>Token</TableCell> */}
                  <TableCell>Status</TableCell>
                  {/* <TableCell>Transaction Type</TableCell> */}
               
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
                      <TableCell>
                      {row.userId?.userName || ""}
                        {/* <Link
                          to={`/user-dashboard/${row.userId?._id}`}
                          state={{ userName: row.userId?.userName }}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {row.userId?.userName || ""}
                        </Link> */}
                      </TableCell>
                      <TableCell>{row?.walletAddress}</TableCell>
                      <TableCell>{row?.token}</TableCell>
                      <TableCell>
                        {moment(row?.createdAt).format("lll")
                          ? moment(row?.createdAt).format("lll")
                          : "--"}
                      </TableCell>
                      <TableCell>
                        {moment(row?.updatedAt).format("lll")
                          ? moment(row?.updatedAt).format("lll")
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
                      {/* <TableCell>{row?.Token_Amount}</TableCell> */}
                      {/* <TableCell>{row?.Fee_tokens || 0.0022} </TableCell> */}
                      {/* <TableCell>{row?.Symbol}</TableCell> */}
                      <TableCell
                        style={
                          row?.status == "REJECT"
                            ? { color: "red" }
                            : row?.status == "PENDING"
                              ? { color: "orange" }
                              : row?.status == "TRANSFERRED"
                                ? { color: "blue" }
                                : { color: "green" }
                        }
                      >
                        {row?.status}
                      </TableCell>
                      {/* <TableCell>{row?.transactionType}</TableCell> */}
                     
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

export default TransferWithdrawalssol;
