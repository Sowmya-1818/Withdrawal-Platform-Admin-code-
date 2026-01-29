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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


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

function ApprovedWithdrawalsspin() {
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
  // const [feeWallet, setFeeWallet] = useState(
  // //  "UQBOzyKE3f-KCbp02noe3SmmKJDVN4C34jP62nPG6w4fHIy6"
  //  "0QBEnCcKUwkAsCjMNgrdh2jr7chIQ0JV0f7fQW8-tguIy9Dy"
  // ); // Fee Wallet state

  const feeWallet = process.env.REACT_APP_FEE_WALLET;

  console.log("Fee Wallet from env:", feeWallet);

  const gameManagementApi = async (source) => {
    try {
      // Log the filtersData to debug its structure


      // Prepare filterData for request
      const filterData = {
        search: filtersData?.search || null,
        fromDate: filtersData?.fromDate
          ? moment(filtersData.fromDate).format("YYYY-MM-DD")
          : null,
        toDate: filtersData?.toDate
          ? moment(filtersData.toDate).format("YYYY-MM-DD")
          : null,
      };
      console.log(filterData, 'filterData');

      // Make API call
      const tokendata = window.sessionStorage.getItem("spintoken");
      console.log(tokendata, 'tokendata');

      const response = await getAPIHandlerspin({
        endPoint: "Pending",
        tokenDATA: tokendata,
        paramsData: {
          page: page,
          limit: 10,
          status: "APPROVED",
          Symbol: "TON",
          ...filterData,
        },
        source: source,
      });

      // Log the full response for debugging
      console.log("API Response:", response);

      if (response.status === 200) {
        const responseData = response?.data?.data || [];

        // Log the unfiltered data
        console.log("Unfiltered Data:", responseData);


        if (responseData.length > 0) {
          setGameData(responseData);
        } else {
          console.warn("No approved data found.");
          setGameData([]); // Clear state if no data is approved
        }

        // Update pagination and clear filters
        setNoOfPages({
          pages: response.data.totalPages,
          totalPages: response.data.total,
        });
        setIsClear(false);
      } else {
        console.error("Unexpected response status:", response.status);
        setGameData([]);
      }
    } catch (error) {
      // Log error details
      console.error("Error fetching data:", error);
      setGameData([]);
    } finally {
      setIsGameUpdating(false); // Ensure this is always updated
    }
  };

  useEffect(() => {
    if (isClear) {
      gameManagementApi();
    }
  }, [isClear]);

  // Fetch game settings including the Fee_wallet

  useEffect(() => {
    if (isClear) {
      // gameManagementApi();
    }
  }, [isClear]);
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
      const exists = prevSelected.find((item) => item.reqId === row.reqId);
      let newSelectedRows;

      if (exists) {
        newSelectedRows = prevSelected.filter((item) => item.reqId !== row.reqId);
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




  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedRows.length < 1) {
      toast.error("Please select at least one withdrawal to approve.");
      return;
    }

    try {
      const messages = [];

      selectedRows.forEach((row) => {
        messages.push({
          address: row.user.wallet_address,
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
          userIds: selectedRows.map((row) => row.reqId),
          status: "TRANSFERRED",
        };

        setIsGameUpdating(true);

        const response = await postAPIHandlerspin({
          endPoint: "approvereject",
          dataToSend: responseData,

        });
console.log("API Response:", response);

        if (response && response.data.responseCode === 200) {
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

  useEffect(() => {
    const source = axios.CancelToken.source();
    gameManagementApi(source);
    // GetGameSettings(source);
    return () => {
      source.cancel();
    };
  }, [page]);

  useEffect(() => {
    if (gameData.length > 0 && selectedRows.length === gameData.length) {
      setSelectAllChecked(true);
    } else {
      setSelectAllChecked(false);
    }
  }, [gameData, selectedRows]);

  useEffect(() => {

  }, [selectedRows, feeWallet])


  // console.log(selectedRows, 'selectedRows');
//  const handleDownload = async () => {
//   try {
//     const tokendata = window.sessionStorage.getItem("spintoken");
//     console.log(tokendata, 'tokendata');

//     const response = await getAPIHandlerspin({
//       endPoint: "Pending",
//       tokenDATA: tokendata,
//       paramsData: {
//         status: "APPROVED",
//         Symbol: "TON",
//         limit: 1000,
//       },
//     });

//     console.log("Data for Excel:", response);
//     const data = response.data.data;

//     if (!Array.isArray(data) || data.length === 0) {
//       alert("No data available for export.");
//       return;
//     }

//     const flatData = data.map(item => {
//       const newItem = {};
//       for (const key in item) {
//         if (typeof item[key] === "object" && item[key] !== null) {
//           newItem[key] = JSON.stringify(item[key]);
//         } else {
//           newItem[key] = item[key];
//         }
//       }
//       return newItem;
//     });

//     const worksheet = XLSX.utils.json_to_sheet(flatData);
//     const workbook = XLSX.utils.book_new();

//     // 🔥 Custom sheet name here
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Withdrawals Spin TON");

//     XLSX.writeFile(workbook, "Approved_Withdrawals_Spin_TON.xlsx");
//   } catch (error) {
//     console.error("Error generating Excel file:", error);
//     alert("Failed to download Excel");
//   }
// };

const fetchAllData = async () => {
  const tokendata = window.sessionStorage.getItem("spintoken");
  let page = 1;
  let allData = [];
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await getAPIHandlerspin({
      endPoint: "Pending",
      tokenDATA: tokendata,
      paramsData: {
        status: "APPROVED",
        Symbol: "TON",
        page,
        // limit: 10, // or whatever default limit
      },
    });
    
    const data = response.data.data;
    const total = response.data.total ;
    // const limit = response.data.limit || 10;
    totalPages = Math.ceil(total );

    allData = [...allData, ...data];
    page++;
  }

  return allData;
};

const handleDownload = async () => {
  try {
    const data = await fetchAllData();

    if (!Array.isArray(data) || data.length === 0) {
      alert("No data available for export.");
      return;
    }

    const flatData = data.map(item => {
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

    XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Withdrawals Spin TON");
    XLSX.writeFile(workbook, "Approved_Withdrawals_Spin_TON.xlsx");
  } catch (error) {
    console.error("Error generating Excel file:", error);
    alert("Failed to download Excel");
  }
};



  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title={"Approved Withdrawals Spin TON"} />
        <Box className="p-4" display="flex" alignItems="center">
          <TonConnectButton />
          {wallet ? (<Button
            variant="contained"
            color="primary"
            className="bg-green-600 hover:bg-green-700 text-white font-medium"
            style={{ marginLeft: "10px" }}
            onClick={handleSubmit}
          >
            Approve
          </Button>) : (<></>)}



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
            excelTableName="Approved Withdrawals Spin TON"
            apiEndPoint="Pending"
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
                  {/* <TableCell>Actions</TableCell> */}
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
                      <TableCell>{row.user?.username || "Anonymous"}</TableCell>{" "}

                      {/* <TableCell>
                        <Link
                          to={`/user-dashboard/${row.user.id}`} state={{username:row.user?.username}}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {row.user?.username || "Anonymous"}
                        </Link>
                      </TableCell> */}

                      <TableCell>{row?.user?.wallet_address}</TableCell>
                      {/* <TableCell>{row?.token}</TableCell> */}
                      <TableCell>TON</TableCell>
                      {/* <TableCell>{row?.created_at}</TableCell> */}
                      <TableCell>
                        {" "}
                        {moment(row?.created_at).format("lll")
                          ? moment(row?.created_at).format("lll")
                          : "--"}
                      </TableCell>
                      <TableCell>{row?.points_to_redeem}</TableCell>
                      <TableCell>{row?.total_usd_value}</TableCell>
                      <TableCell>{row?.platform_fee_charged}</TableCell>
                      <TableCell>
                        {row?.usd_after_charge
                          ? parseFloat(row.usd_after_charge).toFixed(4)
                          : "0.0000"}
                      </TableCell>
                      <TableCell>{row?.Token_Amount}</TableCell>
                      <TableCell>{row?.Fee_tokens || 0.0022} </TableCell>
                      <TableCell>{row?.Symbol}</TableCell>
                      <TableCell
                        style={
                          row?.status == "REJECTED"
                            ? { color: "red" }
                            : row?.status == "PENDING"
                              ? { color: "orange" }
                              : row?.status == "APPROVED"
                                ? { color: "green" }
                                : { color: "gray" }
                        }
                      >
                        {row?.status}
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

export default ApprovedWithdrawalsspin;



