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
import { MdDelete, MdEdit } from "react-icons/md";
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
function AnouncementManagement() {
  let filterData = {};
  const classes = useStyles();
  const history = useNavigate();
  const [announcementData, setAnnouncementData] = useState([]);
  const [isAnnouncementUpdating, setIsAnnouncementUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isAnnouncementDeleting, setIsAnnouncementDeleting] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });
  const [filtersData, setFiltersData] = useState({
    fromDate: null,
    toDate: null,
    search: "",
  });
  const announcementManagementApi = async (source) => {
    try {
      filterData = {
        search: filtersData?.search ? filtersData?.search : null,
        fromDate: filtersData.fromDate
          ? moment(filtersData.fromDate).format("YYYY-MM-DD")
          : null,
        toDate: filtersData.toDate
          ? moment(filtersData.toDate).format("YYYY-MM-DD")
          : null,
      };
      const response = await getAPIHandler({
        endPoint: "listAnnouncement",
        paramsData: {
          page: page,
          limit: 10,
          ...filterData,
        },
        source: source,
      });

      if (response.data.responseCode === 200) {
        setAnnouncementData(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setAnnouncementData([]);
      }
      setIsClear(false);
      setIsAnnouncementUpdating(false);
    } catch (error) {
      setIsClear(false);
      setAnnouncementData([]);
      setIsAnnouncementUpdating(false);
    }
  };

  const deleteEnterpriseApi = async (values) => {
    try {
      setIsAnnouncementDeleting(true);
      const response = await deleteAPIHandler({
        endPoint: "deleteAnnouncement",
        dataToSend: {
          annouId: deleteId,
        },
      });

      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        setOpenDeleteModal(false);
        announcementManagementApi();
        setPage(1);
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsAnnouncementDeleting(false);
    } catch (error) {
      setIsAnnouncementDeleting(false);
      console.log(error);
      toast.error(error.response.data.responseMessage);
    }
  };
  useEffect(() => {
    const source = axios.CancelToken.source();
    announcementManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [page]);

  useEffect(() => {
    if (isClear) {
      announcementManagementApi();
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
  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title={"Anouncement Management"} />
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history("/add-announcement", {
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
            setFilter={(data) => {
              setFiltersData(data);
            }}
            clearFilters={handleClearFilter}
            onClickFun={announcementManagementApi}
            userData={announcementData}
            type="else2"
            placeholder="Search by title."
            filterData={{ ...filterData, limit: noOfPages.totalPages }}
            excelTableName="Announcementmanagement"
            apiEndPoint="listAnnouncement"
          />
        </Paper>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {["Sr.No", "Title", "Message", "Date & Time", "Action"].map(
                (item) => {
                  return <TableCell>{item}</TableCell>;
                }
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {announcementData &&
              announcementData?.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                  <TableCell>
                    {item?.title.slice(0, 30)}{" "}
                    {item?.title.length > 30 && "..."}
                  </TableCell>
                  <TableCell>
                    {item?.description.length > 40 ? (
                      <>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `${item?.description.slice(0, 40)}...`,
                          }}
                        ></div>
                      </>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item?.description,
                        }}
                      ></div>
                    )}
                  </TableCell>
                  <TableCell> {moment(item?.sendDate).format("lll")}</TableCell>

                  <TableCell>
                    <Box>
                      <Tooltip title="View Announcement" arrow>
                        <IconButton
                          disabled={item.status === "BLOCK"}
                          onClick={() =>
                            history("/add-announcement", {
                              state: {
                                announcementId: item?._id,
                                type: "VIEW",
                              },
                            })
                          }
                        >
                          <IoMdEye />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Announcement" arrow>
                        <IconButton
                          onClick={() => {
                            history("/add-announcement", {
                              state: {
                                announcementId: item?._id,
                                type: "EDIT",
                              },
                            });
                          }}
                          disabled={item.status === "BLOCK"}
                        >
                          <MdEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Announcement" arrow>
                        <IconButton
                          disabled={item.status === "BLOCK"}
                          onClick={() => {
                            handleOpenDeleteModal(item?._id);
                          }}
                        >
                          <MdDelete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {isAnnouncementUpdating &&
          [1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => {
            return <ListLoder />;
          })}
        {!isAnnouncementUpdating &&
          announcementData &&
          announcementData?.length === 0 && (
            <NoDataFound text={"No announcement data found!"} />
          )}

        {openDeleteModal && (
          <ConfirmationModal
            open={openDeleteModal}
            isLoading={isAnnouncementDeleting}
            handleClose={() => {
              setOpenDeleteModal(false);
            }}
            title={"Delete"}
            desc={"Are you sure you want to delete this announcement?"}
            handleSubmit={(item) => deleteEnterpriseApi(item)}
          />
        )}
      </TableContainer>
      {!isAnnouncementUpdating &&
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
    </Box>
  );
}

export default AnouncementManagement;
