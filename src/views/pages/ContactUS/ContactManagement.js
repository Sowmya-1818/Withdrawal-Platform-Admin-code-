import Filtter from "src/component/Filtter";
import {
  Box,
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
import { FaReply } from "react-icons/fa6";
import axios from "axios";
import { postAPIHandler, putAPIHandler } from "src/ApiConfig/service";
import moment from "moment";
import NoDataFound from "src/component/NoDataFound";
import ListLoder from "src/component/ListLoder";
import GoBack from "src/component/GoBack";
import { IoMdEye } from "react-icons/io";
import ConfirmationModal from "src/component/ConfirmationModal";
import { toast } from "react-hot-toast";
import ContactUsModal from "src/component/ContactUsModal";

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
function ContactManagement() {
  let filterData = {};
  const classes = useStyles();
  const history = useNavigate();
  const [contactUsData, setContactUsData] = useState([]);
  const [emailId, setEmailId] = useState("");
  const [isContractUpdating, setIsContractUpdating] = useState(false);
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });
  const [openBlockUnblockModal, setOpenBlockUnblockModal] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);
  const [isContactUpdating, setIsContactUpdating] = useState(false);
  const [blockUnblockId, setBlockUnblockId] = useState("");
  const [blockStatus, setBlockStatus] = useState("");
  console.log("blockStatus==>>", blockStatus);
  const [isClear, setIsClear] = useState(false);
  const [isUserBlocking, setIsUserBlocking] = useState(false);
  const [isContactUsUpdating, setIsContactUsUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [filtersData, setFiltersData] = useState({
    fromDate: null,
    toDate: null,
    search: "",
    status: "ALL",
  });
  const [error, setError] = useState("");

  const [reasonData, setReasonData] = useState({
    reason: "",
  });

  const contactUsManagementApi = async (source) => {
    try {
      filterData = {
        search: filtersData?.search ? filtersData?.search : null,
        fromDate: filtersData.fromDate
          ? moment(filtersData.fromDate).format("YYYY-MM-DD")
          : null,
        toDate: filtersData.toDate
          ? moment(filtersData.toDate).format("YYYY-MM-DD")
          : null,
        reply:
          filtersData?.status !== "ALL"
            ? filtersData?.status == "PENDING"
              ? false
              : true
            : undefined,
      };
      const response = await postAPIHandler({
        endPoint: "getContactUs",
        paramsData: {
          page: page,
          limit: 10,
          ...filterData,
        },
        source: source,
      });
      if (response.data.responseCode === 200) {
        setContactUsData(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setContactUsData([]);
      }
      setIsClear(false);
      setIsContactUpdating(false);
    } catch (error) {
      setIsClear(false);
      setContactUsData([]);
      setIsContactUpdating(false);
    }
  };
  const sendMailApi = async (values) => {
    try {
      setIsContractUpdating(true);
      const response = await putAPIHandler({
        endPoint: "replyContactUs",
        paramsData: {
          _id: blockUnblockId,
          message: reasonData?.reason,
        },
      });

      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        setIsContractUpdating(false);
        contactUsManagementApi();
        setOpenContactModal(false);
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsContractUpdating(false);
    } catch (error) {
      setIsContractUpdating(false);
      console.log(error);
      toast.error(error.response.data.responseMessage);
    }
  };
  useEffect(() => {
    const source = axios.CancelToken.source();
    contactUsManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [page]);

  useEffect(() => {
    if (isClear) {
      contactUsManagementApi();
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
    setOpenContactModal(true);
    setBlockUnblockId(data);
    setBlockStatus(status);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setReasonData({ ...reasonData, reason: value });
    console.log("value", value);
    const errorMsg =
      value.trim() == ""
        ? "Reason is required."
        : value.length < 3
        ? "Reason must be at least 3 characters long."
        : value.length > 600
        ? "Exceeded maximum character limit (600)."
        : "";
    setError(errorMsg);
  };

  return (
    <Box className={classes.main}>
      <Box mb={5}>
        <GoBack title="Contact Us" />
      </Box>

      <Box mt={3} mb={3}>
        <Paper elevation={3}>
          <Filtter
            filter={filtersData}
            setFilter={(data) => {
              setFiltersData(data);
            }}
            clearFilters={handleClearFilter}
            onClickFun={contactUsManagementApi}
            type="else"
            placeholder="Search by email."
            filterData={{ ...filterData, limit: noOfPages.totalPages }}
            excelTableName="Contactus"
            apiEndPoint="getContactUs"
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
                    "First Name",
                    "Last Name",
                    "Email",
                    "Message",
                    "Date & Time",
                    "Status",
                    "Action",
                  ].map((item) => {
                    return <TableCell>{item}</TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {contactUsData &&
                  contactUsData?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                      <TableCell>
                        {item && item?.firstName ? item?.firstName : "..."}
                      </TableCell>
                      <TableCell>
                        {item && item?.lastName ? item?.lastName : "..."}
                      </TableCell>
                      <TableCell>
                        {item && item?.email ? item?.email : "..."}
                      </TableCell>

                      <TableCell>
                        {item?.message?.length > 40
                          ? `${item?.message.slice(0, 40)}...`
                          : item?.message || "..."}
                      </TableCell>
                      <TableCell>
                        {moment(item?.createdAt).format("lll")
                          ? moment(item?.createdAt).format("lll")
                          : "..."}
                      </TableCell>
                      <TableCell
                        style={
                          item?.reply
                            ? {
                                color: "green",
                              }
                            : {
                                color: "yellow",
                              }
                        }
                      >
                        {item?.reply ? "RESPONDED" : "PENDING"}
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Tooltip title="View Contact" arrow>
                            <IconButton>
                              <IoMdEye
                                onClick={() =>
                                  history("/view-contact", {
                                    state: {
                                      contactId: item?._id,
                                      data: item,
                                    },
                                  })
                                }
                              />
                            </IconButton>
                          </Tooltip>
                          {!item?.reply && (
                            <Tooltip title="reply" arrow>
                              <IconButton
                                onClick={() => {
                                  handleOpenBlockUnblockModal(
                                    item?._id,
                                    item?.reply
                                  );
                                }}
                              >
                                <FaReply />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {isContactUsUpdating &&
              [1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => {
                return <ListLoder />;
              })}
            {!isContactUsUpdating &&
              contactUsData &&
              contactUsData?.length === 0 && (
                <NoDataFound text={"No contact data found!"} />
              )}

            {openContactModal && (
              <ContactUsModal
                open={openContactModal}
                isLoading={isContractUpdating}
                handleClose={() => {
                  setOpenContactModal(false);
                }}
                filter={reasonData}
                setFilter={(data) => {
                  setReasonData(data);
                }}
                title={"Reply"}
                desc={"Are you sure, you want to reply this user?"}
                error={error}
                handleSubmit={(item) => {
                  handleChange({ target: { value: reasonData?.reason } });
                  if (error == "" && reasonData.reason !== "") {
                    sendMailApi(item);
                  }
                }}
                status={blockStatus}
                typeContact="contactUs"
              />
            )}
          </TableContainer>
          {!isContactUsUpdating &&
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
        </Grid>
      </Grid>
    </Box>
  );
}

export default ContactManagement;
