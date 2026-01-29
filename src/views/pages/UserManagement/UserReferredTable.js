import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Pagination } from "@material-ui/lab";
import axios from "axios";
import { getAPIHandler } from "src/ApiConfig/service";
import moment from "moment";
import NoDataFound from "src/component/NoDataFound";
import ListLoder from "src/component/ListLoder";

const useStyles = makeStyles((theme) => ({
  main: {
    "& th": {
      background: "#DE14FF !important",
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

function UserReferredTable({ data }) {
  const classes = useStyles();
  const [userData, setUserData] = useState([]);
  const [isUserUpdating, setIsUserUpdating] = useState(true);
  const [page, setPage] = useState(1);

  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });

  const userManagementApi = async (source) => {
    try {
      const response = await getAPIHandler({
        endPoint: "userReferredList",
        paramsData: {
          page: page,
          limit: 10,
          referrerId: data?._id,
        },
        source: source,
      });
      console.log("response==>", response);
      if (response.data.responseCode === 200) {
        setUserData(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      } else {
        setUserData([]);
      }

      setIsUserUpdating(false);
    } catch (error) {
      setUserData([]);
      setIsUserUpdating(false);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    userManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [page]);

  return (
    <Box className={classes.main}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Sr.No",
                "Email",
                "User Name",
                "First Name",
                "Last Name",
                "Referral Code",
                "Date & Time",
              ].map((item) => {
                return <TableCell>{item}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {userData &&
              userData?.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                  <TableCell>{item?.email}</TableCell>
                  <TableCell>{item?.userName}</TableCell>
                  <TableCell>{item?.firstName}</TableCell>
                  <TableCell>{item?.lastName}</TableCell>
                  <TableCell>{item?.referralCode}</TableCell>
                  <TableCell>
                    {" "}
                    {moment(item?.createdAt).format("lll")
                      ? moment(item?.createdAt).format("lll")
                      : "--"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {isUserUpdating &&
          [1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => {
            return <ListLoder />;
          })}
        {!isUserUpdating && userData && userData?.length === 0 && (
          <NoDataFound text={"No activity data found!"} />
        )}
      </TableContainer>
      {!isUserUpdating &&
        userData?.length > 0 &&
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

export default UserReferredTable;
