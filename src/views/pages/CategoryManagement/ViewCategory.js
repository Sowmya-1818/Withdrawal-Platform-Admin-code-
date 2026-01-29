import { getAPIHandler } from "src/ApiConfig/service";
import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  main: {
    height: "100%",
    "& .detailsBG": {
      maxWidth: "900px",
      width: "100%",
      height: "auto",
      padding: "30px",
      borderRadius: "15px",
      background: "#fff",
      flexDirection: "column",
      boxShadow: "0px 0px 33px -20px rgba(0,0,0,0.75)",
    },
  },
}));
function ViewCategory() {
  const classes = useStyles();
  const location = useLocation();
  const history = useNavigate();
  const [categoryData, setCategoryData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const getCategoryApi = async (source) => {
    try {
      setCategoryData({});
      setIsUpdating(true);
      const response = await getAPIHandler({
        endPoint: "viewCategory",
        paramsData: {
          _id: location?.state.categoryId,
        },
        source: source,
      });

      if (response.data.responseCode === 200) {
        setCategoryData(response.data.result);
        setIsUpdating(false);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };
  useEffect(() => {
    getCategoryApi();
  }, [location?.state.categoryId]);

  return (
    <div className={classes.main}>
      <Box p={3}>
        <Typography variant="h4">CATEGORY DETAIL</Typography>
      </Box>
      <Divider />

      <Box className="displayCenter" style={{ height: "calc(100% - 100px)" }}>
        <Box className="displayCenter detailsBG">
          <Grid item xs={12} align="center">
            <img
              src={
                categoryData && categoryData?.categoryIcon
                  ? categoryData?.categoryIcon
                  : "images/user.png"
              }
              alt="user"
              width="100px"
              height="100px"
              style={{ borderRadius: "50px" }}
            />
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography variant="h5">Category Title</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                variant="outlined"
                value={
                  categoryData && categoryData?.categoryTitle
                    ? categoryData?.categoryTitle
                    : "--"
                }
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h5">Status</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                variant="outlined"
                value={
                  categoryData && categoryData?.status
                    ? categoryData?.status
                    : "--"
                }
                disabled
              />
            </Grid>

            <Grid
              container
              xs={12}
              alignItems="center"
              justifyContent="center"
              style={{ marginTop: "40px" }}
            >
              <Grid item xs={3} align="center">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    history(-1);
                  }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default ViewCategory;
