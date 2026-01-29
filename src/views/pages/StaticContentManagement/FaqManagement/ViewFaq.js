import Filtter from "src/component/Filtter";
import { Box, Paper, Typography, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAPIHandler } from "src/ApiConfig/service";
import { useLocation } from "react-router-dom";
import PageLoading from "src/component/PageLoading";
import GoBack from "src/component/GoBack";

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
    "& span": {
      color: "#52565c !important",
      background: "none !important",
    },
  },
}));
function ViewFaq() {
  const classes = useStyles();
  const history = useNavigate();
  const location = useLocation();
  const [faqsData, setFaqsData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const faqsManagementApi = async (source) => {
    try {
      setFaqsData({});
      setIsUpdating(true);
      const response = await getAPIHandler({
        endPoint: "viewFAQ",
        id: location?.state?.faqId,
        source: source,
      });
      if (response.data.responseCode === 200) {
        setFaqsData(response.data.result);
        setIsUpdating(false);
      }
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };
  useEffect(() => {
    const source = axios.CancelToken.source();
    if (location?.state?.faqId) {
      faqsManagementApi(source);
    }
    return () => {
      source.cancel();
    };
  }, [location?.state?.faqId]);
  return (
    <Box className={classes.main}>
      {isUpdating ? (
        <PageLoading />
      ) : (
        <Box>
          <Box mb={5}>
            <GoBack title={`${location?.state?.type} FAQ`} />
          </Box>
          <Paper elevation={3}>
            <Box mb={1}>
              <Typography variant="h6" style={{ color: "#FFFFFF" }}>
                Question
              </Typography>
              <Box>
                <Typography variant="body2" style={{ wordBreak: " break-all" }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: faqsData && faqsData?.question,
                    }}
                    style={{ display: "flex", flexWrap: "wrap" }}
                  ></div>
                </Typography>
              </Box>
            </Box>
            <Box mt={1}>
              <Typography variant="h6" style={{ color: "#FFFFFF" }}>
                Answer
              </Typography>
              <Box>
                <Typography variant="body2" style={{ wordBreak: " break-all" }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: faqsData && faqsData?.answer,
                    }}
                  ></div>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default ViewFaq;
