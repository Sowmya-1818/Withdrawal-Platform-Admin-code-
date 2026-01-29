import Filtter from "src/component/Filtter";
import {
  Box,
  Button,
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
import { deleteAPIHandler, getAPIHandler } from "src/ApiConfig/service";
import moment from "moment";
import NoDataFound from "src/component/NoDataFound";
import { toast } from "react-hot-toast";
import ConfirmationModal from "src/component/ConfirmationModal";
import { MdDelete, MdEdit } from "react-icons/md";
import GoBack from "src/component/GoBack";
import { IoMdEye } from "react-icons/io";
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
function FaqManagement() {
  let filterData = {};
  const classes = useStyles();
  const history = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [isCategoryUpdating, setIsCategoryUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isFaqDeleting, setIsFaqDeleting] = useState(false);
  const [isUserBlocking, setIsUserBlocking] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [filtersData, setFiltersData] = useState({
    search: "",
    screenName: "ALL",
  });
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });

  const faqsManagementApi = async (source) => {
    try {
      // Log the start of the function execution
      console.log('Starting FAQ Management API call with source:', source);
      
      setCategoryData([]);
      setIsCategoryUpdating(true);
  
      // Log the filter data
      console.log('Filter data:', {
        search: filtersData?.search,
        screenName: filtersData?.screenName,
      });
  
      filterData = {
        search: filtersData?.search ? filtersData?.search : null,
        screenName:
          filtersData?.screenName !== "ALL"
            ? filtersData?.screenName
            : undefined,
      };
  
      // Log the API request parameters
      console.log('API request parameters:', {
        page: page,
        limit: 10,
        ...filterData,
      });
  
      const response = await getAPIHandler({
        endPoint: "faqList",
        paramsData: {
          page: page,
          limit: 10,
          ...filterData,
        },
        source: source,
      });
  
      // Log the API response
      console.log('API response:', response);
  
      if (response.data.responseCode === 200) {
        setCategoryData(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
  
        // Log the successful response data
        console.log('Fetched data:', response.data.result.docs);
      } else {
        setCategoryData([]);
        // Log an error message if the response code is not 200
        console.error('Error in response:', response);
      }
  
      setIsClear(false);
      setIsCategoryUpdating(false);
  
    } catch (error) {
      // Log any errors during the API call
      console.error('Error occurred during FAQ management API call:', error);
  
      setIsClear(false);
      setCategoryData([]);
      setIsCategoryUpdating(false);
    }
  };
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        

  const deleteEnterpriseApi = async (values) => {
    try {
      setIsFaqDeleting(true);
      const response = await deleteAPIHandler({
        endPoint: "deleteFAQ",
        dataToSend: {
          _id: deleteId,
        },
      });

      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        setOpenDeleteModal(false);
        faqsManagementApi();
        setPage(1);
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsFaqDeleting(false);
    } catch (error) {
      setIsFaqDeleting(false);
      console.log(error);
      toast.error(error.response.data.responseMessage);
    }
  };
  useEffect(() => {
    const source = axios.CancelToken.source();
    faqsManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [page]);
  useEffect(() => {
    if (isClear) {
      faqsManagementApi();
    }
  }, [isClear]);

  const handleClearFilter = () => {
    setFiltersData({
      ...filtersData,
      ["search"]: "",
      ["screenName"]: "ALL",
    });
    setIsClear(true);
  };

  const handleOpenDeleteModal = (data) => {
    setOpenDeleteModal(true);
    setDeleteId(data);
  };

  console.log("filterData==", filterData);
  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title={"FAQ Management"} />
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history("/faq-edit", {
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
            onClickFun={faqsManagementApi}
            type="faq"
            placeholder="Search by question."
            filterData={{ ...filterData, limit: noOfPages.totalPages }}
            excelTableName="Faqmanagement"
            apiEndPoint="faqList"
          />
        </Paper>
      </Box>
      <Grid container>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Sr.No", "Question", "Answer", "Screen Name", "Action"].map(
                    (item) => {
                      return <TableCell>{item}</TableCell>;
                    }
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryData &&
                  categoryData?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                      <TableCell>
                        {item?.question.slice(0, 45)}{" "}
                        {item?.question.length > 45 && "..."}
                      </TableCell>
                      <TableCell>
                        {item?.answer?.length > 40 ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: `${item?.answer.slice(0, 40)}...`,
                            }}
                          ></div>
                        ) : (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item?.answer,
                            }}
                          ></div>
                        )}
                      </TableCell>
                      <TableCell>
                        {item && item?.screenName ? item?.screenName : "--"}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Tooltip title="View FAQ" arrow>
                            <IconButton
                              disabled={item.status === "BLOCK"}
                              onClick={() =>
                                history("/view-faq", {
                                  state: {
                                    faqId: item?._id,
                                    type: "VIEW",
                                  },
                                })
                              }
                            >
                              <IoMdEye />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit FAQ" arrow>
                            <IconButton
                              onClick={() => {
                                history("/faq-edit", {
                                  state: {
                                    data: item,
                                    type: "EDIT",
                                  },
                                });
                              }}
                              disabled={item.status === "BLOCK"}
                            >
                              <MdEdit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete FAQ" arrow>
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
            {isCategoryUpdating &&
              [1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => {
                return <ListLoder />;
              })}
            {!isCategoryUpdating &&
              categoryData &&
              categoryData?.length === 0 && (
                <NoDataFound text={"No faq data found!"} />
              )}

            {openDeleteModal && (
              <ConfirmationModal
                open={openDeleteModal}
                isLoading={isFaqDeleting}
                handleClose={() => {
                  setOpenDeleteModal(false);
                }}
                title={"Delete"}
                desc={"Are you sure, you want to delete this category?"}
                handleSubmit={(item) => deleteEnterpriseApi(item)}
              />
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

export default FaqManagement;
