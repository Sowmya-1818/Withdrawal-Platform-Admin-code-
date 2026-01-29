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
function GameManagement() {
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

  const gameManagementApi = async (source) => {
    try {
      filterData = {
        search: filtersData?.search ? filtersData?.search : null,
        fromDate: filtersData.fromDate
          ? moment(filtersData.fromDate).format("YYYY-MM-DD")
          : null,
        toDate: filtersData.toDate
          ? moment(filtersData.toDate).format("YYYY-MM-DD")
          : null,
        status: filtersData?.status !== "ALL" ? filtersData?.status : undefined,
      };
      const response = await getAPIHandler({
        endPoint: "listgame",
        paramsData: {
          page: page,
          limit: 10,
          ...filterData,
        },
        source: source,
      });

      if (response.data.responseCode === 200) {
        setGameData(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      }
      setIsClear(false);
      setIsGameUpdating(false);
    } catch (error) {
      setIsClear(false);
      setGameData([]);
      setIsGameUpdating(false);
    }
  };

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
        gameManagementApi();
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
        gameManagementApi();
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
    gameManagementApi(source);
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
        gameManagementApi();
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
      gameManagementApi();
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
        <GoBack title={"Game Management"} />
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history("/add-game", {
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
            onClickFun={gameManagementApi}
            type="user"
            placeholder="Search by game title."
            filterData={{ ...filterData, limit: noOfPages.totalPages }}
            excelTableName="Gamemanagement"
            apiEndPoint="listgame"
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
                    "Sr.No",
                    "Game Title",
                    "Game Details",
                    "Game Icon",
                    "Date & Time",
                    "Status",
                    "Action",
                  ].map((item) => {
                    return <TableCell>{item}</TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {gameData &&
                  gameData?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                      <TableCell>
                        {item?.gameTitle.slice(0, 30)}{" "}
                        {item?.gameTitle.length > 30 && "..."}
                      </TableCell>
                      <TableCell>
                        {item?.gameDetails.slice(0, 40)}{" "}
                        {item?.gameDetails.length > 40 && "..."}
                      </TableCell>
                      <TableCell>
                        <Box className="displayCenter">
                          <Tooltip
                            title={
                              item?.latest
                                ? "Added home page."
                                : "Add to home page."
                            }
                            arrow
                          >
                            <Checkbox
                              disabled={isUpdating}
                              checked={item?.latest}
                              onChange={() => editCategoryApi(item)}
                            />
                          </Tooltip>
                          <Avatar src={item?.gamePic} width="100%" />
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
                          <Tooltip title="View Game" arrow>
                            <IconButton
                              onClick={() =>
                                history("/add-game", {
                                  state: {
                                    gameId: item?._id,
                                    type: "VIEW",
                                  },
                                })
                              }
                            >
                              <IoMdEye />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Game" arrow>
                            <IconButton
                              onClick={() => {
                                history("/add-game", {
                                  state: {
                                    gameId: item?._id,
                                    type: "EDIT",
                                  },
                                });
                              }}
                              disabled={item.status === "BLOCK"}
                            >
                              <MdEdit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Game" arrow>
                            <IconButton
                              disabled={item.status === "BLOCK"}
                              onClick={() => {
                                handleOpenDeleteModal(item?._id);
                              }}
                            >
                              <MdDelete />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Block Unblock Game" arrow>
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
            {isGameUpdating &&
              [1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => {
                return <ListLoder />;
              })}
            {!isGameUpdating && gameData && gameData?.length === 0 && (
              <NoDataFound text={"No game data found!"} />
            )}

            {openBlockUnblockModal && (
              <ConfirmationModal
                open={openBlockUnblockModal}
                isLoading={isUserBlocking}
                handleClose={() => {
                  setOpenBlockUnblockModal(false);
                }}
                title={`${
                  blockStatus === "BLOCK" ? "Unblock game" : "Block game"
                }`}
                desc={`Are you sure about to ${
                  blockStatus === "BLOCK" ? "unblock" : "block"
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

export default GameManagement;
