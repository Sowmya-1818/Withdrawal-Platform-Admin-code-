import Filtter from "src/component/Filtter";
import {
  Box,
  Button,
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
  Typography,
  Checkbox,
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
  buttonClass: {
    "&.MuiButton-contained.Mui-disabled": {
      color: "rgb(97 89 89 / 26%) !important",
      boxShadow: "none",
      backgroundColor: "rgba(0, 0, 0, 0.12)",
      border: "1px solid #3b36369e !important",
    },
  },
}));
function BlackListUserManagement() {
  let filterData = {};
  const classes = useStyles();
  const history = useNavigate();
  const [ticketData, setTicketData] = useState([]);
  const [isClear, setIsClear] = useState(false);
  const [isTicketUpdating, setIsTicketUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [tabButton, setTabButton] = useState("username");
  const [isEnterpriseDeleting, setIsEnterpriseDeleting] = useState(false);
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });
  const [filtersData, setFiltersData] = useState({
    fromDate: null,
    toDate: null,
    search: "",
  });
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (id) => {
    if (id === "selectAll") {
      if (selectedItems.length === ticketData.length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(ticketData.map((item) => item._id));
      }
    } else {
      if (selectedItems.includes(id)) {
        setSelectedItems(selectedItems.filter((item) => item !== id));
      } else {
        setSelectedItems([...selectedItems, id]);
      }
    }
  };
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
        ...(tabButton === "BlockUsers" && {
          status1: "BLOCK",
          userType1: "USER",
        }),
      };
      const response = await getAPIHandler({
        endPoint:
          tabButton === "BlockUsers"
            ? "userList"
            : tabButton === "email"
            ? "approvedEmail"
            : "listBlockedUserName",
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

  const deleteSelectedItems = async (values) => {
    try {
      setIsEnterpriseDeleting(true);
      const response = await deleteAPIHandler({
        endPoint: "deleteSelectedUserName",
        dataToSend: {
          userNameId: tabButton === "username" ? selectedItems : undefined,
          emailId: tabButton === "email" ? selectedItems : undefined,
        },
      });

      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        setOpenDeleteModal(false);
        ticketManagementApi();
        setSelectedItems([]);
        handleCloseConfirmationModal();
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
  const UnBlockSelectedUsers = async (values) => {
    try {
      setIsEnterpriseDeleting(true);
      const response = await putAPIHandler({
        endPoint: "activeSelectedUser",
        paramsData: {
          selectedId: selectedItems,
        },
      });

      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        ticketManagementApi();
        setSelectedItems([]);
        handleCloseConfirmationModal1();
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
  }, [page, tabButton]);

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
    });
    setIsClear(true);
  };

  const handleOpenDeleteModal = (data) => {
    setOpenDeleteModal(true);
    setDeleteId(data);
  };
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  const handleOpenConfirmationModal = () => {
    setOpenConfirmationModal(true);
  };

  const handleCloseConfirmationModal = () => {
    setOpenConfirmationModal(false);
  };
  const [openConfirmationModal1, setOpenConfirmationModal1] = useState(false);

  const handleOpenConfirmationModal1 = () => {
    setOpenConfirmationModal1(true);
  };

  const handleCloseConfirmationModal1 = () => {
    setOpenConfirmationModal1(false);
  };
  useEffect(() => {
    setSelectedItems([]);
  }, [tabButton]);

  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title={"Blacklist Username Management"} />
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history("/add-blacklist")}
          >
            Add
          </Button>
        </Box>
      </Box>
      <Box mt={3} mb={3}>
        <Paper elevation={3}>
          <Filtter
            filter={filtersData}
            setFilter={setFiltersData}
            clearFilters={handleClearFilter}
            onClickFun={ticketManagementApi}
            type="else2"
            placeholder={`Search by ${
              tabButton == "email" ? "email" : "username"
            }.`}
            filterData={{ ...filterData, limit: noOfPages.totalPages }}
            excelTableName={
              tabButton == "email"
                ? "Registeredemail"
                : "BlacklistUsermanagement"
            }
            apiEndPoint={
              tabButton == "email" ? "approvedEmail" : "listBlockedUserName"
            }
          />
        </Paper>
      </Box>

      <Grid container>
        <Grid item xs={12}>
          <Box className="displaySpacebetween">
            <Box className="displayStart" style={{ gap: "5px" }}>
              <Button
                variant="contained"
                color={tabButton == "username" ? "primary" : "secondary"}
                onClick={() => setTabButton("username")}
              >
                Username
              </Button>
              <Button
                variant="contained"
                color={tabButton == "email" ? "primary" : "secondary"}
                onClick={() => setTabButton("email")}
              >
                Invited Email
              </Button>
              <Button
                variant="contained"
                color={tabButton == "BlockUsers" ? "primary" : "secondary"}
                onClick={() => setTabButton("BlockUsers")}
              >
                Blocked Users
              </Button>
            </Box>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Sr.No",
                    tabButton === "email"
                      ? "Registered Email"
                      : tabButton === "BlockUsers"
                      ? "Blocked Email"
                      : "Blacklist Username",
                    "Date & Time",
                    tabButton === "BlockUsers" ? (
                      <>
                        {ticketData?.length > 0 ? (
                          <>
                            Unblock All
                            <Tooltip title="Select All">
                              <Checkbox
                                checked={
                                  selectedItems.length === ticketData.length
                                }
                                onChange={() =>
                                  handleCheckboxChange("selectAll")
                                }
                                style={{ color: "#fff" }}
                              />
                            </Tooltip>
                          </>
                        ) : (
                          <>Action</>
                        )}
                      </>
                    ) : (
                      <>
                        {ticketData?.length > 0 ? (
                          <>
                            Delete All
                            <Tooltip title="Select All">
                              <Checkbox
                                checked={
                                  selectedItems.length === ticketData.length
                                }
                                onChange={() =>
                                  handleCheckboxChange("selectAll")
                                }
                                style={{ color: "#fff" }}
                              />
                            </Tooltip>
                          </>
                        ) : (
                          <>Action</>
                        )}
                      </>
                    ),
                  ].map((item, index) => (
                    <TableCell key={index}>{item}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {ticketData &&
                  ticketData?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                      {tabButton === "BlockUsers" ? (
                        <TableCell>{item?.email || "..."}</TableCell>
                      ) : (
                        <TableCell>
                          {item?.userName || item?.email || "..."}
                        </TableCell>
                      )}

                      <TableCell>
                        {moment(item?.created).format("lll")}
                      </TableCell>
                      <TableCell>
                        {tabButton == "BlockUsers" ? (
                          <>
                            <Checkbox
                              checked={selectedItems.includes(item._id)}
                              onChange={() => handleCheckboxChange(item._id)}
                            />
                          </>
                        ) : (
                          <>
                            <Checkbox
                              checked={selectedItems.includes(item._id)}
                              onChange={() => handleCheckboxChange(item._id)}
                            />
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                {ticketData?.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      {tabButton == "BlockUsers" ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          disabled={selectedItems.length === 0}
                          onClick={handleOpenConfirmationModal1}
                          className={classes.buttonClass}
                        >
                          {selectedItems?.length > 1
                            ? "Unblock All"
                            : "Unblock"}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="secondary"
                          disabled={selectedItems.length === 0}
                          onClick={handleOpenConfirmationModal}
                          className={classes.buttonClass}
                        >
                          {selectedItems?.length > 1 ? " Delete All" : "Delete"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {isTicketUpdating &&
              [1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => {
                return <ListLoder />;
              })}
            {!isTicketUpdating && ticketData && ticketData?.length === 0 && (
              <NoDataFound text={"No data found!"} />
            )}

            {openConfirmationModal && (
              <ConfirmationModal
                open={openConfirmationModal}
                isLoading={isEnterpriseDeleting}
                handleClose={handleCloseConfirmationModal}
                title={"Delete"}
                desc="Are you sure you want to delete?"
                handleSubmit={(item) => deleteSelectedItems(item)}
              />
            )}
            {openConfirmationModal1 && (
              <ConfirmationModal
                open={openConfirmationModal1}
                isLoading={isEnterpriseDeleting}
                handleClose={handleCloseConfirmationModal1}
                title={"Unblock"}
                desc="Are you sure you want to Unblock?"
                handleSubmit={(item) => UnBlockSelectedUsers(item)}
              />
            )}
          </TableContainer>
          {!isTicketUpdating &&
            noOfPages.totalPages > (page === 1 ? 10 : 0) && (
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
    </Box>
  );
}

export default BlackListUserManagement;
