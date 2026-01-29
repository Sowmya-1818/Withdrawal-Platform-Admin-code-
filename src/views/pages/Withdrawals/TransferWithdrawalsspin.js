import React, { useEffect, useState } from "react";
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
import { Pagination } from "@material-ui/lab";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { deleteAPIHandler, getAPIHandler, getAPIHandlerspin, putAPIHandler } from "src/ApiConfig/service";
import moment from "moment";
import { toast } from "react-hot-toast";
import { MdBlock, MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import * as XLSX from "xlsx";
import Filtter from "src/component/Filtter";
import NoDataFound from "src/component/NoDataFound";
import ListLoder from "src/component/ListLoder";
import GoBack from "src/component/GoBack";
import ConfirmationModal from "src/component/ConfirmationModal";

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

function TransferWithdrawalsspin() {
  let filterData = {};
  const classes = useStyles();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState([]);
  const [filtersData, setFiltersData] = useState({
    fromDate: null,
    toDate: null,
    search: "",
  });
  const [page, setPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [noOfPages, setNoOfPages] = useState({ pages: 1, totalPages: 1 });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  // API to fetch filtered data
  const fetchTransferWithdrawals = async (source) => {
    try {
      const filterData = {
        search: filtersData?.search || null,
        fromDate: filtersData.fromDate
          ? moment(filtersData.fromDate).format("YYYY-MM-DD")
          : null,
        toDate: filtersData.toDate
          ? moment(filtersData.toDate).format("YYYY-MM-DD")
          : null,

      };
      console.log(filterData, 'filterDataspin');
      
      const tokendata = window.sessionStorage.getItem("spintoken");
      console.log(tokendata, 'tokendata');

      const response = await getAPIHandlerspin({
        endPoint: "Pending",
        tokenDATA: tokendata,
        paramsData: {
          page,
          limit: 10,
          status: "COMPLETED",
          Symbol: "TON",
          ...filterData
        },
        source,
      });
      console.log(response, response.status, "response from COMPLETED History");
      if (response?.status === 200) {
        // const transferredWithdrawals = response.data.data.filter(
        //   (item) => item.status === "TRANSFERRED"
        // );
        setGameData(response.data.data);
        setNoOfPages({
          pages: response.data.totalPages,
          totalPages: response.data.total,
        });
      } else {
        setGameData([]);
      }
    } catch (error) {
      console.error("Error fetching transfer withdrawals:", error);
      setGameData([]);
    } finally {
      setIsClear(false);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    fetchTransferWithdrawals(source);
    return () => source.cancel();
  }, [page, filtersData]);

  const handleClearFilter = () => {
    setFiltersData({ fromDate: null, toDate: null, search: "" });
    setIsClear(true);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteAPIHandler({
        endPoint: "deletegame",
        dataToSend: { _id: deleteId },
      });

      if (response?.data?.responseCode === 200) {
        toast.success(response.data.responseMessage);
        setOpenDeleteModal(false);
        fetchTransferWithdrawals();
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      toast.error("Failed to delete record.");
    }
  };

  //  const handleDownload = async () => {
  //   try {
  //     const tokendata = window.sessionStorage.getItem("spintoken");
  //     console.log(tokendata, 'tokendata');
  
  //     const response = await getAPIHandlerspin({
  //       endPoint: "Pending",
  //       tokenDATA: tokendata,
  //       paramsData: {
  //         status: "COMPLETED",
  //         Symbol: "TON",
  //         limit: 10000,
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
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Transfer Withdrawals Spin TON");
  
  //     XLSX.writeFile(workbook, "data.xlsx");
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
          status: "COMPLETED",
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
  
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transfer Withdrawals Spin TON");
      XLSX.writeFile(workbook, "Transfer_Withdrawals_Spin_TON.xlsx");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      alert("Failed to download Excel");
    }
  };
  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title="Transfer Withdrawals Spin TON" />
      </Box>
      <Box mt={3} mb={3}>
        <Paper elevation={3}>
          <Filtter
            filter={filtersData}
            setFilter={setFiltersData}
            clearFilters={handleClearFilter}
            onClickFun={fetchTransferWithdrawals}
            type="withdraw"
            placeholder="Search"
            // filterData={{ ...filterData, limit: noOfPages.totalPages }}
            filterData={{
              ...filterData,
              limit: noOfPages.totalPages,
              status: "COMPLETED", // Replace 'selectedStatus' with the variable holding the status value
            }}

            excelTableName="Transfer Withdrawals Spin TON"
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
                    "Points To Redeem",
                    "Platform Fee Charged",
                    "Total USD Value",
                    "USD After Charge",
                    "Status",

                  ].map((header, idx) => (
                    <TableCell key={idx}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {gameData.length > 0 ? (
                  gameData.map((item, i) => (
                    <TableRow key={item._id}>
                      <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                      {/* <TableCell>{item.userId?.userName || ""}</TableCell> */}
                      <TableCell>
                      {item.user?.username || "Anonymous"}
                        {/* <Link to={`/user-dashboard/${item.user.id}`} state={{username:item.user?.username}} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {item.user?.username || "Anonymous"}
                        </Link> */}
                      </TableCell>
                      <TableCell>{item.user?.wallet_address}</TableCell>
                      {/* <TableCell>{item.createdAt}</TableCell> */}
                      <TableCell>
                        {" "}
                        {moment(item?.created_at).format("lll")
                          ? moment(item?.created_at).format("lll")
                          : "--"}
                      </TableCell>
                      <TableCell>{item.Symbol}</TableCell>
                      <TableCell>{item.points_to_redeem}</TableCell>
                      <TableCell>{item.platform_fee_charged}</TableCell>
                      <TableCell>{item.total_usd_value}</TableCell>
                      <TableCell>{item.usd_after_charge}</TableCell>
                      <TableCell
                        style={
                          item?.status == "REJECT"
                            ? { color: "red" }
                            : item?.status == "PENDING"
                              ? { color: "orange" }
                              : item?.status == "COMPLETED"
                                ? { color: "blue" }
                                : { color: "green" }
                        }
                      >
                        {item?.status}
                      </TableCell>
                      {/* <TableCell>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => navigate(`/edit/${item._id}`)}>
                            <MdEdit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => setOpenDeleteModal(true) && setDeleteId(item._id)}>
                            <MdDelete />
                          </IconButton>
                        </Tooltip>
                      </TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <NoDataFound />
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {noOfPages.totalPages > 1 && (
                 <Box display="flex" justifyContent="center" mt={3}>
                 <Pagination
                   count={noOfPages.pages}
                   page={page}
                   onChange={(event, value) => setPage(value)}
                   shape="rounded"
                   color="primary"
                 />
               </Box>
          )}
        </Grid>
      </Grid>
   
    </Box>
  );
}

export default TransferWithdrawalsspin;
