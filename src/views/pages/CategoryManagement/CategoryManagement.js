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
function CategoryManagement() {
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
    status: "ALL",
  });
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });

  const categoryManagementApi = async (source) => {
    try {
      setCategoryData([]);
      setIsCategoryUpdating(true);
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
        endPoint: "adminListCategory",
        paramsData: {
          page: page,
          limit: 10,
          ...filterData,
        },
        source: source,
      });

      if (response.data.responseCode === 200) {
        setIsClear(false);
        setCategoryData(response.data.result.docs);
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
      if (response.data.responseCode == 200) {
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

      if (response.data.responseCode == 200) {
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
    <Box className={classes.main} mb={1}>
      <Box className="displaySpacebetween">
        <GoBack title={"Category Management"} />
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history("/add-category", {
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
            onClickFun={categoryManagementApi}
            type="user"
            placeholder="Search by category title."
            filterData={{ ...filterData, limit: noOfPages.totalPages }}
            excelTableName="Categorymanagement"
            apiEndPoint="adminListCategory"
          />
        </Paper>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Sr.No",
                "Category Title",
                "Category Icon Colored",
                "Category Icon Widthout Colored",
                "Date & Time",
                "Status",
                "Action",
              ].map((item) => {
                return <TableCell>{item}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryData &&
              categoryData?.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                  <TableCell>
                    {item?.categoryTitle.slice(0, 30)}{" "}
                    {item?.categoryTitle.length > 30 && "..."}
                  </TableCell>

                  <TableCell className="displayCenter">
                    <Box className="displayCenter">
                      <Avatar
                        src={item?.categoryIcon2}
                        width="50px"
                        height="50px"
                      />
                      <IconButton
                        onClick={() =>
                          window.open(item?.sampleIconWithOutColored)
                        }
                      >
                        <MdDownload fontSize="22px" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="displayCenter">
                      <Avatar
                        src={item?.categoryIcon}
                        width="50px"
                        height="50px"
                      />
                      <IconButton
                        onClick={() => window.open(item?.sampleIconColored)}
                      >
                        <MdDownload fontSize="22px" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {" "}
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
                      <Tooltip title="View Category" arrow>
                        <IconButton
                          onClick={() =>
                            history("/add-category", {
                              state: {
                                categoryId: item?._id,
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
                            history("/add-category", {
                              state: {
                                categoryId: item?._id,
                                type: "EDIT",
                              },
                            });
                          }}
                          disabled={item.status === "BLOCK"}
                        >
                          <MdEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Category" arrow>
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
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {isCategoryUpdating &&
          [1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => {
            return <ListLoder />;
          })}
        {!isCategoryUpdating && categoryData && categoryData?.length === 0 && (
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
              blockStatus === "BLOCK" ? "Unblock category" : "Block category"
            }`}
            desc={`Are you sure, you want to ${
              blockStatus === "BLOCK" ? "unblock" : "block"
            } this category?`}
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
            desc={"Are you sure, you want to delete this category?"}
            handleSubmit={(item) => deleteEnterpriseApi(item)}
          />
        )}
      </TableContainer>
      {!isCategoryUpdating &&
        categoryData?.length > 0 &&
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

export default CategoryManagement;
