import Filtter from "src/component/Filtter";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  Typography,
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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  deleteAPIHandler,
  getAPIHandler,
  putAPIHandler,
} from "src/ApiConfig/service";
import moment from "moment";
import NoDataFound from "src/component/NoDataFound";
import { toast } from "react-hot-toast";
import ConfirmationModal from "src/component/ConfirmationModal";
import { MdBlock, MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import ListLoder from "src/component/ListLoder";
import GoBack from "src/component/GoBack";

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
function TicketManagement() {
  let filterData = {};
  const classes = useStyles();
  const history = useNavigate();
  const [ticketData, setTicketData] = useState([]);
  const [isClear, setIsClear] = useState(false);
  const [isTicketUpdating, setIsTicketUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isEnterpriseDeleting, setIsEnterpriseDeleting] = useState(false);
  const [openBlockUnblockModal, setOpenBlockUnblockModal] = useState(false);
  const [blockUnblockId, setBlockUnblockId] = useState("");
  const [blockStatus, setBlockStatus] = useState("");
  const [isUserBlocking, setIsUserBlocking] = useState(false);
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });
  const [filtersData, setFiltersData] = useState({
    fromDate: null,
    toDate: null,
    search: "",
    status: "",
  });
  const ticketManagementApi = async (source) => {
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
      };
      const response = await getAPIHandler({
        endPoint: "getTickets",
        paramsData: {
          page: page,
          limit: 10,
          ...filterData,
        },
        source: source,
      });
      if (response.data.responseCode === 200) {
        setTicketData(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setTicketData([]);
      }
      setIsClear(false);
      setIsTicketUpdating(false);
    } catch (error) {
      setIsClear(false);
      setTicketData([]);
      setIsTicketUpdating(false);
    }
  };

  const blockUnblockTicketApi = async (values) => {
    try {
      setIsUserBlocking(true);
      const response = await putAPIHandler({
        endPoint: "blockTicket",
        paramsData: {
          ticketId: blockUnblockId,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        setOpenBlockUnblockModal(false);
        ticketManagementApi();
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUserBlocking(false);
    } catch (error) {
      setIsUserBlocking(false);
      console.log(error);
      toast.error(error.response.data.responseMessage);
    }
  };
  const deleteEnterpriseApi = async (values) => {
    try {
      setIsEnterpriseDeleting(true);
      const response = await deleteAPIHandler({
        endPoint: "deleteTicket",
        paramsData: {
          ticketId: deleteId,
        },
      });

      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        setOpenDeleteModal(false);
        ticketManagementApi();
        setPage(1);
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsEnterpriseDeleting(false);
    } catch (error) {
      setIsEnterpriseDeleting(false);
      console.log(error);
      toast.error(error.response.data.responseMessage);
    }
  };
  useEffect(() => {
    const source = axios.CancelToken.source();
    ticketManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [page]);

  useEffect(() => {
    if (isClear) {
      ticketManagementApi();
    }
  }, [isClear]);

  const handleClearFilter = () => {
    setFiltersData({
      ...filtersData,
      ["fromDate"]: null,
      ["toDate"]: null,
      ["search"]: "",
      ["status"]: "",
    });
    setIsClear(true);
  };
  const handleOpenBlockUnblockModal = (data, status) => {
    setOpenBlockUnblockModal(true);
    setBlockUnblockId(data);
    setBlockStatus(status);
  };
  const handleOpenDeleteModal = (data) => {
    setOpenDeleteModal(true);
    setDeleteId(data);
  };
  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title={"Ticket Management"} />
        {/* <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history("/add-ticket", {
                state: {
                  type: "ADD",
                },
              });
            }}
          >
            Add
          </Button>
        </Box> */}
      </Box>
      {/* <Box mt={3} mb={3}>
        <Paper elevation={3}>
          <Filtter
            filter={filtersData}
            setFilter={(data) => {
              setFiltersData(data);
            }}
            clearFilters={handleClearFilter}
            onClickFun={ticketManagementApi}
            type="else"
            placeholder="Search by game title."
            filterData={{ ...filterData, limit: noOfPages.totalPages }}
            excelTableName="Ticketmanagement"
            apiEndPoint="getTickets"
          />
        </Paper>
      </Box> */}

      <Grid container>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Sr.No",
                    // "Game Title",
                    "Ticket Amount",
                    "Date & Time",
                    // "Status",
                    "Action",
                  ].map((item) => {
                    return <TableCell>{item}</TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {ticketData &&
                  ticketData?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{(page - 1) * 10 + i + 1}</TableCell>

                      {/* <TableCell>
                        {item && item?.gameId?.gameTitle
                          ? item?.gameId?.gameTitle
                          : "--"}
                      </TableCell> */}

                      <TableCell>
                        {item && item?.amountInToken
                          ? item?.amountInToken
                          : "--"}
                      </TableCell>

                      <TableCell>
                        {" "}
                        {moment(item?.createdAt).format("lll")
                          ? moment(item?.createdAt).format("lll")
                          : "--"}
                      </TableCell>
                      {/* <TableCell
                        style={
                          item?.status == "BLOCK"
                            ? { color: "red" }
                            : { color: "green" }
                        }
                      >
                        {item?.status}
                      </TableCell> */}
                      <TableCell>
                        <Box>
                          <Tooltip title="View Category" arrow>
                            <IconButton
                              onClick={() =>
                                history("/add-ticket", {
                                  state: {
                                    ticketId: item?._id,
                                    type: "VIEW",
                                  },
                                })
                              }
                            >
                              <IoMdEye />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Category" arrow>
                            <IconButton
                              onClick={() => {
                                history("/add-ticket", {
                                  state: {
                                    ticketId: item?._id,
                                    type: "EDIT",
                                  },
                                });
                              }}
                              disabled={item.status === "BLOCK"}
                            >
                              <MdEdit />
                            </IconButton>
                          </Tooltip>
                          {/* <Tooltip title="Delete Ticket" arrow>
                            <IconButton
                              disabled={item.status === "BLOCK"}
                              onClick={() => {
                                handleOpenDeleteModal(item?._id);
                              }}
                            >
                              <MdDelete />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Block Unblock Category" arrow>
                            <IconButton
                              style={
                                item?.status == "BLOCK"
                                  ? { color: "red" }
                                  : { color: "green" }
                              }
                              onClick={() => {
                                handleOpenBlockUnblockModal(
                                  item?._id,
                                  item?.status
                                );
                              }}
                            >
                              <MdBlock />
                            </IconButton>
                          </Tooltip> */}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {isTicketUpdating &&
              [1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => {
                return <ListLoder />;
              })}
            {!isTicketUpdating && ticketData && ticketData?.length === 0 && (
              <NoDataFound text={"No category data found!"} />
            )}

            {openBlockUnblockModal && (
              <ConfirmationModal
                open={openBlockUnblockModal}
                isLoading={isUserBlocking}
                handleClose={() => {
                  setOpenBlockUnblockModal(false);
                }}
                title={`${
                  blockStatus === "BLOCK" ? "Unblock ticket" : "Block ticket"
                }`}
                desc={`Are you sure about to ${
                  blockStatus === "BLOCK" ? "unblock" : "block"
                } this ticket?`}
                handleSubmit={(item) => blockUnblockTicketApi(item)}
              />
            )}
            {openDeleteModal && (
              <ConfirmationModal
                open={openDeleteModal}
                isLoading={isEnterpriseDeleting}
                handleClose={() => {
                  setOpenDeleteModal(false);
                }}
                title={"Delete"}
                desc={"Are you sure you want to delete this ticket?"}
                handleSubmit={(item) => deleteEnterpriseApi(item)}
              />
            )}
          </TableContainer>
          {!isTicketUpdating &&
            ticketData &&
            ticketData.length >= (page === 1 ? 10 : 0) && (
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
        </Grid>
      </Grid>
      <Box mt={1}>
        <Typography variant="body2">
          1 Ticket = {ticketData?.amountInToken} Solana
        </Typography>
      </Box>
    </Box>
  );
}

export default TicketManagement;
