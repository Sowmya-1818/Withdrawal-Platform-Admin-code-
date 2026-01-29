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
import { deleteAPIHandler, getAPIHandler, getAPIHandlertetris, getAPIHandlerspin, putAPIHandler } from "src/ApiConfig/service";
import moment from "moment";
import { toast } from "react-hot-toast";
import { MdBlock, MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";

import Filtter from "src/component/Filtter";
import NoDataFound from "src/component/NoDataFound";
import ListLoder from "src/component/ListLoder";
import GoBack from "src/component/GoBack";
import ConfirmationModal from "src/component/ConfirmationModal";
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

function TransferWithdrawalsspinsol() {
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
    const [isDownloading, setIsDownloading] = useState(false);

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
                page, // <-- Add this line
                limit: 10, // <-- Add this line (or use your preferred page size)
                status: "transferred",
                token: "SOL",
            };
            console.log(filterData, 'filterDatatetris');

            const tokendata = window.sessionStorage.getItem("tetris");
            console.log(tokendata, 'tokendata');

            const response = await getAPIHandlertetris({
                endPoint: "getallwithdrawstatusTetris",
                tokenDATA: tokendata,
                paramsData: filterData,

                source,
            });
            console.log(response, "response from COMPLETED History");
            if (response?.status === 200) {
                const withdrawals = Array.isArray(response.data.withdrawals)
                    ? response.data.withdrawals.filter((w) => (w.token || "").toUpperCase() === "SOL")
                    : [];
                // setGameData(response.data.withdrawals);
                setGameData(withdrawals);
                setNoOfPages({
                    pages: response.data.totalPages, // total number of pages
                    total: response.data.count,      // total number of items
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

    const fetchAllTransferredWithdrawals = async () => {
        const tokendata = window.sessionStorage.getItem("tetris");
        let currentPage = 1;
        const aggregatedData = [];

        while (true) {
            const response = await getAPIHandlertetris({
                endPoint: "getallwithdrawstatusTetris",
                tokenDATA: tokendata,
                paramsData: {
                    page: currentPage,
                    limit: 100,
                    status: "transferred",
                    token: "SOL",
                },
            });

            if (!response || !response.data) {
                break;
            }

            const pageData = Array.isArray(response.data.withdrawals) 
                ? response.data.withdrawals.filter((w) => (w.token || "").toUpperCase() === "SOL") 
                : [];
            aggregatedData.push(...pageData);

            const totalPages = Number(response.data.totalPages);
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
            const data = await fetchAllTransferredWithdrawals();

            if (!Array.isArray(data) || data.length === 0) {
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

            XLSX.utils.book_append_sheet(workbook, worksheet, "Transfer Withdrawals Tetris SOL");
            XLSX.writeFile(workbook, "Transfer_Withdrawals_Tetris_SOL.xlsx");
            toast.success("Excel file downloaded successfully!");
        } catch (error) {
            console.error("Error generating Excel file:", error);
            toast.error("Failed to download Excel");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Box className={classes.main}>
            <Box className="displaySpacebetween">
                <GoBack title="Transfer Withdrawals Tetris SOL" />
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

                        excelTableName="Transfer Withdrawals Tetris sol"
                        apiEndPoint="Pending"
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
                                        "Initiated At",
                                        "Updated At",
                                        "Amount",
                                        "USDT Amount",
                                        "Charge",
                                        "After Charge",
                                        "Token",
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
                                                {item.username || "Anonymous"}
                                                {/* <Link to={`/user-dashboard/${item.id}`} state={{ username: item.username }} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    {item.username || "Anonymous"}
                                                </Link> */}
                                            </TableCell>
                                            <TableCell>{item.walletAddress}</TableCell>
                                            {/* <TableCell>{item.createdAt}</TableCell> */}
                                            <TableCell>
                                                {" "}
                                                {moment(item?.createdAt).format("lll")
                                                    ? moment(item?.createdAt).format("lll")
                                                    : "--"}
                                            </TableCell>
                                             <TableCell>
                                                {" "}
                                                {moment(item?.updatedAt).format("lll")
                                                    ? moment(item?.updatedAt).format("lll")
                                                    : "--"}
                                            </TableCell>
                                            <TableCell>{item.amount}</TableCell>
                                            <TableCell>{item.USDT_Amount}</TableCell>
                                            <TableCell>{item.charge}</TableCell>
                                            <TableCell>{item.After_Charge ? parseFloat(item.After_Charge).toFixed(4) : "0.0000"}</TableCell>
                                            <TableCell>{item.token}</TableCell>
                                            <TableCell
                                                style={
                                                    item?.status == "reject"
                                                        ? { color: "red" }
                                                        : item?.status == "pending"
                                                            ? { color: "orange" }
                                                            : item?.status == "transferred"
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

                </Grid>
            </Grid>
            <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                    count={noOfPages.pages} // total pages
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    shape="rounded"
                    color="primary"
                />
            </Box>
        </Box>
    );
}

export default TransferWithdrawalsspinsol;
