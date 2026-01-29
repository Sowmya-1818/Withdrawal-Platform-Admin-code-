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
import { useNavigate,Link } from "react-router-dom";
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
function BoosterTransaction() {
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
        endPoint: "getUserBoosters",
        paramsData: {
          page: page,
          limit: 10,
          ...filterData,
        },
        source: source,
      });

      console.log(response, "response manu");
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

  return (
    <Box className={classes.main} mb={1}>
      <Box className="displaySpacebetween">
        <GoBack title={"Booster Transaction"} />
        {/* <Box>
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
        </Box> */}
      </Box>
      <Box mt={3} mb={3}>
        <Paper elevation={3}>
          <Filtter
            filter={filtersData}
            setFilter={setFiltersData}
            clearFilters={handleClearFilter}
            onClickFun={categoryManagementApi}
            type="else2"
            placeholder="Search by User Name."
            filterData={{ ...filterData, limit: noOfPages.totalPages }}
            excelTableName="Booster Transaction"
            apiEndPoint="getUserBoosters"
          />
        </Paper>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {/* Adjusted column headers */}
              {[
                "Sr.No",
                "User Name",
                "Booster Name",
                "Amount",
                "Booster Start",
                "Booster End",
                "Created At",
                "Status"
              ].map((item) => {
                return <TableCell key={item}>{item}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryData &&
              categoryData?.map((item, i) => (
                <TableRow key={item._id}>
                  <TableCell>{(page - 1) * 10 + i + 1}</TableCell>

                  {/* User Name - Assuming you have the user data */}
                  {/* <TableCell className="displayCenter">
                    {item.User_Id?.userName|| ""}
                  </TableCell> */}

                  <TableCell>
                      <Link to={`/user-dashboard/${item.User_Id?._id}`} state={{ userName: item?.User_Id?.userName }} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {item.User_Id?.userName || ""}
                      </Link>
                    </TableCell>
                    
                  {/* Booster Name - Placeholder if you have it in the API response */}
                  <TableCell>{item.Booster_Id?.Name || ""}</TableCell>

                  {/* Amount */}
                  <TableCell>{item.Amount}</TableCell>

                  <TableCell>
                    {item.BoosterStart ? moment(item.BoosterStart).format("lll") : ""}
                  </TableCell>
                  <TableCell>
                    {item.BoosterEnd ? moment(item.BoosterEnd).format("lll") : ""}
                  </TableCell>

                  <TableCell>
                    {item.createdAt ? moment(item.createdAt).format("lll") : ""}
                  </TableCell>
                   
                  {/* Status */}
                  <TableCell
                    style={
                      item?.Status === "PENDING"
                        ? { color: "orange" }
                        : item?.Status === "ACTIVE"
                          ? { color: "green" }
                          : item?.Status === "COMPLETED"
                            ? { color: "blue" }
                            : { color: "gray" } // Default color for undefined or other Statuses
                    }
                  >
                    {item?.Status}
                  </TableCell>

{/* 
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
                    </Box>
                  </TableCell> */}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {isCategoryUpdating &&
          [1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => {
            return <ListLoder key={i} />;
          })}
        {!isCategoryUpdating && categoryData && categoryData?.length === 0 && (
          <NoDataFound text={"No data found!"} />
        )}

        {/* Pagination */}
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
      </TableContainer>



    </Box>
  );
}

export default BoosterTransaction;
