import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  makeStyles,
  TextField,
  FormControl,
  Grid,
} from "@material-ui/core";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  getAPIHandler,
  postAPIHandler,
  putAPIHandler,
} from "src/ApiConfig/service";
import { Pagination } from "@material-ui/lab";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  main: {
    "& th": {
      background: "#DE14FF",
      textAlign: "center",
      color: "white",
      border: "1px solid #666666",
    },
    "& .MuiTableCell-body": {
      textAlign: "center",
      borderBottom: "1px solid #555555",
      color: "#eeeeee",
    },
    "& .MuiTableContainer-root": {
      marginTop: "20px",
      backgroundColor: "#222222",
      borderRadius: "8px",
      maxWidth: "95%",
      margin: "20px auto",
      padding: "10px",
    },
  },
  card: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    backgroundColor: "rgba(40, 25, 43, 1)",
    color: "#ffffff",
    borderRadius: "10px",
  },
  disabledButton: {
    backgroundColor: "#555555 !important",
    color: "#aaaaaa !important",
    pointerEvents: "none",
    border: "1px solid #555555",
  },
}));

function RewardsManagement() {
  const classes = useStyles();
  const [rewards, setRewards] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddBoxVisible, setIsAddBoxVisible] = useState(true); // New state to manage Add Box visibility
  const [editingId, setEditingId] = useState(null);
  const [editingAmount, setEditingAmount] = useState("");
  const [addAmount, setAddAmount] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });
  const [filtersData, setFiltersData] = useState({
    fromDate: null,
    toDate: null,
    search: "",
    
  });
  
  const loadRewards = async (source) => {
    try {
       const appliedFilters = {
              search: filtersData.search || null,
              fromDate: filtersData.fromDate
                ? moment(filtersData.fromDate).format("YYYY-MM-DD")
                : null,
              toDate: filtersData.toDate
                ? moment(filtersData.toDate).format("YYYY-MM-DD")
                : null,
              status: filtersData.status || null,
             
            };

      const response = await getAPIHandler({
        endPoint: "getrewards",
        paramsData: {
          page: page,
          limit: rowsPerPage, // Use the `rowsPerPage` variable here
          ...appliedFilters,
        },
        source,
      });
      console.log(response, "response from loadRewards");

      if (response.data.responseCode === 200) {
        setRewards(response.data.result.docs);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
        // If there are no rewards, show the Add Reward Box
        if (response.data.result.docs.length === 0) {
          setIsAddBoxVisible(true);
        } else {
          setIsAddBoxVisible(false); // Hide Add Box if there are rewards
        }
      } else {
        toast.error(response.data.responseMessage || "Failed to load rewards.");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error("Error loading rewards:", error);
        toast.error("An error occurred while loading rewards.");
      }
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    loadRewards(source);

    return () => {
      source.cancel("Request canceled by cleanup");
    };
  }, [page]);

  const handleAddReward = async () => {
    try {
      setIsAdding(true);
      const token = window.sessionStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found.");
        return;
      }

      const payload = { Reward_Amount: addAmount };
      const response = await postAPIHandler({
        endPoint: "addrewards",
        dataToSend: payload,
      });
      console.log(response, "response from handleAddReward");
      if (response?.data?.responseCode === 200) {
        toast.success(
          response.data.responseMessage || "Reward added successfully."
        );
        setAddAmount(""); // Reset input
        const source = axios.CancelToken.source();
        loadRewards(source); // Refresh rewards list
      } else {
        toast.error(response?.data?.responseMessage || "Failed to add reward.");
      }
    } catch (error) {
      console.error("Error adding reward:", error);
      toast.error("An error occurred while adding reward.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditReward = async (rewardId, rewardAmount) => {
    try {
      setIsUpdating(true);

      const payload = {
        _id: rewardId,
        Reward_Amount: rewardAmount,
      };

      const response = await putAPIHandler({
        endPoint: `editrewards`,
        dataToSend: payload,
      });

      if (response?.data?.responseCode === 200) {
        toast.success(
          response.data.responseMessage || "Reward updated successfully."
        );
        const source = axios.CancelToken.source();
        loadRewards(source); // Refresh the rewards list
        setEditingId(null); // Exit edit mode
      } else {
        toast.error(
          response?.data?.responseMessage || "Failed to edit reward."
        );
      }
    } catch (error) {
      console.error("Error editing reward:", error);
      toast.error("An error occurred while editing the reward.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box className={classes.main}>
      {/* Add Reward Section */}
      {isAddBoxVisible && ( // Conditionally render the Add Reward box
        <Paper className={classes.card}>
          <Typography variant="h6" gutterBottom>
            Add Reward
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  variant="outlined"
                  placeholder="Enter Reward Amount"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  type="number"
                  inputProps={{ min: 0, step: "any" }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddReward}
                disabled={isAdding}
              >
                Add Reward
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Rewards Table */}
      <Paper className={classes.card}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h5" gutterBottom>
            Rewards Management
          </Typography>
        </Box>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr. No</TableCell>
                <TableCell>Reward Amount</TableCell>
                <TableCell>createdAt</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rewards.map((reward, i) => (
                <TableRow key={reward._id}>
                  <TableCell>{(page - 1) * rowsPerPage + i + 1}</TableCell>
                  <TableCell>
                    {editingId === reward._id ? (
                      <TextField
                        variant="outlined"
                        size="small"
                        type="number"
                        value={editingAmount}
                        onChange={(e) => setEditingAmount(e.target.value)}
                        inputProps={{ min: 0 }}
                      />
                    ) : (
                      reward.Reward_Amount
                    )}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {moment(reward?.createdAt).format("lll")
                      ? moment(reward?.createdAt).format("lll")
                      : "--"}
                  </TableCell>
                  <TableCell
                    style={{
                      color: reward.Status === "ACTIVE" ? "green" : "red",
                    }}
                  >
                    {reward.Status}
                  </TableCell>
                  <TableCell>
                    {reward.Status === "ACTIVE" && editingId === reward._id ? (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={isUpdating}
                          onClick={() =>
                            handleEditReward(reward._id, editingAmount)
                          }
                        >
                          Save
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => setEditingId(null)}
                          style={{ marginLeft: "8px" }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : reward.Status === "ACTIVE" ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          setEditingId(reward._id);
                          setEditingAmount(reward.Reward_Amount);
                        }}
                      >
                        Edit
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="primary"
                        className={classes.disabledButton}
                        disabled
                      >
                        Edit Disabled
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {rewards.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>No rewards found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={noOfPages.pages}
          page={page}
          onChange={handleChangePage}
        />
      </Box>
    </Box>
  );
}

export default RewardsManagement;
