import GoBack from "src/component/GoBack";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAPIHandler, putAPIHandler } from "src/ApiConfig/service";
import { AuthContext } from "src/context/Auth";
import CopyWalletAddress from "src/component/CopyWalletAddress";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import toast from "react-hot-toast";
import ConfirmationModal from "src/component/ConfirmationModal";


const useStyle = makeStyles(() => ({
  mainDashBox: {
    height: "100%",
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    margin: "0",
    background: "linear-gradient(180deg, #19051C 0%, #580665 100%)",
    "& .card": {
      // padding: "50px 15px",
      borderRadius: "10px",
      textAlign: "center",
      boxShadow: "0px 0px 33px -20px rgba(0,0,0,0.75)",
      border: "2px solid red",

    },
    "& h5": {
      fontSize: "40px",
      fontWeight: 700,
      color: "#FFFFFF",
      fontFamily: "Poppins, sans-serif",  
    },

    "& .topPlayerBox": {
      backgroundImage: "url(images/playerbg.png)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      "& h3": {
        color: "rgba(255, 255, 255, 1)",
        fontWeight: "600",
        textAlign: "center",
        width: "auto",
        maxWidth: "600px",
      },
    },

    "& .mainStepBox": {
      height: "80%",
      padding: "31px",
      background: "rgba(255, 255, 255, 0.04)",
      borderRadius: "20px",
      overflow: "hidden",
      "& h6": {
        color: "#FFFFFF",
        fontSize: "35px",
        textAlign: "center",
        fontWeight: "500",
        lineHeight: "23px",
        marginTop: "22px",
        height: "30px",
      },
      "& p": {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: "16px",
        height: "34px",
      },
      "& .buttonBox": {
        "& button": {
          background: "#19051C",
          boxShadow: "0px 0px 10px 0px #580665 inset",
          color: "rgba(255, 255, 255, 1)",
          fontWeight: 700,
        },
      },
    },
  },
}));


export default function Dash() {
  const classes = useStyle();
  const location = useLocation();
  const auth = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDashboardUpdating, setIsDashboardUpdating] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const navigate = useNavigate();

  const dashbordManagementApi = async (source) => {
    try {
      setDashboardData({});
      setIsDashboardUpdating(true);
      const response = await getAPIHandler({
        endPoint: "dashBoard",
        source: source,
      });
      // console.log(response, "response from dashbordManagementApi");

      if (response.data.responseCode === 200) {
        setDashboardData(response.data.result);
        setIsDashboardUpdating(false);
      }
      setIsDashboardUpdating(false);
    } catch (error) {
      setIsDashboardUpdating(false);
    }
  };
  const data = [
    {
      title: "String Games",
      borderTop: "2px solid #FFB02D",
      borderBottom: "2px solid #FFB02D",
      link: "/addtask"
    },

    {
      title: "Retro",
      borderTop: "2px solid #158743",
      borderBottom: "2px solid #158743",
      link: "/addtask"
    },
    {
      title: "Modern",
      borderTop: "2px solid #FFB02D",
      borderBottom: "2px solid #FFB02D",
      link: "/addtask"
    },
    {
      title: "ROulette",
      borderTop: "2px solid #158743",
      borderBottom: "2px solid #158743",
      link: "/addtask"
    },
  ];
  useEffect(() => {
    const source = axios.CancelToken.source();
    dashbordManagementApi(source);
    return () => {
      source.cancel();
    };
  }, []);

  const isWalletConnected = async () => {
    try {
      setIsUpdate(true);
      const solana = window.solana;
      if (solana) {
        if (solana.isPhantom) {
          const response = await solana.connect({ onlyIfTrusted: false });
          handleUpdateAdminWallet(response.publicKey.toString());
        } else {
          toast.error("Please install phantom wallet!");
        }
      } else {
        toast.error("Please install phantom wallet!");
      }
    } catch (error) {
      console.log(error);
      setIsUpdate(false);
    }
  };

  const handleUpdateAdminWallet = async (address) => {
    try {
      const response = await putAPIHandler({
        endPoint: "editAdminWallet",
        dataToSend: {
          wallet: address,
        },
      });
      if (response.data.responseCode === 200) {
        toast.success(response.data.responseMessage);
        auth.getProfileDataApi();
        setConfirmationModal(false);
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsUpdate(false);
    } catch (error) {
      setIsUpdate(false);
      console.log(error);
    }
  };

  return (
    <Box className={classes.mainDashBox}>
      <Typography variant="h5" sx={{ fontSize: "32px", fontWeight: "bold", TextDecoder: "uppercase" }}>
        WELCOME TO STRING WITHDRAW PLATFORM
      </Typography>



      {/* <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box mt={2}>
            <Paper elevation={3}>
              {auth?.userData?.userType === "ADMIN" && (
                <Box mb={2} className="displaySpacebetween">
                  <Box className="displayStart">
                    <Typography variant="h6">Admin Wallet : </Typography>
                    &nbsp;
                    {auth?.userData?.wallet ? (
                      <CopyWalletAddress address={auth?.userData?.wallet} />
                    ) : (
                      "..."
                    )}
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isUpdate}
                    onClick={() => setConfirmationModal(true)}
                  >
                    Connect Wallet {isUpdate && <ButtonCircularProgress />}
                  </Button>
                </Box>
              )}
              <Grid container spacing={2}>
                {data &&
                  data?.map((item, i) => (
                    <Grid item xs={12} sm={6} md={4}>
                      <Box className="topPlayerBox"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(item.link)}
                      >
                        <Box className="playerContentBox">
                          <Box
                            className="mainStepBox"
                            align="center"
                            style={{
                              borderTop: item && item?.borderTop,
                              borderBottom: item && item?.borderBottom,
                            }}
                          >
                            <Box>
                              <Typography variant="body1">
                                {item?.title}
                              </Typography>
                              <Typography variant="h6">
                                {item?.title === "Total Registered User"
                                  ? dashboardData?.totalUsers
                                    ? dashboardData?.totalUsers
                                    : "0"
                                  : item?.title === "Total Transaction User"
                                  ? dashboardData?.transactionCounts
                                    ? dashboardData?.transactionCounts
                                    : "0"
                                  : item?.title === "Total Game"
                                 
                                    ? dashboardData?.totalGames
                                    : "0"
                                 
                                 
                                  
                                  }
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            </Paper>
          </Box>
        </Grid>
      </Grid> */}
      {confirmationModal && (
        <ConfirmationModal
          open={confirmationModal}
          isLoading={isUpdate}
          handleClose={() => setConfirmationModal(false)}
          title={"Change Wallet"}
          desc={"Are you sure, you want to change admin wallet?"}
          handleSubmit={(item) => isWalletConnected(item)}
        />
      )}
    </Box>
  );
}
