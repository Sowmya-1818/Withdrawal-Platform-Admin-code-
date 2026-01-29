import Filtter from "src/component/Filtter";
import {
  Box,
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
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  deleteAPIHandler,
  getAPIHandler,
  putAPIHandler,
} from "src/ApiConfig/service";
import moment from "moment";
import NoDataFound from "src/component/NoDataFound";
import { toast } from "react-hot-toast";
import { IoMdEye } from "react-icons/io";
import { MdBlock, MdDelete, MdEdit } from "react-icons/md";
import ListLoder from "src/component/ListLoder";
import GoBack from "src/component/GoBack";
import ContactUsModal from "src/component/ContactUsModal";
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

function UserManagement() {
  let filterData = {};
  const classes = useStyles();
  const history = useNavigate();
  const [userData, setUserData] = useState([]);
  const [isUserUpdating, setIsUserUpdating] = useState(true);
  const [page, setPage] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openBlockUnblockModal, setOpenBlockUnblockModal] = useState(false);
  const [isEnterpriseDeleting, setIsEnterpriseDeleting] = useState(false);
  const [blockUnblockId, setBlockUnblockId] = useState("");
  const [blockStatus, setBlockStatus] = useState("");
  const [isUserBlocking, setIsUserBlocking] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [deleteId, setDeleteId] = useState("");
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
  const [reasonData, setReasonData] = useState({
    reason: "",
  });
  const [error, setError] = useState("");

  const userManagementApi = async (source) => {
    try {
      filterData = {
        search: filtersData?.search ? filtersData?.search : null,
        fromDate: filtersData.fromDate
          ? moment(filtersData.fromDate).format("YYYY-MM-DD")
          : null,
        toDate: filtersData.toDate
          ? moment(filtersData.toDate).format("YYYY-MM-DD")
          : null,
        status1: filtersData?.status !== "ALL" ? filtersData?.status : null,
      };
      const response = await getAPIHandler({
        endPoint: "userList",
        paramsData: {
          page: page,
          limit: 10,
          ...filterData,
        },
        source: source,
      });
      console.log(response, "response from userManagementApi");

      if (response.data.responseCode === 200) {
        setUserData(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setUserData([]);
      }
      setIsClear(false);
      setIsUserUpdating(false);
    } catch (error) {
      setIsClear(false);
      setUserData([]);
      setIsUserUpdating(false);
    }
  };

  const blockUnblockUserApi = async (values) => {
    try {
      setIsUserBlocking(true);
      const response = await putAPIHandler({
        endPoint: "activeBlockUser",
        paramsData: {
          userId: blockUnblockId,
          reason: blockStatus === "ACTIVE" ? reasonData?.reason : undefined,
        },
      });

      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        setOpenBlockUnblockModal(false);
        userManagementApi();
        setPage(1);

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
  const deleteUserApi = async (values) => {
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
        userManagementApi();
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
    userManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [page]);
  useEffect(() => {
    if (isClear) {
      userManagementApi();
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

  console.log(userData, "userData");

  const handleChange = (e) => {
    const value = e.target.value;
    setReasonData({ ...reasonData, reason: value });
    console.log("value===->>>", value);
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
      <GoBack title={"User Management"} />
      <Box mt={3} mb={3}>
        <Paper elevation={3}>
          <Filtter
            filter={filtersData}
            setFilter={setFiltersData}
            clearFilters={handleClearFilter}
            onClickFun={userManagementApi}
            type="user"
            placeholder="Search by email."
            filterData={{ ...filterData, limit: noOfPages.totalPages }}
            excelTableName="Usermanagement"
            apiEndPoint="userList"
          />
        </Paper>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Sr.No",
                // "Email",
                // "First Name",
                "User Name",
                "Status",
                "Registration Date & Time",
                "Action",
              ].map((item) => {
                return <TableCell>{item}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {userData &&
              userData?.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                  {/* <TableCell>{item?. _id || "..."}</TableCell> */}
                  {/* <TableCell>{item?.email || "..."}</TableCell>
                  <TableCell>{item?.firstName || "..."}</TableCell> */}
                  {/* <TableCell>{item?.userName || "..."}</TableCell> */}
                  <TableCell>
                    <Link to={`/user-dashboard/${item?._id}`}  state={{ userName: item?.userName }} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {item?.userName || ""}
                    </Link>
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
                    {" "}
                    {moment(item?.createdAt).format("lll")
                      ? moment(item?.createdAt).format("lll")
                      : "--"}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Tooltip title="View User Details" arrow>
                        <IconButton>
                          <IoMdEye
                            onClick={() =>
                              history("/view-user", {
                                state: {
                                  type: "VIEW",
                                  userId: item?._id,
                                },
                              })
                            }
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit User Details" arrow>
                        <IconButton
                          onClick={() => {
                            history("/view-user", {
                              state: {
                                userId: item?._id,
                                type: "EDIT",
                              },
                            });
                          }}
                          disabled={item.status === "BLOCK"}
                        >
                          <MdEdit />
                        </IconButton>
                      </Tooltip>
                      {/* <Tooltip title="Delete User" arrow>
                        <IconButton
                          disabled={item.status === "BLOCK"}
                          onClick={() => {
                            handleOpenDeleteModal(item?._id);
                          }}
                        >
                          <MdDelete />
                        </IconButton>
                      </Tooltip> */}
                      <Tooltip title="Block Unblock User" arrow>
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
        {isUserUpdating &&
          [1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => {
            return <ListLoder />;
          })}
        {!isUserUpdating && userData && userData?.length === 0 && (
          <NoDataFound text={"No user data found!"} />
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
            title={`${blockStatus === "BLOCK" ? "Unblock user" : "Block user"}`}
            desc={`Are you sure about to ${blockStatus === "BLOCK" ? "unblock" : "block"
              } this user?`}
            error={error}
            handleBlur={handleBlur}
            handleSubmit={(item) => {
              if (blockStatus === "ACTIVE") {
                handleChange({ target: { value: reasonData?.reason } });
                if (error == "" && reasonData.reason !== "") {
                  blockUnblockUserApi(item);
                }
              } else {
                blockUnblockUserApi(item);
              }
            }}
            status={blockStatus}
          />
        )}
        {/* {openDeleteModal && (
          <ConfirmationModal
            open={openDeleteModal}
            isLoading={isEnterpriseDeleting}
            handleClose={() => {
              setOpenDeleteModal(false);
            }}
            title={"Delete"}
            desc={"Are you sure you want to delete this user?"}
            handleSubmit={(item) => deleteUserApi(item)}
          />
        )} */}
      </TableContainer>
      {!isUserUpdating &&
        userData?.length > 0 &&
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
    </Box>
  );
}

export default UserManagement;
