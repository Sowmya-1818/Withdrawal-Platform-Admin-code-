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
import { useLocation,useNavigate  } from "react-router-dom";
import axios from "axios";
import { getAPIHandler, putAPIHandler } from "src/ApiConfig/service";
import { AuthContext } from "src/context/Auth";
import CopyWalletAddress from "src/component/CopyWalletAddress";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import toast from "react-hot-toast";
import ConfirmationModal from "src/component/ConfirmationModal";
import USerHistories from "../Userhistories/USerHistories";

const useStyle = makeStyles(() => ({
  mainDashBox: {
    "& .card": {
      padding: "50px 15px",
      borderRadius: "10px",
      textAlign: "center",
      boxShadow: "0px 0px 33px -20px rgba(0,0,0,0.75)",
    },
    "& h5": {
      fontSize: "28px",
      fontWeight: 700,
      color: "#FFFFFF",
      textTransform: "capitalize",
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
      // height: "50%",
      height: "75px", // Change the height here
   
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


export default function UserDashboard() {
  const classes = useStyle();
  const location = useLocation();
  const auth = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDashboardUpdating, setIsDashboardUpdating] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const navigate = useNavigate();

  const id = location.pathname.split("/")[2]; // Assuming `id` is passed via state in the location
  
  const dashbordManagementApi = async (source) => {
    try {
      if (!id) {
        throw new Error("ID is required");
      }
      setDashboardData({});
      setIsDashboardUpdating(true);
      const response = await getAPIHandler({
        endPoint: `userDashboard`,
        source: source,
        paramsData: {
          id,
        },
      });
      console.log(response, "response from dashbordManagementApi");
      
      if (response.data.responseCode === 200) {
        setDashboardData(response.data.result);
      }
      setIsDashboardUpdating(false);
    } catch (error) {
      setIsDashboardUpdating(false);
      console.error(error);
    }
  };

  const data = [
    {
      title: "Current Balance",
      color: "#FFB02D",
      borderTop: "2px solid #FFB02D",
      borderBottom: "2px solid #FFB02D",
      render: () => (
        <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
          <div style={{  color: "#FFFFFF", fontSize: "20px", textAlign: "left" }}>
            {dashboardData?.TotalUserBalance || "0"}
          </div> 
        </div>
      ),
    },
    {
      title: "Total Invest",
      color: "#FFB02D",
      borderTop: "2px solid #FFB02D",
      borderBottom: "2px solid #FFB02D",
      render: () => (
        <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
          <div style={{  color: "#FFFFFF", fontSize: "20px", textAlign: "left" }}>
            {dashboardData?.totalinvestment || "0"}
          </div> 
        </div>
      ),
    },
    {
      title: `Total Games: ${dashboardData?.totalGames || "0"}`,  // Corrected title format
      borderTop: "2px solid #FFB02D",
      borderBottom: "2px solid #FFB02D",
      render: () => (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
          <div style={{  color: "#FFFFFF", fontSize: "20px", textAlign: "left" }}>
            <span style={{ fontSize: "16px", display: "block", marginBottom: "5px" }}>Wins</span>
            {dashboardData?.totalwins || "0"}
          </div>
          
          {/* Display Total Ads Watched */}
          <div style={{  textAlign: "right", color: "#FFFFFF", fontSize: "20px" }}>
            <span style={{ fontSize: "16px", display: "block", marginBottom: "5px" }}>Losses</span>
            {dashboardData?.totalloss || "0"}
          </div>
        </div>
      ),
    },
    
  
    {
      title: "Daily Bonus",
      borderTop: "2px solid #FFB02D",
      borderBottom: "2px solid #FFB02D",
      render: () => (
        <div style={{ position: "relative", padding: "10px" }}>
       
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ color: "#FFFFFF", fontSize: "20px", textAlign: "left" }}>
              <span style={{ fontSize: "16px", display: "block", marginBottom: "5px" }}>Count</span>
              {dashboardData?.Totaldailyrewards || "0"} 
            </div>
            <div style={{ textAlign: "right", color: "#FFFFFF", fontSize: "20px" }}>
              <span style={{ fontSize: "16px", display: "block", marginBottom: "5px" }}>Reward</span>
              {dashboardData?.totaldailybonus|| "0"}
            </div>
          </div>
        </div>
      ),
    },
    
    
    {
      title: " Ads ",
      borderTop: "2px solid #DE14FF",
      borderBottom: "2px solid #DE14FF",
      render: () => (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
          
          {/* Display Total Rewards */}
          <div style={{  color: "#FFFFFF", fontSize: "20px", textAlign: "left" }}>
            <span style={{ fontSize: "16px", display: "block", marginBottom: "5px" }}>Total Rewards</span>
            {dashboardData?.totaladsReward || "0"}
          </div>
          
          {/* Display Total Ads Watched */}
          <div style={{  textAlign: "right", color: "#FFFFFF", fontSize: "20px" }}>
            <span style={{ fontSize: "16px", display: "block", marginBottom: "5px" }}>Total Ads Watched</span>
            {dashboardData?.totaladswatched || "0"}
          </div>
          
        </div>
      ),
    },
    
    {
      title: "Refferals",
      borderTop: "2px solid #158743",
      borderBottom: "2px solid #158743",
      render: () => (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
          <div style={{  color: "#FFFFFF", fontSize: "20px", textAlign: "left" }}>
          <span style={{ fontSize: "16px", display: "block", marginBottom: "5px" }}>Count</span>
            {dashboardData?.TotalReferrals || "0"} 
          </div>
          <div style={{  textAlign: "right", color: "#FFFFFF", fontSize: "20px" }}>
            <span style={{ fontSize: "16px", display: "block", marginBottom: "5px" }}>Reward</span>
            {dashboardData?.totalreferralreward || "0"}
          </div>
        </div>
      ),
    },
    {
      title: "Tasks ",
      borderTop: "2px solid #158743",
      borderBottom: "2px solid #158743",
      render: () => (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
          <div style={{  color: "#FFFFFF", fontSize: "20px", textAlign: "left" }}>
          <span style={{ fontSize: "16px", display: "block", marginBottom: "5px" }}>Count</span>
            {dashboardData?.totalusertasks || "0"} 
          </div>
          <div style={{  textAlign: "right", color: "#FFFFFF", fontSize: "20px" }}>
            <span style={{ fontSize: "16px", display: "block", marginBottom: "5px" }}>Reward</span>
            {dashboardData?.totaltaskReward || "0"}
          </div>
        </div>
      ),
    },
  
    {
      title: `Withdrawals:${dashboardData?.totalWithdrawlCounts || "0"}`,
      borderTop: "2px solid #FFB02D",
      borderBottom: "2px solid #FFB02D",
      render: () => (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
          <div style={{  color: "#FFFFFF", fontSize: "20px", textAlign: "left" }}>
          <span style={{ fontSize: "16px", display: "block", marginBottom: "5px" }}>USDT</span>
            {dashboardData?.totalUSDTWithdrawlAmount || "0"} 
          </div>
          <div style={{  textAlign: "right", color: "#FFFFFF", fontSize: "20px" }}>
            <span style={{ fontSize: "16px", display: "block", marginBottom: "5px" }}>Tokens</span>
            {dashboardData?.totalWithdrawlAmount || "0"}
          </div>
        </div>
      ),
    },
    
    {
      title: "Boosters",
      borderTop: "2px solid #FFB02D",
      borderBottom: "2px solid #FFB02D",
      render: () => (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
        <div style={{  color: "#FFFFFF", fontSize: "20px", textAlign: "left" }}>
        <span style={{ fontSize: "16px", display: "block", marginBottom: "5px" }}>Count</span>
            {dashboardData?.totalboosters || "0"} 
          </div>
          <div style={{  textAlign: "right", color: "#FFFFFF", fontSize: "20px" }}>
            <span style={{ fontSize: "16px", display: "block", marginBottom: "5px" }}>Rewards</span>
            {dashboardData?.boostersAmount || "0"}
          </div>
        </div>
      ),
    },
    
  ];

  useEffect(() => {
    const source = axios.CancelToken.source();
    dashbordManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [id]);

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
      <Box mb={2}>
        
        
        <Typography variant="h5">{`${location?.state?.userName || "User"} Dashboard`}</Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box mt={2}>
            <Paper elevation={3}>
              <Grid container spacing={2}>
                {data &&
                  data.map((item, i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                      <Box className="topPlayerBox">
                        <Box className="playerContentBox">
                          <Box
                            className="mainStepBox"
                            align="center"
                            style={{
                              borderTop: item?.borderTop,
                              borderBottom: item?.borderBottom,
                            }}
                          >
                            <Box>
                              <Typography variant="body1">{item?.title}</Typography>
                              {item?.render ? (
                                item.render()
                              ) : (
                                <Typography variant="h6">
                                   {
                                  // item?.title === "Total Invest"
                                  //   ? dashboardData?.totalinvestment || "0"
                                    // : item?.title === "Total Games"
                                    //   ? dashboardData?.totalGames || "0"
                                    // : item?.title === "Total Win Amount"
                                    //   ? dashboardData?.totalwins || "0"
                                    // : item?.title === "Total Loss Amount"
                                    //   ? dashboardData?.totalloss || "0"
                                    // : item?.title === "Total Daily Bonus"
                                    //   ? dashboardData?.totaladsReward || "0"
                                    // : item?.title === "Total Ads Reward Amount"
                                    //   ? dashboardData?.totaladswatched || "0"
                                    // : item?.title === "Total Refferal Amount"
                                    //   ? dashboardData?.totalReferralAmount || "0"
                                    // : item?.title === "Total Task Rewards"
                                    //   ? dashboardData?.totaltaskReward || "0"
                                    // : item?.title === "Total User Tasks"
                                    //   ? dashboardData?.totalusertasks || "0"
                                    // : item?.title === "Withdrawal Count"
                                    //   ? dashboardData?.totalWithdrawlAmount || "0"
                                    // : item?.title === "Total Withdrawal Amount"
                                    //   ? dashboardData?.totalWithdrawalAmount || "0"
                                    // : item?.title === "Total Transaction User"
                                    //   ? dashboardData?.transactionCounts || "0"
                                    // : item?.title === "Total Boosters"
                                    //   ? dashboardData?.totalboosters || "0"
                                    // : item?.title === "Total Booster Amount"
                                    //   ? dashboardData?.boostersAmount || "0"
                                    // : dashboardData?.pendingContactUs || "0"
                                }


                                </Typography>
                              )}
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
        <Grid item xs={12} >
          <Paper className={classes.section} elevation={3}>
            <Typography className={classes.header}>User Histories</Typography>
            <USerHistories />
          </Paper>
        </Grid>
      </Grid>
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
