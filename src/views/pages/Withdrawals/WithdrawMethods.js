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
    "& .MuiTableCell-root": {
      display: "table-cell",
      padding: "8px",

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

function WithdrawMethods() {
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
        endPoint: "getwithdrawsettings",
        paramsData: {
          page: page,
          limit: 10,
          ...filterData,
        },
        source: source,
      });
      console.log(response, "response from withdraw settings");
      if (response.data.responseCode === 200) {
        setGameData(response.data.result);
        setNoOfPages({
          pages: response.data.result.pages, // Assuming you get the total number of items from result
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
        <GoBack title={"Withdrawal Methods"} />
        {gameData.length == 0 ? (<Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history("/editwithdrawalmethod", {
                state: {
                  type: "ADD",
                },
              });
            }}
          >
            Add
          </Button>
        </Box>) : (<> </>)}

      </Box>

      <Grid container>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>Token Address</TableCell>
                  <TableCell>Token Symbol</TableCell>
                  <TableCell>createdAt</TableCell>
                  <TableCell>Minimum Withdrawal</TableCell>
                  <TableCell>Maximum Withdrawal</TableCell>
                  <TableCell>Fixed Charge</TableCell>
                  <TableCell>Percentage Charge</TableCell>
                  <TableCell>Fee Wallet</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gameData && gameData.length > 0 ? (
                  gameData.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                      <TableCell>{item.Token_Mint}</TableCell>
                      <TableCell>{item.Symbol}</TableCell>
                      <TableCell>
                        {" "}
                        {moment(item?.createdAt).format("lll")
                          ? moment(item?.createdAt).format("lll")
                          : "--"}
                      </TableCell>
                      <TableCell>{item.Min_Withdraw}</TableCell>
                      <TableCell>{item.Max_Withdraw}</TableCell>
                      <TableCell>{item.Fixed_Charge}</TableCell>
                      <TableCell>{item.Percentage_Charge}</TableCell>
                      <TableCell>{item.Fee_wallet}</TableCell>

                      <TableCell
                        style={
                          item.status === "ACTIVE"
                            ? { color: "green" }
                            : item.status === "INACTIVE"
                              ? { color: "red" }
                              : {} // Optional: Add default styling for other statuses
                        }
                      >
                        {item.status}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Tooltip title="View Game" arrow>
                            <IconButton
                              onClick={() =>
                                history("/newaddtask", {
                                  state: {
                                    gameId: item?._id,


                                    type: "VIEW",
                                  },
                                })
                              }
                            >

                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Game" arrow>
                            <IconButton
                              onClick={() => {
                                history("/editwithdrawalmethod", {
                                  state: {
                                    gameId: item?._id,
                                    Symbol: item?.Symbol,
                                    Token_Mint: item?.Token_Mint,
                                    Min_Withdraw: item?.Min_Withdraw,
                                    Max_Withdraw: item?.Max_Withdraw,
                                    Fixed_Charge: item?.Fixed_Charge,
                                    Percentage_Charge: item?.Percentage_Charge,
                                    Fee_wallet: item?.Fee_wallet,
                                    Withdraw_Note: item?.Withdraw_Note,
                                    type: "EDIT",
                                  },
                                });
                              }}
                              disabled={item.status === "BLOCK"}
                            >
                              <MdEdit />
                            </IconButton>
                          </Tooltip>


                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <NoDataFound text={"No data found!"} />
                )}
              </TableBody>
            </Table>
            {isGameUpdating && [1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => <ListLoder key={i} />)}

            {!isGameUpdating && gameData?.length === 0 && <NoDataFound text={"No data found!"} />}

            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={noOfPages.Pages}
                page={page}
                onChange={(e, value) => {
                  setPage(value);
                }}
                color="secondary"
              />
            </Box>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default WithdrawMethods;
