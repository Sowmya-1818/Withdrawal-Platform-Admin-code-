import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import React from "react";
import { useNavigate } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  main: {
    "& .MuiDropzoneArea-root": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100px",
      minHeight: "0px",
      width: "100px",
      borderRadius: "50%",
      border: "1px solid",
      "& .MuiGrid-container": {
        justifyContent: "center",
      },
    },
    "& .MuiDropzoneArea-text": {
      display: "none",
    },

    "& .MuiButton-contained": {
      width: "100%",
      maxWidth: "300px",
      borderRadius: "5px",
    },
    "& .box": {
      marginTop: "30px",
      padding: "20px",
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0px 0px 33px -20px rgba(0,0,0,0.75)",
    },
  },
}));
function AddUser() {
  const classes = useStyles();
  const history = useNavigate();
  return (
    <div className={classes.main}>
      <Typography variant="h3"> Add User Details</Typography>
      <Box className="displayCenter">
        <Grid container xs={12} sm={8} spacing={3} className="box">
          <Grid item xs={4} className="displayStart">
            <Typography variant="h5"> Upload Profile Pic</Typography>
          </Grid>
          <Grid item xs={8} align="center">
            <DropzoneArea filesLimit={1} />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">First Name</Typography>
          </Grid>
          <Grid item xs={8}>
            <FormControl fullWidth>
              <TextField variant="outlined" fullWidth />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">Username</Typography>
          </Grid>
          <Grid item xs={8}>
            <FormControl fullWidth>
              <TextField variant="outlined" fullWidth />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">Email</Typography>
          </Grid>
          <Grid item xs={8}>
            <FormControl fullWidth>
              <TextField variant="outlined" fullWidth />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">Mobile Number</Typography>
          </Grid>
          <Grid item xs={8}>
            <FormControl fullWidth>
              <TextField variant="outlined" fullWidth />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">Address</Typography>
          </Grid>
          <Grid item xs={8}>
            <FormControl fullWidth>
              <TextField variant="outlined" fullWidth />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box className="displayCenter" gridGap={20} mb={4}>
              <Button variant="contained">Add</Button>
              <Button variant="contained">Back</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default AddUser;
