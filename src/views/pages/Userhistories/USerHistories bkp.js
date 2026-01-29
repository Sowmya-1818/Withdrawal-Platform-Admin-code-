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
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { getAPIHandler } from "src/ApiConfig/service";
import moment from "moment";
import NoDataFound from "src/component/NoDataFound";
import { toast } from "react-hot-toast";
import ConfirmationModal from "src/component/ConfirmationModal";
import { IoMdEye } from "react-icons/io";
import GoBack from "src/component/GoBack";
import ListLoder from "src/component/ListLoder";
// import Filtter from "src/component/Filtter"; // Ensure this import is correct based on your project structure

// Importing necessary modules for Excel export
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { listUserHandlerExcel } from "../../../utils";

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
      border: "1px solid",
      borderRadius: "50px",
    },
    // Additional styles for the Export button
    "& .exportButton": {
      marginLeft: theme.spacing(2),
    },
  },
}));

function USerHistories() {
  const classes = useStyles();
  const navigate = useNavigate();
   const location = useLocation();
  const { id } = useParams();
  const [gameData, setGameData] = useState([]);
  const [isGameUpdating, setIsGameUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState({ pages: 1, totalPages: 1 });
  const [filtersData, setFiltersData] = useState({
    fromDate: null,
    toDate: null,
    search: "",
    historyType: "", // Default history type
  });

  // Mapping of historyType to table headers
  const tableHeaders = {
    default: [
      "S.No",
      "User Name",
      "Game Title",
      "Initiated",
      "Initial Balance",
      "Bet Amount",
      "Prize",
      "Final Balance",
      "Highest Score",
      "Played Status",
    ],
    booster: [
      "S.No",
      "User Name",
      "Booster Name",
      "Initiated",
      "Booster Start",
      "Booster End",
      "Amount",
      "Status",
    ],
    ads: [
      "S.No",
      "User Name",
      "Initiated",
      "Initial Balance",
      "Reward Points",
      "Final Balance",
    ],
    task: [
      "S.No",
      "User Name",
      "Initiated",
      "Initial Balance",
      "Reward Amount",
      "Final Balance",
      "Status",
    ],
    dailyReward: [
      "S.No",
      "User Name",
      "Initiated",
      "Initial Balance",
      "Reward Amount",
      "Final Balance",
      "Status",
    ],
    referral: [
      "S.No",
      "User Name",
      "Referrer Name",
      "Initiated",
      "Initial Balance",
      "Reward Amount",
      "Final Balance",
    ],
    withdrawals: [
      "S.No",
      "User Name",
      "Transaction Type",
      "Initiated",
      "Network",
      "Quantity",
      "Amount",
      "Charge",
      "After Charge",
      "Token Amount",
      "Symbol",
      "Status",
    ],
    game: [
      "S.No",
      "User Name",
      "Game Title",
      "Initiated",
      "Initial Balance",
      "Bet Amount",
      "Prize",
      "Final Balance",
      "Highest Score",
      "Played Status",
    ],
  };

  // Get headers based on the selected historyType
  const headers = tableHeaders[filtersData.historyType] || tableHeaders.default;

  // API call to fetch game histories
  const gameManagementApi = async (source) => {
    setIsGameUpdating(true);

    try {
      const appliedFilters = {
        search: filtersData.search || null,
        fromDate: filtersData.fromDate
          ? moment(filtersData.fromDate).format("YYYY-MM-DD")
          : null,
        toDate: filtersData.toDate
          ? moment(filtersData.toDate).format("YYYY-MM-DD")
          : null,
        status: filtersData.status || null,
        historyType: filtersData.historyType || null,
        ...(filtersData.historyType === "referral"
          ? { ReferredBy: id }
          : { userId: id }),
      };

      console.log(id, "id");

      const response = await getAPIHandler({
        endPoint: "allHistories",
        userId: id,
        source: source,
        paramsData: {
          page: page, // Use the current page state
          limit: 10,
          ...appliedFilters,
        },
      });
      console.log(response, "response from allHistories");

      if (response?.data?.responseCode === 200) {
        const result = response.data.result;
        console.log(result.docs, 'result.docs');

        setGameData(result.docs || []);
        setNoOfPages({ pages: result.pages || 1, totalPages: result.total || 1 });
      } else {
        setGameData([]);
        console.error(response?.data?.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setGameData([]);
    } finally {
      setIsGameUpdating(false);
    }
  };

  // Reset page to 1 whenever filtersData changes
  useEffect(() => {
    setPage(1);
  }, [filtersData]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    gameManagementApi(source);
    return () => {
      source.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filtersData]);

  const handleClearFilter = () => {
    setFiltersData((prevFilters) => ({
      ...prevFilters,
      fromDate: null,
      toDate: null,
      search: "",
      historyType: "",
      // historyType is retained unless explicitly changed
    }));
    setPage(1); // Ensure page resets to 1 when filters are cleared
  };



  const flattenObject = (obj, parentKey = "", result = {}) => {
    for (let key in obj) {
      const newKey = parentKey ? `${key}` : key; // Create a unique key
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, result); // Recursively flatten
      } else {
        result[newKey] = obj[key]; // Assign value directly
      }
    }
    return result;
  };


  const exportToExcel = async () => {
    const response = await listUserHandlerExcel({
      endPoint: "allHistories",
      
      paramsData: {
        page: page,
        userId: id,
        limit: noOfPages.totalPages, // Use the current page state
        historyType: filtersData.historyType || null,
        ...(filtersData.historyType === "referral"
          ? { ReferredBy: id }
          : { userId: id }),
      },
    });
    console.log(response, "response from excel");

    const flattenedData = response.map(item => flattenObject(item));

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Save the Excel file
    XLSX.writeFile(workbook, "UserHistories.xlsx");
  };
  
  const exportToExcelALL = async () => {
    const historyTypes = ["booster", "ads", "task", "dailyReward", "referral", "withdrawals", "game"];
    const staticHeaders = [
      "S.No", "User Name", "History Type", "Created At", "Initial Balance", "Final Balance", "Reward Points",
    ];
  
    try {
      const workbook = XLSX.utils.book_new(); // Create a new workbook
      let allMappedData = []; // Array to hold all data for all history types
 
  
      for (const type of historyTypes) {
        console.log(noOfPages.totalPages,"noOfPages.totalPages");
        const response = await listUserHandlerExcel({
          endPoint: "allHistories",
          paramsData: {
            userId: id,
            limit:10000,
            historyType: type,
            ...(type === "referral" ? { ReferredBy: id } : { userId: id }),
          },
        });
  
        if (response && response.length > 0) {
          // Log to check the response and ensure data is coming through correctly
          console.log(`Data for type ${type}:`, response);
  
          const mappedData = response.map((item, index) => {
            const baseData = {
              "S.No": index + 1, // Adjust the index for sequential numbering
              "User Name": location.state.userName || "",
              "History Type": type,
              "Created At": item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : "",
            };
  
            // Add type-specific fields
            let typeSpecificData = {};
            switch (type) {
              case "ads":
                typeSpecificData = {
                  "Initial Balance": item.InitialBalance || 0,
                  "Final Balance": item.FinalBalance || 0,
                  "Reward Points": item.Rewardpoints || 0,
                };
                break;
              case "task":
                typeSpecificData = {
                  "Initial Balance": item.InitialBalance || 0,
                  "Final Balance": item.FinalBalance || 0,
                  "Reward Points": item.Rewardpoints || 0,
                };
                break;
              case "dailyReward":
                typeSpecificData = {
                  "Initial Balance": item.InitialBalance || 0,
                  "Final Balance": item.FinalBalance || 0,
                  "Reward Points": item.Reward_Amount || 0,
                };
                break;
              case "referral":
                typeSpecificData = {
                  "Initial Balance": item.InitialBalance || 0,
                  "Final Balance": item.FinalBalance || 0,
                  "Reward Points": item.Referral_Amount || 0,
                };
                break;
              case "withdrawals":
                typeSpecificData = {
                  "Initial Balance": item.initialbalance || 0,
                  "Final Balance": item.finalbalance || 0,
                  "Reward Points": item.quantity || 0,
                };
                break;
              case "game":
                typeSpecificData = {
                  "Initial Balance": item.initialbalance || 0,
                  "Final Balance": item.finalbalance || 0,
                  "Reward Points": item.prize || 0,
                };
                break;
              default:
                typeSpecificData = {};
            }
  
            // Return the merged data
            return { ...baseData, ...typeSpecificData };
          });
  
          // Log the mapped data for the current type
          console.log(`Mapped data for type ${type}:`, mappedData);
  
          // Merge the data into allMappedData
          allMappedData.push(...mappedData); // Merge all data for all history types
        } else {
          console.log(`No data for history type: ${type}`);
        }
      }
  
      // Log allMappedData before creating the worksheet
      console.log("All merged data:", allMappedData);
  
      // Create the worksheet from the merged data
      const worksheet = XLSX.utils.json_to_sheet(allMappedData);
  
      // Manually set static headers (optional: adjust column widths if necessary)
      staticHeaders.forEach((header, index) => {
        worksheet[`${String.fromCharCode(65 + index)}1`] = { v: header }; // Set static headers at row 1
      });
  
      // Create a new workbook and append the worksheet
      XLSX.utils.book_append_sheet(workbook, worksheet, 'AllHistoryData');
  
      // Log the workbook before saving
      console.log("Workbook to be saved:", workbook);
  
      // Check if there is data to export
      if (workbook.SheetNames.length > 0) {
        XLSX.writeFile(workbook, "AllUserHistories.xlsx");
        console.log("Excel file saved successfully.");
      } else {
        console.log("No data to export.");
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };
  

  return (
    <Box className={classes.main}>
      {/* Header Section with GoBack and Export Button */}
      <Box className="displaySpacebetween" display="flex" alignItems="center">
        <GoBack title="All Histories" />
        <Button
          variant="contained"
          color="primary"
          onClick={exportToExcel}
          className="exportButton"
        >
          Export to Excel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={exportToExcelALL}
          className="exportButton"
        >
          Export All
        </Button>
      </Box>

      {/* Filter Section */}
      <Box mt={3} mb={3}>
        <Paper elevation={3}>
          <Filtter
            filter={filtersData}
            setFilter={(data) => {
              setFiltersData({
                ...filtersData, // Retain existing filters
                ...data, // Apply new filter changes
                // historyType is retained unless explicitly changed
              });
              setPage(1); // Reset to first page when filters are applied
            }}
            clearFilters={handleClearFilter}
            onClickFun={gameManagementApi}
            type="ledger"
            placeholder="Search by email."
            filterData={{ ...filtersData, limit: noOfPages.totalPages }}
            excelTableName="ALL Histories"
            apiEndPoint="allHistories"
          />
        </Paper>
      </Box>

      {/* Table Section */}
      <Grid container>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableCell key={header}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isGameUpdating ? (
                  <TableRow>
                    <TableCell colSpan={headers.length}>
                      <ListLoder />
                    </TableCell>
                  </TableRow>
                ) : gameData.length > 0 ? (
                  gameData.map((item, i) => (
                    <TableRow key={item._id}>
                      {/* Serial Number */}
                      <TableCell>{(page - 1) * 10 + i + 1}</TableCell>

                      {/* Render cells based on historyType */}
                      {filtersData.historyType === "game" && (
                        <>
                          {/* <TableCell>{item.userId?.userName || ""}</TableCell> */}
                          <TableCell>
                            <Link to={`/user-dashboard/${item.userId?._id}`} state={{ userName: item?.userId?.userName }} style={{ textDecoration: 'none', color: 'inherit' }}>
                              {item.userId?.userName || ""}
                            </Link>
                          </TableCell>
                          <TableCell>{item.gameTitle || ""}</TableCell>
                          <TableCell>
                            {" "}
                            {moment(item?.createdAt).format("lll")
                              ? moment(item?.createdAt).format("lll")
                              : "--"}
                          </TableCell>
                          <TableCell>{item.initialbalance || 0}</TableCell>
                          <TableCell>{item.betAmount || 0}</TableCell>
                          <TableCell>{item.prize || 0}</TableCell>
                          <TableCell>{item.finalbalance || 0}</TableCell>
                          <TableCell>{item.highestScore || 0}</TableCell>
                          <TableCell
                            style={{
                              color:
                                item.playedStatus === "WON"
                                  ? "green"
                                  : item.playedStatus === "LOSE"
                                    ? "red"
                                    : "gray",
                            }}
                          >
                            {item.playedStatus || ""}
                          </TableCell>
                        </>
                      )}

                      {filtersData.historyType === "booster" && (
                        <>
                          {/* <TableCell>{item.User_Id?.userName || ""}</TableCell> */}
                          <TableCell>
                            <Link to={`/user-dashboard/${item.User_Id?._id}`} state={{ userName: item?.User_Id?.userName }} style={{ textDecoration: 'none', color: 'inherit' }}>
                              {item.User_Id?.userName || ""}
                            </Link>
                          </TableCell>
                          <TableCell>{item.Booster_Id?.Name || ""}</TableCell>
                          <TableCell>
                            {" "}
                            {moment(item?.createdAt).format("lll")
                              ? moment(item?.createdAt).format("lll")
                              : "--"}
                          </TableCell>
                          <TableCell>{item.BoosterStart || ""}</TableCell>
                          <TableCell>{item.BoosterEnd || ""}</TableCell>
                          <TableCell>{item.Amount || 0}</TableCell>
                          <TableCell
                            style={{
                              color:
                                item.Status === "ACTIVE"
                                  ? "green"
                                  : item.Status === "PENDING"
                                    ? "red"
                                    : item.Status === "COMPLETED"
                                      ? "blue"
                                      : "gray",
                            }}
                          >
                            {item.Status || ""}
                          </TableCell>
                        </>
                      )}

                      {filtersData.historyType === "ads" && (
                        <>
                          {/* <TableCell>{item.user_id?.userName || ""}</TableCell> */}
                          <TableCell>
                            <Link to={`/user-dashboard/${item.user_id?._id}`} state={{ userName: item?.user_id?.userName }} style={{ textDecoration: 'none', color: 'inherit' }}>
                              {item.user_id?.userName || ""}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {" "}
                            {moment(item?.createdAt).format("lll")
                              ? moment(item?.createdAt).format("lll")
                              : "--"}
                          </TableCell>
                          <TableCell>{item.InitialBalance || 0}</TableCell>
                          <TableCell>{item.Rewardpoints || 0}</TableCell>
                          <TableCell>{item.FinalBalance || 0}</TableCell>
                        </>
                      )}

                      {filtersData.historyType === "task" && (
                        <>
                          {/* <TableCell>{item.user_id?.userName || ""}</TableCell> */}
                          <TableCell>
                            <Link to={`/user-dashboard/${item.user_id?._id}`} state={{ userName: item?.user_id?.userName }} style={{ textDecoration: 'none', color: 'inherit' }}>
                              {item.user_id?.userName || ""}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {" "}
                            {moment(item?.createdAt).format("lll")
                              ? moment(item?.createdAt).format("lll")
                              : "--"}
                          </TableCell>
                          <TableCell>{item.InitialBalance || 0}</TableCell>
                          <TableCell>{item.Rewardpoints || 0}</TableCell>
                          <TableCell>{item.FinalBalance || 0}</TableCell>
                          <TableCell
                            style={{
                              color:
                                item.Status === "ACTIVE"
                                  ? "green"
                                  : item.Status === "PENDING"
                                    ? "red"
                                    : item.Status === "COMPLETED"
                                      ? "blue"
                                      : "gray",
                            }}
                          >
                            {item.Status || ""}
                          </TableCell>
                        </>
                      )}

                      {filtersData.historyType === "dailyReward" && (
                        <>
                          {/* <TableCell>{item.userId?.userName || ""}</TableCell> */}

                          <TableCell>
                            <Link to={`/user-dashboard/${item.userId?._id}`} state={{ userName: item?.userId?.userName }} style={{ textDecoration: 'none', color: 'inherit' }}>
                              {item.userId?.userName || ""}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {" "}
                            {moment(item?.createdAt).format("lll")
                              ? moment(item?.createdAt).format("lll")
                              : "--"}
                          </TableCell>
                          <TableCell>{item.InitialBalance || 0}</TableCell>
                          <TableCell>{item.Reward_Amount || 0}</TableCell>
                          <TableCell>{item.FinalBalance || 0}</TableCell>
                          <TableCell
                            style={{
                              color:
                                item.Status === "CLAIMED"
                                  ? "green"
                                  : item.Status === "PENDING"
                                    ? "red"
                                    : "gray",
                            }}
                          >
                            {item.Status || ""}
                          </TableCell>
                        </>
                      )}

                      {filtersData.historyType === "withdrawals" && (
                        <>
                          {/* <TableCell>{item.userId?.userName || ""}</TableCell> */}
                          <TableCell>
                            <Link to={`/user-dashboard/${item.userId?._id}`} state={{ userName: item?.userId?.userName }} style={{ textDecoration: 'none', color: 'inherit' }}>
                              {item.userId?.userName || ""}
                            </Link>
                          </TableCell>
                          <TableCell>{item.transactionType || ""}</TableCell>
                          <TableCell>
                            {" "}
                            {moment(item?.createdAt).format("lll")
                              ? moment(item?.createdAt).format("lll")
                              : "--"}
                          </TableCell>
                          <TableCell>{item.network || ""}</TableCell>
                          <TableCell>{item.quantity || 0}</TableCell>
                          <TableCell>{item.amount || 0}</TableCell>
                          <TableCell>{item.charge || 0}</TableCell>
                          <TableCell>{item.AfterCharge || 0}</TableCell>
                          <TableCell>{item.Token_Amount || 0}</TableCell>
                          <TableCell>{item.Symbol || ""}</TableCell>
                          <TableCell
                            style={{
                              color:
                                item.status === "APPROVED"
                                  ? "green"
                                  : item.status === "REJECTED"
                                    ? "red"
                                    : item.status === "TRANSFERRED"
                                      ? "blue"
                                      : item.status === "PENDING"
                                        ? "orange"
                                        : "gray", // Default color for other statuses
                            }}
                          >
                            {item.status || ""}
                          </TableCell>
                        </>
                      )}

                      {filtersData.historyType === "referral" && (
                        <>
                          <TableCell>{item.ReferredBy?.userName || ""}</TableCell>
                          {/* <TableCell>{item.userId?.userName || ""}</TableCell> */}

                          <TableCell>
                            <Link to={`/user-dashboard/${item.userId?._id}`} state={{ userName: item?.userId?.userName }} style={{ textDecoration: 'none', color: 'inherit' }}>
                              {item.userId?.userName || ""}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {" "}
                            {moment(item?.createdAt).format("lll")
                              ? moment(item?.createdAt).format("lll")
                              : "--"}
                          </TableCell>
                          <TableCell>{item.InitialBalance || 0}</TableCell>
                          <TableCell>{item.Referral_Amount || 0}</TableCell>
                          <TableCell>{item.FinalBalance || 0}</TableCell>
                        </>
                      )}

                      {!filtersData.historyType && (
                        <>
                          {/* <TableCell>{item.userId?.userName || ""}</TableCell> */}
                          <TableCell>
                            <Link to={`/user-dashboard/${item.userId?._id}`} state={{ userName: item?.userId?.userName }} style={{ textDecoration: 'none', color: 'inherit' }}>
                              {item.userId?.userName || ""}
                            </Link>
                          </TableCell>

                          <TableCell>{item.gameTitle || ""}</TableCell>
                          <TableCell>
                            {" "}
                            {moment(item?.createdAt).format("lll")
                              ? moment(item?.createdAt).format("lll")
                              : "--"}
                          </TableCell>
                          <TableCell>{item.initialbalance || 0}</TableCell>
                          <TableCell>{item.betAmount || 0}</TableCell>
                          <TableCell>{item.prize || 0}</TableCell>
                          <TableCell>{item.finalbalance || 0}</TableCell>
                          <TableCell>{item.highestScore || 0}</TableCell>
                          <TableCell
                            style={{
                              color:
                                item.playedStatus === "WON"
                                  ? "green"
                                  : item.playedStatus === "LOSE"
                                    ? "red"
                                    : "gray",
                            }}
                          >
                            {item.playedStatus || ""}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={headers.length}>
                      <NoDataFound text="No data found!" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Pagination Section */}
      <Box className="pagination" display="flex" justifyContent="center" mt={2}>
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

export default USerHistories;

