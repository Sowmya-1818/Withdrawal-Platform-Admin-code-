import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAPIHandler } from "src/ApiConfig/service";
import { useLocation } from "react-router-dom";
import PageLoading from "src/component/PageLoading";
import GoBack from "src/component/GoBack";

const useStyles = makeStyles((theme) => ({
  main: {},
}));
function ViewStatic() {
  const classes = useStyles();
  const history = useNavigate();
  const location = useLocation();
  const [staticData, setStaticData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const staticManagementApi = async (source, id) => {
    try {
      setStaticData([]);
      setIsUpdating(true);
      const response = await getAPIHandler({
        endPoint: "viewStaticContent",
        paramsData: {
          type: location?.state?.type,
        },
        source: source,
      });
      if (response.data.responseCode === 200) {
        setStaticData(response.data.result);
        setIsUpdating(false);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };
  useEffect(() => {
    const source = axios.CancelToken.source();
    if (location?.state?.type) {
      staticManagementApi(source, location?.state?.type);
    }
    return () => {
      source.cancel();
    };
  }, [location?.state?.type]);
  return (
    <Box className={classes.main}>
      {isUpdating ? (
        <PageLoading />
      ) : (
        <>
          <Box mb={5}>
            <GoBack title={`View ${staticData && staticData?.title}`} />
          </Box>
          <Paper elevation={3}>
            <Typography variant="body2">
              <div
                dangerouslySetInnerHTML={{
                  __html: staticData && staticData?.description,
                }}
              ></div>
            </Typography>
            {staticData?.title === "CONTACT_US" && (
              <>
                <Box mb={1}>
                  <Typography variant="h6" style={{ color: "#fff" }}>
                    Recomended Contact Mails
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {staticData?.email &&
                    staticData?.email.map((data, index) => {
                      return (
                        <Grid item xs={12} sm={3} md={3}>
                          <Button
                            variant="contained"
                            color="secondary"
                            style={{ textTransform: "none" }}
                          >
                            <Typography
                              variant="body2"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                const recipientEmail = data?.email;
                                const mailtoLink = `mailto:${recipientEmail}`;
                                window.open(mailtoLink);
                              }}
                            >
                              {data?.email}
                            </Typography>
                          </Button>
                        </Grid>
                      );
                    })}
                </Grid>
              </>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}

export default ViewStatic;
