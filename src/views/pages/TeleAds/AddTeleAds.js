import Filtter from "src/component/Filtter";
import {
  Avatar,
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
import {
  getAPIHandler,
} from "src/ApiConfig/service";
import { toast } from "react-hot-toast";
import GoBack from "src/component/GoBack";
import NoDataFound from "src/component/NoDataFound";
import { MdEdit } from "react-icons/md";

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
  //   "& .MuiAvatar-img": {
  //     color: "transparent",
  //     width: "100%",
  //     height: "100%",
  //     objectfit: "cover",
  //     textalign: "center",
  //     textindent: "10000px",
  // }
  },
}));

function AddTeleAds() {
  const classes = useStyles();
  const history = useNavigate();
  const [adsData, setAdsData] = useState([]);
  const [page, setPage] = useState(1);

  // Fetch Ads Data
  const fetchAdsData = async (source) => {
    try {
      const response = await getAPIHandler({
        endPoint: "getAds",
        source: source,
      });

      console.log(response, "response from fetchAdsData");
      
      if (response.data.responseCode === 200) {
        setAdsData(response.data.result); // Assuming result is an array of ads
      } else {
        toast.error(response.data.responseMessage || "Failed to fetch ads.");
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
      toast.error("An error occurred while fetching ads.");
      setAdsData([]);
    }
  };

  // Handle Edit Redirect
  const handleEditRedirect = (ad) => {
    history("/newteleads", {
      state: {
        adData: ad, // Pass the ad data to the /newteleads route
        type: "EDIT",
      },
    });
  };
console.log(adsData,"adsData");

  useEffect(() => {
    const source = axios.CancelToken.source();
    fetchAdsData(source);

    return () => {
      source.cancel("Request canceled by cleanup");
    };
  }, [page]);

  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title={"TELEGRAM ADS"} />
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history("/newteleads", {
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
      <Grid container>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sr.No</TableCell>
                  <TableCell>Ad Name</TableCell>
                  <TableCell>Ad Function</TableCell>
                  <TableCell>Ad Count</TableCell>
                  <TableCell>Ad Timer In Minutes</TableCell>
                  <TableCell>Ad Image</TableCell>
                  <TableCell>Reward Points</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adsData && adsData.length > 0 ? (
                  adsData.map((ad, index) => (
                    <TableRow key={ad._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{ad.AdName}</TableCell>
                      <TableCell>{ad.AdSDK}</TableCell>
                      <TableCell>{ad.AdCount}</TableCell>
                      <TableCell>{ad.AdTimer_InMinutes}</TableCell>
                     

                      <TableCell className="displayCenter">
                    <Box className="displayCenter">
                      <Avatar
                         src={ad.AdImage}
                         alt={ad.AdName}
                        width="50px"
                        height="50px"
                      />
                     
                    </Box>
                  </TableCell>
                      <TableCell>{ad.Rewardpoints}</TableCell>
                      <TableCell
                          style={
                            ad.Status === "ACTIVE"
                              ? { color: "green" }
                              : ad.Status === "INACTIVE"
                                ? { color: "red" }
                                : {} // Optional: Add default styling for other Statuses
                          }
                        >
                          {ad.Status}
                        </TableCell>
                      <TableCell>
                        <Tooltip title="Edit Ad" arrow>
                          <IconButton onClick={() => handleEditRedirect(ad)}>
                            <MdEdit />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: "center" }}>
                      No Ads Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {!adsData.length && <NoDataFound text={"No ads data found!"} />}
          <Box mt={3} mb={2} className="displayEnd">
            <Pagination
              page={page}
              count={1} // Adjust dynamically if pagination metadata is available
              onChange={(e, v) => setPage(v)}
              shape="rounded"
              color="primary"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AddTeleAds;
