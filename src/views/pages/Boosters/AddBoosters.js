

import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Button,
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
import { Pagination } from "@material-ui/lab"; // Correct import
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAPIHandler, deleteAPIHandler } from "src/ApiConfig/service";
import { toast } from "react-hot-toast";
import ConfirmationModal from "src/component/ConfirmationModal";
import { MdDelete, MdEdit } from "react-icons/md";
import GoBack from "src/component/GoBack";
import ListLoder from "src/component/ListLoder";
import NoDataFound from "src/component/NoDataFound";

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

function AddBoosters() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [boosters, setBoosters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [pagination, setPagination] = useState({
    pages: 1,
    totalItems: 1,
  });

  const fetchBoosters = async () => {
    try {
      setIsLoading(true);
      const response = await getAPIHandler({
        endPoint: "getBoosters",
      });
      console.log(response, response.data.responseCode, "response from fetchBoosters");
      if (response.data.responseCode === 200) {
        console.log(response.data.result);

        let data = response.data.result; // Use `let` to allow modification
        // console.log(data.result,"data bs");

        // Filter boosters to only include those with status "Active"
        // console.log(data.Status, "data.result")
        console.log(data, "data from fetchBoosters");

        console.log(data, "data filters");
        setBoosters(data);
        setPagination({
          pages: Math.ceil(data.length / 10),
          totalItems: data.length,
        });
      } else {
        toast.error(
          response.data.responseMessage || "Failed to fetch boosters."
        );
      }
    } catch (error) {
      console.error("Error fetching boosters:", error);
      toast.error("Error fetching boosters.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBooster = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteAPIHandler({
        endPoint: "deleteTask",
        dataToSend: {
          _id: deleteId,
        },
      });

      if (response.data.responseCode === 200) {
        toast.success("Booster deleted successfully.");
        setOpenDeleteModal(false);
        fetchBoosters();
      } else {
        toast.error(
          response.data.responseMessage || "Failed to delete booster."
        );
      }
    } catch (error) {
      console.error("Error deleting booster:", error);
      toast.error("Error deleting booster.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchBoosters();
  }, [page]);

  const openDeleteDialog = (id) => {
    setOpenDeleteModal(true);
    setDeleteId(id);
  };

  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title="Boosters Page" />
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/newbooster", { state: { type: "ADD" } })}
        >
          Add Booster
        </Button>
      </Box>

      <Grid container>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Sr. No",
                    "Booster Name",
                    "Image",
                    "Description",
                    "Multiplier",
                    "Price",
                    "Timer (mins)",
                    "Status",
                    "Actions",
                  ].map((head, idx) => (
                    <TableCell key={idx}>{head}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {boosters.length > 0 &&
                  boosters
                    .slice((page - 1) * 10, page * 10)
                    .map((booster, idx) => (
                      <TableRow key={booster._id}>
                        <TableCell>{(page - 1) * 10 + idx + 1}</TableCell>
                        <TableCell>{booster.Name || "--"}</TableCell>
                        {/* <TableCell>{booster.Image || "--"}</TableCell> */}
                        {/* <TableCell>
                          <Avatar src={booster.Image} alt="Task Image" />
                        </TableCell> */}
                        <TableCell className="displayCenter">
                          <Box className="displayCenter">
                            <Avatar src={booster.Image} alt="Task Image" />
                          </Box>
                        </TableCell>
                        <TableCell>{booster.Description || "--"}</TableCell>
                        <TableCell>
                          {booster.Booster_Multiplier || "--"}
                        </TableCell>
                        <TableCell>{booster.Price || "--"}</TableCell>
                        <TableCell>{booster.Timer_InMinutes || "--"}</TableCell>



                        <TableCell
                          style={
                            booster.Status === "ACTIVE"
                              ? { color: "green" }
                              : booster.Status === "INACTIVE"
                                ? { color: "red" }
                                : {} // Optional: Add default styling for other Statuses
                          }
                        >
                          {booster.Status}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Tooltip title="Edit Booster">
                              <IconButton
                                onClick={() =>
                                  navigate("/newbooster", {
                                    state: {
                                      type: "EDIT",
                                      boosterId: booster._id,
                                      boosterName: booster.Name,
                                      Image: booster.Image,
                                      Price: booster.Price,
                                      Description: booster.Description,
                                      Booster_Multiplier:
                                        booster.Booster_Multiplier,
                                      timerInMinutes: booster.Timer_InMinutes,
                                      Status: booster.Status,
                                    },
                                  })
                                }
                              >
                                <MdEdit />
                              </IconButton>
                            </Tooltip>
                            {/* <Tooltip title="Delete Booster">
                              <IconButton
                                onClick={() => openDeleteDialog(booster._id)}
                              >
                                <MdDelete />
                              </IconButton>
                            </Tooltip> */}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}

                {isLoading &&
                  Array.from({ length: 8 }).map((_, idx) => (
                    <ListLoder key={idx} />
                  ))}

                {!isLoading && boosters.length === 0 && <NoDataFound />}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            count={pagination.pages}
            page={page}
            onChange={(e, value) => setPage(value)}
            variant="outlined"
            shape="rounded"
          />
        </Grid>
      </Grid>

      {openDeleteModal && (
        <ConfirmationModal
          title="Delete Booster"
          isOpen={openDeleteModal}
          closeModal={() => setOpenDeleteModal(false)}
          actionButtonText="Delete"
          isProcessing={isDeleting}
          onAction={deleteBooster}
          description="Are you sure you want to delete this booster?"
        />
      )}
    </Box>
  );
}

export default AddBoosters;
