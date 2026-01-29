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
   FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import * as XLSX from "xlsx";
import { TonConnectButton,useTonWallet ,useTonConnectUI} from '@tonconnect/ui-react';
import { GetApprovedWithdrawalsApi, transfertowallet } from "../../../ApiConfig/Utils/APIs/Admin_Apis"
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
  const controllers = []
  const [walletAddress, setWalletAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [totalPage, setTotalPage] = useState('');
  const [totalRecord, setTotalRecord] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
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
  const fetchTransferWithdrawals = async (currentPage) => {
    
    try {
        console.log(currentPage, "currentPage");

        // Log the filtersData to debug its structure
        const filterData = {
            search: filtersData?.search || null,
            fromDate: filtersData?.fromDate
                ? moment(filtersData.fromDate).format("YYYY-MM-DD")
                : null,
            toDate: filtersData?.toDate
                ? moment(filtersData.toDate).format("YYYY-MM-DD")
                : null,
        };
        console.log(filtersData?.search, 'filterData'); // Debugging the filterData

        const controller = new AbortController();
        controllers.push(controller);
        const Symbol = "TON"
        const response = await GetApprovedWithdrawalsApi(
          filtersData?.search,
          startDate,
          endDate,
            currentPage,
            limit,
            Symbol,
            controller,
            filterData ,// Added filterData to the API call
            
        );
console.log(response, "responseresponseGetApprovedWithdrawalsApi");

        if (response.status === 200) {

          
            setGameData(response.data.data);
            for (let i = 0; i < response.data.data.length; i++) {
                console.log(`Item ${i + 1}:`, response.data.data[i].user_id?.username);
            }
            console.log(response.data.data, "response manu");

            console.log(totalPage, "totalPage");
            setTotalRecord(response.data.totalRecord);
        } 
    } catch (error) {
        console.error("Error fetching transfer withdrawals:", error);
    }
};

useEffect(() => {
  fetchTransferWithdrawals(page);
}, [page, filtersData, limit]);
  

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
      
      const newSelectedRows = exists
        ? prevSelected.filter((item) => item._id !== row._id)
        : [...prevSelected, row];
  
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
      console.log([...gameData],"gameData");
      
    }
    setSelectAllChecked(!selectAllChecked); // Toggle the "Select All" checkbox state
  };



 

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  

  // const myTransaction = {
  //   validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
  //   messages: [
  //     {
  //       address:selectedRows[0].wallet_id,
  //       amount: Math.round((selectedRows[0].TransferTokens)*1e9),
        
  //     },
  //     {
  //       address: feeWallet,
  //       amount: Math.round((selectedRows[0].FeeTokens)*1e9),
       
  //     },
  //     {
  //       address: selectedRows[1].wallet_id,
  //       amount: Math.round((selectedRows[1].TransferTokens)*1e9),
      
  //     },
  //     {
  //       address: feeWallet,
  //       amount: Math.round((selectedRows[1].FeeTokens)*1e9),
       
  //     },
  //   ],
  // };
    
  //  console.log(myTransaction,"myTransaction1");
   
    
  //       try {
  //         const result = await tonConnectUI.sendTransaction(myTransaction);
  //         console.log("transaction", {
  //           transactionHash: result.boc,
  //           userIds: [selectedRows[0]._id,selectedRows[1]._id],
  //           status: "TRANSFERRED",
  //         });
          
  //         if(result){
  //           const controller = new AbortController();
  //           controllers.push(controller);
  //           const responseData = {
  //             transactionHash: result.boc,
  //             withdrawalsData: selectedRows,

  //             // userIds: [selectedRows[0],selectedRows[1]],
  //             status: "TRANSFERRED",
  //           };
            
  //           const response = await transfertowallet(responseData, controller);
  //           console.log(response, "response transfertowallet");
  //           if (response.status === 200) {
  //             // getWithdrawApi()
  //             toast.success(response.data.message);
  //             setTimeout(() => {
  //               window.location.reload();
  //             },1000);
              
              
  //           } else if (response.response.status === 404) {
  //             toast.error(response.response.data?.message);
  //           } else if (response.response.status === 401) {
  //             toast.error(response.response.data?.message);
  //           } else {
  //             toast.error("Something went wrong!");
  //           }

           
  //         }
       
  //     }catch(error){

  //     }
   
  // };
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
          address: row.wallet_id,
          amount: Math.round(row.TransferTokens * 1e9),
        });
        messages.push({
          address: feeWallet,
          amount: Math.round(row.FeeTokens * 1e9),
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
  
      if(result){
                 const controller = new AbortController();
                 controllers.push(controller);
                 const responseData = {
                   transactionHash: result.boc,
                   withdrawalsData: selectedRows,
     
                   // userIds: [selectedRows[0],selectedRows[1]],
                   status: "TRANSFERRED",
                 };
                 
                 const response = await transfertowallet(responseData, controller);
                 console.log(response, "response transfertowallet");
                 if (response.status === 200) {
                   // getWithdrawApi()
                   toast.success(response.data.message);
                   setTimeout(() => {
                     window.location.reload();
                   },1000);
                   
                   
                 } else if (response.response.status === 404) {
                   toast.error(response.response.data?.message);
                 } else if (response.response.status === 401) {
                   toast.error(response.response.data?.message);
                 } else {
                   toast.error("Something went wrong!");
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

  useEffect(()=>{

  }, [selectedRows, feeWallet])


  // console.log(selectedRows, 'selectedRows');
 const handleDownload = async () => {
  try {
    const controller = new AbortController();
    controllers.push(controller);

    const Symbol = "TON";
    const fullLimit = totalRecord ; // Fallback just in case
    const response = await GetApprovedWithdrawalsApi(
      filtersData?.search,
      startDate,
      endDate,
      1, // Always page 1 to get all in one go
      fullLimit,
      Symbol,
      controller,
      filterData
    );

    console.log("Data for Excel:", response);

    const data = response.data.data;

    if (!Array.isArray(data) || data.length === 0) {
      alert("No data available for export.");
      return;
    }

    // Flatten data for better readability
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Withdrawals");
    XLSX.writeFile(workbook, "approved_withdrawals.xlsx");

  } catch (error) {
    console.error("Error generating Excel file:", error);
    alert("Failed to download Excel");
  }
};


  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title={"Approved Withdrawals String TON"} />
        <Box className="p-4" display="flex" alignItems="center">
        <TonConnectButton />
        {wallet ?( <Button
              variant="contained"
              color="primary"
              className="bg-green-600 hover:bg-green-700 text-white font-medium"
              style={{ marginLeft: "10px" }}
              onClick={handleSubmit}
            >
              Approve
            </Button>):(<></>)}
        
           
        
        </Box>
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
            excelTableName="Approved Withdrawals String TON"
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
                  <TableCell>Initiated</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>USDT Amount</TableCell>
                  <TableCell>Charge</TableCell>
                  <TableCell>After Charge</TableCell>
                  <TableCell>Tokens Amount</TableCell>
                  <TableCell>Network</TableCell>
                  <TableCell>Symbol </TableCell>
                  {/* <TableCell>Symbol</TableCell> */}
                  
                  <TableCell>Status</TableCell>
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
                     
                      {/* <TableCell>
                        <Link
                          to={`/user-dashboard/${row.user_id?._id}`} state={{username:row.user_id?.username}}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                        {row.user_id?.username || "Anonymous"}
                        </Link>
                      </TableCell> */}
                      <TableCell>
                      {row.user_id?.username || "Anonymous"}
                      </TableCell>
                      
                      <TableCell>{row.wallet_id}</TableCell>
                     
                      <TableCell>
                        {" "}
                        {moment(row?.createdAt).format("lll")
                          ? moment(row?.createdAt).format("lll")
                          : "--"}
                      </TableCell>
                      <TableCell>{row?.amount}</TableCell>
                      <TableCell>{row?.USDT_Amount}</TableCell>
                      <TableCell>{row?.charge}</TableCell>
                      <TableCell>{row?.after_charge}</TableCell>
                       <TableCell>{row?.TransferTokens}</TableCell>
                      <TableCell>{row?.TokenSymbol}</TableCell>
                      <TableCell>{row?.method_id.name}</TableCell>
                                            
                      {/* <TableCell>{row?.wallet_currency_id.symbol}</TableCell> */}
                     
                      
                      
                      <TableCell
                        style={
                          row?.status === 1
                            ? { color: "green" }
                            : row?.status === 2
                            ? { color: "orange" }
                            : row?.status === 3
                            ? { color: "red" }
                            : { color: "black" } // Default color, just in case the status is not 1, 2, or 3
                        }
                      >
                        {row?.status === 1
                          ? "approved"
                          : row?.status === 2
                          ? "pending"
                          : row?.status === 3
                          ? "rejected"
                          : "unknown"} {/* You can also handle other status if needed */}
                      </TableCell>
                   
                      
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
      
{/* <FormControl variant="outlined" style={{ width: 100, marginLeft: "auto" ,marginTop: "20px", marginRight: "20px" }}>
  <InputLabel>Rows</InputLabel>
  <Select
    value={limit}
    onChange={(e) => {
      setLimit(Number(e.target.value));
      setPage(1); // Reset to page 1 when limit changes
    }}
    label="Rows"
  >
    {[10, 25, 50, 100,1000].map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </Select>
</FormControl> */}
     
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
