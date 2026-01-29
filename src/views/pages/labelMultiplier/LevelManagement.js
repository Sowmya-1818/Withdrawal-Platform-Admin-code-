import {
  Avatar,
  Box,
  Grid,
  IconButton,
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
import { getAPIHandler } from "src/ApiConfig/service";
import NoDataFound from "src/component/NoDataFound";
import { MdEdit } from "react-icons/md";
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
  const classes = useStyles();
  const history = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [isCategoryUpdating, setIsCategoryUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });

  const gameManagementApi = async (source) => {
    try {
      setCategoryData([]);
      setIsCategoryUpdating(true);
      const response = await getAPIHandler({
        endPoint: "listgame",
        paramsData: {
          page: page,
          limit: 10,
          status: "ACTIVE",
        },
        source: source,
      });

      if (response.data.responseCode === 200) {
        setCategoryData(response?.data?.result?.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setCategoryData([]);
      }
      setIsCategoryUpdating(false);
    } catch (error) {
      setCategoryData([]);

      setIsCategoryUpdating(false);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    gameManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [page]);

  return (
    <Box className={classes.main}>
      <Box mb={4}>
        <GoBack title={"Level Management"} />
      </Box>

      <Grid container>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Sr.No", "Game Title", "Level", "Action"].map((item) => {
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
                        {item && item?.gameTitle ? item?.gameTitle : "..."}
                      </TableCell>
                      <TableCell>
                        {item && item?.level ? item?.level?.length : "0"}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Tooltip title="View Level" arrow>
                            <IconButton
                              onClick={() =>
                                history("/level-multiplier", {
                                  state: {
                                    levelId: item?._id,
                                    type: "VIEW",
                                  },
                                })
                              }
                            >
                              <IoMdEye />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Level" arrow>
                            <IconButton
                              onClick={() => {
                                history("/level-multiplier", {
                                  state: {
                                    levelId: item?._id,
                                    type: "EDIT",
                                  },
                                });
                              }}
                            >
                              <MdEdit />
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
            {!isCategoryUpdating &&
              categoryData &&
              categoryData?.length === 0 && (
                <NoDataFound text={"No category data found!"} />
              )}
          </TableContainer>
        </Grid>
      </Grid>
      {!isCategoryUpdating &&
        categoryData &&
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

export default GameManagement;
