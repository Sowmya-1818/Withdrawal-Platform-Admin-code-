import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  makeStyles,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import axios from "axios";
import { getAPIHandler } from "src/ApiConfig/service";
import NoDataFound from "src/component/NoDataFound";
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

const StaticContent = () => {
  const classes = useStyles();
  const history = useNavigate();
  const [staticData, setStaticData] = useState([]);
  const [isStaticDataUpdating, setIsStaticDataUpdating] = useState(false);
  const staticManagementApi = async (source) => {
    try {
      setStaticData([]);
      setIsStaticDataUpdating(true);
      const response = await getAPIHandler({
        endPoint: "staticContentList",
        source: source,
      });
      if (response.data.responseCode === 200) {
        setStaticData(response.data.result);
        setIsStaticDataUpdating(false);
      }
      setIsStaticDataUpdating(false);
    } catch (error) {
      setIsStaticDataUpdating(false);
    }
  };
  useEffect(() => {
    const source = axios.CancelToken.source();
    staticManagementApi(source);
    return () => {
      source.cancel();
    };
  }, []);
  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween" mb={5}>
        <GoBack title="Static Content Management" />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {["Title", "Action"].map((item) => {
                return <TableCell>{item}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {staticData &&
              staticData?.map((data, index) => (
                <TableRow key={data.title}>
                  <TableCell>{data.title}</TableCell>
                  <TableCell>
                    <Box>
                      <Tooltip title="View Static Content" arrow>
                        <IconButton
                          className="actionButton"
                          onClick={() => {
                            history("/view-static", {
                              state: {
                                type: data?.type,
                              },
                            });
                          }}
                        >
                          <IoEye fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Static Content" arrow>
                        <IconButton
                          className="actionButton"
                          color="error"
                          onClick={() => {
                            history("/privacy-policy", {
                              state: {
                                data: data,
                              },
                            });
                          }}
                        >
                          <MdEdit fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {isStaticDataUpdating &&
          [1, 2, 3, 4, 5, 6, 7, 8].map((item, i) => {
            return <ListLoder />;
          })}
        {!isStaticDataUpdating && staticData && staticData?.length === 0 && (
          <NoDataFound text={"No static data found!"} />
        )}
      </TableContainer>
    </Box>
  );
};

export default StaticContent;
