import Filtter from "src/component/Filtter";
import {
  Avatar,
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
import { MdBlock, MdDelete, MdDownload, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import GoBack from "src/component/GoBack";
import ListLoder from "src/component/ListLoder";
import { FaDownload } from "react-icons/fa";

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

function PendingWithdrawals() {
  let filterData = {};
  const classes = useStyles();
  const history = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [isCategoryUpdating, setIsCategoryUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isEnterpriseDeleting, setIsEnterpriseDeleting] = useState(false);
  const [openBlockUnblockModal, setOpenBlockUnblockModal] = useState(false);
  const [blockUnblockId, setBlockUnblockId] = useState("");
  const [blockStatus, setBlockStatus] = useState("");
  const [isUserBlocking, setIsUserBlocking] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [filtersData, setFiltersData] = useState({
    fromDate: null,
    toDate: null,
    search: "",
    // status: "",
  });
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
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
      console.log(filterData, "filterData");

      const response = await getAPIHandler({
        endPoint: "transactionHistory",
        paramsData: {
          page: page,
          limit: 10,
          status: "PENDING",
          ...filterData,
        },
        source: source,
      });
      console.log(response, "response from pending History");

      if (response.data.responseCode === 200) {
        const pendingWithdrawals = response.data.result.docs


        console.log(pendingWithdrawals, "pendingWithdrawals");

        setIsClear(false);
        setCategoryData(pendingWithdrawals);
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
      setIsClear(false);
      setCategoryData([]);
      setIsCategoryUpdating(false);
    }
  };

  const blockUnblockCategoryApi = async (values) => {
    try {
      setIsUserBlocking(true);
      const response = await putAPIHandler({
        endPoint: "activeDeactiveCategory",
        dataToSend: {
          _id: blockUnblockId,
        },
      });
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        setOpenBlockUnblockModal(false);
        categoryManagementApi();
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
        endPoint: "deleteCategory",
        dataToSend: {
          _id: deleteId,
        },
      });

      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        setOpenDeleteModal(false);
        categoryManagementApi();
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

  const handleClearFilter = () => {
    setFiltersData({
      ...filtersData,
      ["fromDate"]: null,
      ["toDate"]: null,
      ["search"]: "",
      // ["status"]: "",
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
    <Box className={classes.main} mb={1}>
      <Box className="displaySpacebetween">
        <GoBack title={"Pending Withdrawals"} />
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
            filterData={{ ...filterData, limit: noOfPages.totalPages, status: "PENDING" }}
            excelTableName="Pending Withdrawals"
            apiEndPoint="transactionHistory"

          />
        </Paper>
      </Box>

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
              ].map((item, index) => (
                <TableCell key={index}>{item}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryData && categoryData.length > 0 ? (
              categoryData
                .filter((item) => item.status === "PENDING")
                .map((item, i) => (
                  <TableRow key={item._id}>
                    <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                    {/* <TableCell>{item.userId?.userName || ""}</TableCell> */}

                    <TableCell>
                      <Link to={`/user-dashboard/${item.userId?._id}`} state={{ userName: item?.userId?.userName }} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                        item?.status == "REJECTE"
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
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={noOfPages.pages}
          page={page}
          onChange={(event, value) => setPage(value)}
        />
      </Box>
    </Box>
  );
}

export default PendingWithdrawals;
