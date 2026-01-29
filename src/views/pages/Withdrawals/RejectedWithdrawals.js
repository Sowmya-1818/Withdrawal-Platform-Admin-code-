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
import { useNavigate, Link } from "react-router-dom";
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
function RejectedWithdrawals() {
  let filterData = {};
  const classes = useStyles();
  const history = useNavigate();
  const [gameData, setGameData] = useState([]);
  const [isGameUpdating, setIsGameUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isEnterpriseDeleting, setIsEnterpriseDeleting] = useState(false);
  const [openBlockUnblockModal, setOpenBlockUnblockModal] = useState(false);
  const [blockUnblockId, setBlockUnblockId] = useState("");
  const [blockStatus, setBlockStatus] = useState("");
  const [isUserBlocking, setIsUserBlocking] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [isCategoryUpdating, setIsCategoryUpdating] = useState(false);


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

  const categoryManagementApi = async (source) => {
    try {
      filterData = {
        search: filtersData?.search ? filtersData?.search : null,
        fromDate: filtersData.fromDate
          ? moment(filtersData.fromDate).format("YYYY-MM-DD")
          : null,
        toDate: filtersData.toDate
          ? moment(filtersData.toDate).format("YYYY-MM-DD")
          : null,
        // status: filtersData?.status !== "ALL" ? filtersData?.status : undefined,
      };


      console.log(page, 'page');

      const response = await getAPIHandler({
        endPoint: "transactionHistory",
        paramsData: {
          page: page,
          limit: 10,
          status: "REJECTED",
          ...filterData,
        },
        source: source,
      });
      console.log(response, "response from rejected History");

      if (response.data.responseCode === 200) {
        // Filter the data where status is "REJECT"
        const rejectedWithdrawals = response.data.result.docs


        console.log(rejectedWithdrawals, "rejectedWithdrawals");

        setIsClear(false);
        setCategoryData(rejectedWithdrawals);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setCategoryData([]);
      }

      setIsClear(false);
      setIsCategoryUpdating(false);
    } catch (error) {
      console.error(error, "Error fetching rejected withdrawals");
      setIsClear(false);
      setCategoryData([]);
      setIsCategoryUpdating(false);
    }
  };


  useEffect(() => {
    const source = axios.CancelToken.source();
    categoryManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [page]);

  useEffect(() => {
    if (isClear) {
      categoryManagementApi();
    }
  }, [isClear]);

  const blockUnblockCategoryApi = async (values) => {
    try {
      setIsUserBlocking(true);
      const response = await putAPIHandler({
        endPoint: "activeDeactiveGame",
        dataToSend: {
          _id: blockUnblockId,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        setOpenBlockUnblockModal(false);
        // gameManagementApi();
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
        endPoint: "deletegame",
        dataToSend: {
          _id: deleteId,
        },
      });

      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        setOpenDeleteModal(false);
        // gameManagementApi();
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
    // gameManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [page]);

  const editCategoryApi = async (values) => {
    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append("gameTitle", values.gameTitle);
      formData.append("gamePic", values.gamePic);
      formData.append("gameDetails", values.gameDetails);
      formData.append("category", values.category);
      formData.append("_id", values?._id);
      formData.append("latest", values.latest ? false : true);

      const response = await putAPIHandler({
        endPoint: "editgame",
        dataToSend: formData,
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        // gameManagementApi();
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
      console.log(error);
      toast.error(error.response.data.responseMessage);
    }
  };

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
        <GoBack title={"Rejected Withdrawals"} />

      </Box>
      <Box mt={3} mb={3}>
        <Paper elevation={3}>
          <Filtter
            filter={filtersData}
            setFilter={setFiltersData}
            clearFilters={handleClearFilter}
            onClickFun={categoryManagementApi}
            type="else2"
            placeholder="Search"
            filterData={{ ...filterData, limit: noOfPages.totalPages, status: "REJECTED" }}
            excelTableName="Rejected Withdrawals"
            apiEndPoint="transactionHistory"
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
                    "Network",
                    "Initiated",
                    "Amount",
                    "Charge",
                    "USDT_Amount",
                    "After Charge",
                    "Status",
                    "Actions",
                  ].map((item) => {
                    return <TableCell>{item}</TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryData && categoryData.length > 0 ? (
                  categoryData.map((item, i) => (
                    <TableRow key={item._id}>
                      <TableCell>{(page - 1) * 10 + i + 1}</TableCell>

                      {/* <TableCell>{item.userId?.userName || ""}</TableCell> */}
                      <TableCell>
                        <Link to={`/user-dashboard/${item.userId?._id}`} state={{ userName: item.userId?.userName }}  style={{ textDecoration: 'none', color: 'inherit' }}>
                          {item.userId?.userName || ""}
                        </Link>
                      </TableCell>
                      <TableCell>{item.token}</TableCell>
                      {/* <TableCell>{item.createdAt}</TableCell> */}
                      <TableCell>
                        {" "}
                        {moment(item?.createdAt).format("lll")
                          ? moment(item?.createdAt).format("lll")
                          : "--"}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.charge}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>{item.AfterCharge}</TableCell>
                      <TableCell
                        style={
                          item?.status == "REJECTED"
                            ? { color: "red" }
                            : item?.status == "PENDING"
                              ? { color: "orange" }
                              : item?.status == "TRANSFERRED"
                                ? { color: "blue" }
                                : { color: "green" }
                        }
                      >
                        {item?.status}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Tooltip title="View User Details" arrow>
                            <IconButton>
                              <IoMdEye
                                onClick={() =>
                                  history("/deposit-transaction-detail", {
                                    state: {
                                      transactionId: item?._id,
                                      data: item,
                                    },
                                  })
                                }
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <NoDataFound />
                )}
              </TableBody>;
            </Table>
            {isGameUpdating &&
              [1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => {
                return <ListLoder />;
              })}
            {/* {!isGameUpdating && gameData && gameData?.length === 0 && (
              <NoDataFound text={"No game data found!"} />
            )} */}

            {openBlockUnblockModal && (
              <ConfirmationModal
                open={openBlockUnblockModal}
                isLoading={isUserBlocking}
                handleClose={() => {
                  setOpenBlockUnblockModal(false);
                }}
                title={`${blockStatus === "BLOCK" ? "Unblock game" : "Block game"
                  }`}
                desc={`Are you sure about to ${blockStatus === "BLOCK" ? "unblock" : "block"
                  } this game?`}
                handleSubmit={(item) => blockUnblockCategoryApi(item)}
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
                desc={"Are you sure you want to delete this game?"}
                handleSubmit={(item) => deleteEnterpriseApi(item)}
              />
            )}
          </TableContainer>
          {!isGameUpdating && noOfPages?.totalPages > (page === 1 ? 10 : 0) && (
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

export default RejectedWithdrawals;
