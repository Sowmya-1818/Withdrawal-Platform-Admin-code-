import Filtter from "src/component/Filtter";
import {
  Box,
  Button,
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
import GoBack from "src/component/GoBack";
import ListLoder from "src/component/ListLoder";
import PageLoading from "src/component/PageLoading";
import ContactUsModal from "src/component/ContactUsModal";

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
function SubAdminManagement() {
  let filterData = {};
  const classes = useStyles();
  const history = useNavigate();
  const [subAdminData, setSubAdminData] = useState([]);
  const [isSubAdminUpdating, setIsSubAdminUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isEnterpriseDeleting, setIsEnterpriseDeleting] = useState(false);
  const [openBlockUnblockModal, setOpenBlockUnblockModal] = useState(false);
  const [blockUnblockId, setBlockUnblockId] = useState("");
  const [blockStatus, setBlockStatus] = useState("");
  const [isUserBlocking, setIsUserBlocking] = useState(false);
  const [isUpdatingView, setIsUpdatingView] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [error, setError] = useState("");
  const [reasonData, setReasonData] = useState({
    reason: "",
  });
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });
  const [filtersData, setFiltersData] = useState({
    fromDate: null,
    toDate: null,
    search: "",
    status: "ALL",
  });

  const subAdminManagementApi = async (source) => {
    try {
      setSubAdminData([]);
      setIsSubAdminUpdating(true);
      filterData = {
        search: filtersData?.search ? filtersData?.search : null,
        fromDate: filtersData.fromDate
          ? moment(filtersData.fromDate).format("YYYY-MM-DD")
          : null,
        toDate: filtersData.toDate
          ? moment(filtersData.toDate).format("YYYY-MM-DD")
          : null,
        status: filtersData?.status !== "ALL" ? filtersData?.status : null,
      };
      const response = await getAPIHandler({
        endPoint: "listSubAdmin",
        paramsData: {
          page: page,
          limit: 10,
          ...filterData,
        },
        source: source,
      });

      if (response.data.responseCode === 200) {
        setSubAdminData(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setSubAdminData([]);
      }
      setIsClear(false);
      setIsSubAdminUpdating(false);
    } catch (error) {
      setIsClear(false);
      setSubAdminData([]);
      setIsSubAdminUpdating(false);
    }
  };

  const blockUnblockSubAdminApi = async (values) => {
    try {
      setIsUserBlocking(true);
      const response = await putAPIHandler({
        endPoint: "blockUnblockSubAdmin",
        paramsData: {
          userId: blockUnblockId,
          reason: blockStatus === "ACTIVE" ? reasonData?.reason : undefined,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        setOpenBlockUnblockModal(false);
        subAdminManagementApi();
        setReasonData({
          ...reasonData,
          ["reason"]: "",
        });
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
  const deleteSubAdminApi = async (values) => {
    try {
      setIsEnterpriseDeleting(true);
      const response = await deleteAPIHandler({
        endPoint: "deleteUser",
        paramsData: {
          userId: deleteId,
        },
      });

      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        setOpenDeleteModal(false);
        subAdminManagementApi();
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
    subAdminManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [page]);
  useEffect(() => {
    if (isClear) {
      subAdminManagementApi();
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
  const handleOpenBlockUnblockModal = (data, status) => {
    setOpenBlockUnblockModal(true);
    setBlockUnblockId(data);
    setBlockStatus(status);
  };
  const handleOpenDeleteModal = (data) => {
    setOpenDeleteModal(true);
    setDeleteId(data);
  };
  const handleChange = (e) => {
    const value = e.target.value;
    setReasonData({ ...reasonData, reason: value });
    console.log("value", value);
    const errorMsg =
      value.trim() == ""
        ? "Reason is required."
        : value.length < 3
        ? "Reason must be at least 3 characters long."
        : value.length > 600
        ? "Exceeded maximum character limit (600)."
        : "";
    setError(errorMsg);
  };
  const handleBlur = () => {
    handleChange({ target: { value: reasonData?.reason } });
  };
  return (
    <Box className={classes.main}>
      {isUpdatingView ? (
        <PageLoading />
      ) : (
        <>
          <Box className="displaySpacebetween">
            <GoBack title={"Sub Admin Management"} />
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  history("/add-sub-admin", {
                    state: {
                      type: "ADD",
                    },
                  });
                }}
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
                onClickFun={subAdminManagementApi}
                type="user"
                placeholder="Search by email."
                filterData={{ ...filterData, limit: noOfPages.totalPages }}
                excelTableName="SubAdminmanagement"
                apiEndPoint="listSubAdmin"
              />
            </Paper>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Sr.No",
                    "First Name",
                    "Last Name",
                    "Email",
                    "Registration Date & Time",
                    "Status",
                    "Action",
                  ].map((item) => {
                    return <TableCell>{item}</TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {subAdminData &&
                  subAdminData?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                      <TableCell>
                        {item?.firstName.slice(0, 30)}{" "}
                        {item?.firstName.length > 30 && "..."}
                      </TableCell>
                      <TableCell>
                        {item?.lastName.slice(0, 30)}{" "}
                        {item?.lastName.length > 30 && "..."}
                      </TableCell>
                      <TableCell>
                        {item && item?.email ? item?.email : "--"}
                      </TableCell>

                      <TableCell>
                        {moment(item?.createdAt).format("lll")
                          ? moment(item?.createdAt).format("lll")
                          : "--"}
                      </TableCell>
                      <TableCell
                        style={
                          item?.status == "BLOCK"
                            ? { color: "red" }
                            : { color: "green" }
                        }
                      >
                        {item?.status}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Tooltip title="View Sub Admin" arrow>
                            <IconButton
                              onClick={() =>
                                history("/add-sub-admin", {
                                  state: {
                                    subAdminId: item?._id,
                                    type: "VIEW",
                                  },
                                })
                              }
                            >
                              <IoMdEye />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Sub Admin" arrow>
                            <IconButton
                              onClick={() => {
                                history("/add-sub-admin", {
                                  state: {
                                    subAdminId: item?._id,
                                    type: "EDIT",
                                  },
                                });
                              }}
                              disabled={item.status === "BLOCK"}
                            >
                              <MdEdit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Sub Admin" arrow>
                            <IconButton
                              disabled={item.status === "BLOCK"}
                              onClick={() => {
                                handleOpenDeleteModal(item?._id);
                              }}
                            >
                              <MdDelete />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Block Unblock Sub Admin" arrow>
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
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {isSubAdminUpdating &&
              [1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => {
                return <ListLoder />;
              })}
            {!isSubAdminUpdating &&
              subAdminData &&
              subAdminData?.length === 0 && (
                <NoDataFound text={"No category data found!"} />
              )}

            {openBlockUnblockModal && (
              <ContactUsModal
                open={openBlockUnblockModal}
                isLoading={isUserBlocking}
                handleClose={() => {
                  setOpenBlockUnblockModal(false);
                }}
                filter={reasonData}
                setFilter={(data) => {
                  setReasonData(data);
                }}
                type="reason"
                title={`${
                  blockStatus === "BLOCK"
                    ? "Unblock sub-admin"
                    : "Block sub-admin"
                }`}
                error={error}
                handleBlur={handleBlur}
                desc={`Are you sure about to ${
                  blockStatus === "BLOCK" ? "unblock" : "block"
                } this sub-admin?`}
                handleSubmit={(item) => {
                  if (blockStatus === "ACTIVE") {
                    handleChange({ target: { value: reasonData?.reason } });
                    if (error == "" && reasonData.reason !== "") {
                      blockUnblockSubAdminApi(item);
                    }
                  } else {
                    blockUnblockSubAdminApi(item);
                  }
                }}
                status={blockStatus}
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
                desc={"Are you sure you want to delete this sub-admin?"}
                handleSubmit={(item) => deleteSubAdminApi(item)}
              />
            )}
          </TableContainer>
          {!isSubAdminUpdating &&
            subAdminData?.length > 0 &&
            noOfPages?.totalPages > (page === 1 ? 10 : 0) && (
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
        </>
      )}
    </Box>
  );
}

export default SubAdminManagement;
