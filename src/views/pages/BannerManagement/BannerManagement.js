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
import { MdBlock, MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import GoBack from "src/component/GoBack";
import ListLoder from "src/component/ListLoder";

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
function BannerManagement() {
  let filterData = {};
  const classes = useStyles();
  const history = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [openBlockUnblockModal, setOpenBlockUnblockModal] = useState(false);
  const [isCategoryUpdating, setIsCategoryUpdating] = useState(false);
  const [isUserBlocking, setIsUserBlocking] = useState(false);
  const [blockUnblockId, setBlockUnblockId] = useState("");
  const [page, setPage] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [blockStatus, setBlockStatus] = useState("");
  const [isEnterpriseDeleting, setIsEnterpriseDeleting] = useState(false);
  const [isClear, setIsClear] = useState(false);
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

  const bannerManagementApi = async (source) => {
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
        endPoint: "listBanner",
        paramsData: {
          page: page,
          limit: 10,
          ...filterData,
        },
        source: source,
      });

      if (response.data.responseCode === 200) {
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
        endPoint: "activeDeactiveBanner",
        dataToSend: {
          _id: blockUnblockId,
        },
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        setOpenBlockUnblockModal(false);
        bannerManagementApi();
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
        endPoint: "deleteBanner",
        dataToSend: {
          _id: deleteId,
        },
      });

      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        setOpenDeleteModal(false);
        bannerManagementApi();
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
    bannerManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [page]);

  useEffect(() => {
    if (isClear) {
      bannerManagementApi();
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

  const handleOpenDeleteModal = (data) => {
    setOpenDeleteModal(true);
    setDeleteId(data);
  };
  const handleOpenBlockUnblockModal = (data, status) => {
    setOpenBlockUnblockModal(true);
    setBlockUnblockId(data);
    setBlockStatus(status);
  };
  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title={"Banner Management"} />
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history("/add-banner");
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
            setFilter={(data) => {
              setFiltersData(data);
            }}
            clearFilters={handleClearFilter}
            onClickFun={bannerManagementApi}
            userData={categoryData}
            type="else1"
            placeholder="Search by title."
            filterData={{ ...filterData, limit: noOfPages.totalPages }}
            excelTableName="Bannermanagement"
            apiEndPoint="listBanner"
          />
        </Paper>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Sr.No",
                "Banner Url",
                "Banner Image",
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
                    {item?.bannerURL ? (
                      <>
                        {item?.bannerURL?.slice(0, 30)}
                        {item?.bannerURL?.length > 30 && "..."}
                      </>
                    ) : (
                      "..."
                    )}
                  </TableCell>
                  <TableCell>
                    <Box className="displayCenter">
                      <Avatar
                        src={item?.bannerImage}
                        width="22px"
                        height="22px"
                      />
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
                      <Tooltip title="View Banner" arrow>
                        <IconButton
                          disabled={item.status === "BLOCK"}
                          onClick={() =>
                            history("/add-banner", {
                              state: {
                                bannerId: item?._id,
                                type: "VIEW",
                              },
                            })
                          }
                        >
                          <IoMdEye />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Banner" arrow>
                        <IconButton
                          onClick={() => {
                            history("/add-banner", {
                              state: {
                                bannerId: item?._id,
                                type: "EDIT",
                              },
                            });
                          }}
                          disabled={item.status === "BLOCK"}
                        >
                          <MdEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Banner" arrow>
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
          <NoDataFound text={"No announcement data found!"} />
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
            desc={`Are you sure about to ${
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
            desc={"Are you sure you want to delete this announcement?"}
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

export default BannerManagement;
