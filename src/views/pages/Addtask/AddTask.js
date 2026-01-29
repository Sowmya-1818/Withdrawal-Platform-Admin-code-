import React, { useEffect, useState } from "react";
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
import { Pagination } from "@material-ui/lab"; // Correct import
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAPIHandler, deleteAPIHandler } from "src/ApiConfig/service";
import { toast } from "react-hot-toast";
import ConfirmationModal from "src/component/ConfirmationModal";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import GoBack from "src/component/GoBack";
import ListLoder from "src/component/ListLoder";
import NoDataFound from "src/component/NoDataFound";
import image from "../../../../src/images/StringEsports.png";

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
  //   "& .MuiAvatar-img": {
  //     color: "transparent",
  //     width: "100%",
  //     height: "100%",
  //     objectfit: "inherit",
  //     textalign: "center",
  //     textindent: "10000px",
  // }

   
  },
}));

function AddTask() {
  const classes = useStyles();
  const history = useNavigate();

  const [taskData, setTaskData] = useState([]);
  const [isTaskUpdating, setIsTaskUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });

  const gameManagementApi = async (source) => {
    try {
      setIsTaskUpdating(true);
      const response = await getAPIHandler({
        endPoint: "getTask",
        source: source,
      });

      console.log(response, "responseeeeeeeee");

      // Check if the API call was successful
      if (response.status === 200 && response.data.responseCode === 200) {
        const tasks = response.data.result;

        setTaskData(tasks); // Set the tasks in state

        // Set pagination info if available
        setNoOfPages({
          pages: Math.ceil(tasks.length / 10) || 1,
          totalPages: tasks.length,
        });
      } else {
        toast.error(
          response.data.responseMessage || "Failed to fetch tasks"
        );
      }
      setIsTaskUpdating(false);
    } catch (error) {
      console.error("Error fetching task data:", error);
      setTaskData([]); // Clear task data in case of error
      setIsTaskUpdating(false);
      toast.error("Error fetching task data");
    }
  };

  const deleteTaskApi = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteAPIHandler({
        endPoint: "deleteTask", // Make sure the endpoint is correct
        dataToSend: {
          _id: deleteId,
        },
      });

      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        setOpenDeleteModal(false);
        gameManagementApi();
      } else {
        toast.error(
          response.data.responseMessage || "Failed to delete task"
        );
      }
      setIsDeleting(false);
    } catch (error) {
      console.error("Error deleting task:", error);
      setIsDeleting(false);
      toast.error("Error deleting task");
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    gameManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [page]);

  const handleOpenDeleteModal = (id) => {
    setOpenDeleteModal(true);
    setDeleteId(id);
  };

  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title={"Tasks"} />
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history("/newaddtask", {
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
                  {[
                    "Sr.No",
                    "Task Name",
                    "Task Image",
                    "Sub Task",
                    "Task Description",
                    "Reward Points",
                    "Site Link",
                    "Site Image",
                    "Status",
                    "Action",
                  ].map((item, index) => (
                    <TableCell key={index}>{item}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Render Task Data */}
                {taskData &&
                  taskData.length > 0 &&
                  taskData
                    .slice((page - 1) * 10, page * 10)
                    .map((task, i) => (
                      <TableRow key={task._id}>
                        <TableCell>{(page - 1) * 10 + i + 1}</TableCell>
                        <TableCell>{task.TaskName || "--"}</TableCell>
                        <TableCell className="displayCenter">
                        <Box className="displayCenter">
                          <Avatar src={task.TaskImage} alt="Task Image" />
                          </Box>
                        </TableCell>
                           
                        <TableCell>{task.Subtask || "--"}</TableCell>
                        <TableCell>
                          {task.Description?.slice(0, 40)}{" "}
                          {task.Description?.length > 40 && "..."}
                        </TableCell>
                        <TableCell>{task.Rewardpoints || "--"}</TableCell>
                        <TableCell>
                          <a
                            href={task.Sitelink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit Site
                          </a>
                        </TableCell>
                        
                        <TableCell className="displayCenter">
                        <Box className="displayCenter">
                          <Avatar src={task.Siteimg} alt="Task Image" sx={{ width: 10, height: 10 }}/>
                          
                          </Box>
                        </TableCell>
                        <TableCell
                          style={
                            task.Status === "ACTIVE"
                              ? { color: "green" }
                              : task.Status === "INACTIVE"
                                ? { color: "red" }
                                : {} // Optional: Add default styling for other statuses
                          }
                        >
                          {task.Status}
                        </TableCell>

                        <TableCell>
                          <Box>
                            {/* <Tooltip title="View Task" arrow>
                              <IconButton
                                onClick={() =>
                                  history("/newaddtask", {
                                    state: {
                                      gameId: task._id, // Changed taskId to gameId
                                      type: "VIEW",
                                    },
                                  })
                                }
                              >
                                <IoMdEye />
                              </IconButton>
                            </Tooltip> */}
                            <Tooltip title="Edit Task" arrow>
                              <IconButton
                                onClick={() => {
                                  // Log the data being sent
                                  const editData = {
                                    taskId: task._id,               // Task ID
                                    taskName: task.TaskName,        // Task Name
                                    taskImage: task.TaskImage,      // Task Image
                                    subTask: task.Subtask,          // Sub Task
                                    description: task.Description,   // Task Description
                                    rewardPoints: task.Rewardpoints, // Reward Points
                                    siteLink: task.Sitelink,         // Site Link
                                    siteImage: task.Siteimg,         // Site Image
                                    Status: task.Status,     // Task Status
                                    type: "EDIT",                    // Type for Edit
                                  };

                                  console.log("Navigating to edit with data:", editData);

                                  // Navigate to newaddtask with state
                                  history("/newaddtask", {
                                    state: editData,
                                  });
                                }}
                                disabled={task.Status === "BLOCK"}
                              >
                                <MdEdit />
                              </IconButton>
                            </Tooltip>
                            {/* <Tooltip title="Delete Task" arrow>
                              <IconButton
                                onClick={() => {
                                  handleOpenDeleteModal(task._id);
                                }}
                              >
                                <MdDelete />
                              </IconButton>
                            </Tooltip> */}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}

                {/* Loader for Data Fetching */}
                {isTaskUpdating &&
                  [1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => {
                    return <ListLoder key={i} />;
                  })}

                {/* No Data Found */}
                {!isTaskUpdating && taskData && taskData.length === 0 && (
                  <NoDataFound text={"No task data found!"} />
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Confirmation Modals */}
          {openDeleteModal && (
            <ConfirmationModal
              open={openDeleteModal}
              isLoading={isDeleting}
              handleClose={() => {
                setOpenDeleteModal(false);
              }}
              title={"Delete Task"}
              desc={"Are you sure you want to delete this task?"}
              handleSubmit={deleteTaskApi}
            />
          )}

          {/* Pagination */}
          {!isTaskUpdating && noOfPages?.pages > 1 && (
            <Box mt={3} mb={2} className="displayEnd">
              <Pagination
                page={page}
                count={noOfPages.pages}
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

export default AddTask;


