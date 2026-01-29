import React, { useContext, useEffect, useState } from "react";
import { Box, Button, makeStyles, Typography, Grid } from "@material-ui/core";
import { useNavigate, useLocation } from "react-router-dom";
import { getAPIHandler, postAPIHandler } from "src/ApiConfig/service";
import axios from "axios";
import { toast } from "react-hot-toast";
import moment from "moment";
import ConfirmationModal from "src/component/ConfirmationModal";
import GoBack from "src/component/GoBack";
import { sortAddress } from "src/utils";
import { AuthContext } from "src/context/Auth";
import { RPC } from "src/constants";
import * as solanaWeb3 from "@solana/web3.js";
import CopyToClipboard from "react-copy-to-clipboard";
import { FaRegCopy } from "react-icons/fa";
const useStyles = makeStyles((theme) => ({
  muiMainContainer: {
    "& .head": {
      padding: "50px 20px 20px 20px",
      borderBottom: "1px solid #000",
    },
    "& .mainBox": {
      padding: "30px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      "& p": {
        color: "#FFFFFF",
      },
    },
    "& .secendMainBox": {
      height: "300px",
      maxWidth: "1000px",
      width: "100%",
      "& .filterBtn": {
        height: "55px",
        maxWidth: "180px",
        width: "100%",
      },
    },
  },
}));

const DepositTransuctionDetail = () => {
  const classes = useStyles();
  const history = useNavigate();
  const location = useLocation();
  const auth = useContext(AuthContext);
  const [isUserUpdating, setIsUserUpdating] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isApproveRejectUpdating, setIsApproveRejectUpdating] = useState(false);
  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");
  console.log("errorerror==>>>", error);
  const [statusError, setStatusError] = useState("");
  const [filtersData, setFiltersData] = useState({
    status: "APPROVE",
   
  });

  console.log("error==", error);

  const walletManagementApi = async (source) => {
    try {
      setUserData({});
      setIsUserUpdating(true);
      const response = await getAPIHandler({
        endPoint: "viewTransactionHistory",
        paramsData: {
          transactionId: location?.state?.transactionId,
        },
        source: source,
      });
console.log(response, "response viewTransactionHistory");

      if (response.data.responseCode === 200) {
        setUserData(response.data.result);

        setIsUserUpdating(false);
      }
      setIsUserUpdating(false);
    } catch (error) {
      setIsUserUpdating(false);
    }
  };

  const TRANSFER_REDUCTION_PERCENTAGE = 0.8;

  const transferSol = async () => {
    try {
      if (!window.solana) {
        throw new Error("Solana wallet extension not found.");
      }
      if (Number(auth?.solbalance) > Number(userData?.amount)) {
        setIsApproveRejectUpdating(true);
        const connection = new solanaWeb3.Connection(RPC, "confirmed");
        const recipientPublicKey = new solanaWeb3.PublicKey(
          userData?.walletAddress
        );

        const lamportsAmount = Math.round(
          parseFloat(userData?.amount) *
            TRANSFER_REDUCTION_PERCENTAGE *
            Math.pow(10, 9)
        ); // Ensure the result is an integer

        const transaction = new solanaWeb3.Transaction().add(
          solanaWeb3.SystemProgram.transfer({
            fromPubkey: window.solana.publicKey,
            toPubkey: recipientPublicKey,
            lamports: lamportsAmount, // Rounded integer value
          })
        );

        transaction.feePayer = window.solana.publicKey;
        transaction.recentBlockhash = (
          await connection.getLatestBlockhash()
        ).blockhash;

        const signedTransaction = await window.solana.signTransaction(
          transaction
        );
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );
        await connection.confirmTransaction({
          signature,
          commitment: "confirmed",
        });

        approveRejectApi(signature);
      } else {
        toast.error("Your balance is too low.");
      }
    } catch (error) {
      setIsApproveRejectUpdating(false);
      console.error("Error transferring SOL:", error);
      if (error.message === "User rejected the request") {
        toast.error("User rejected the request");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  const approveRejectApi = async (hash) => {
    try {
      setIsApproveRejectUpdating(true);

      const response = await postAPIHandler({
        endPoint: "approveRejectWithdrawal",
        dataToSend: {
          transactionId: userData?._id,
          status: filtersData?.status,
          reason: filtersData?.reason !== "" ? filtersData?.reason : undefined,
          hash: hash ? hash : undefined,
        },
      });
      console.log(response, "response approveRejectWithdrawal");
      
      if (response.data.responseCode == 200) {

        toast.success(response.data.responseMessage );
        history("/pendingwithdrawals");
      } else {
        toast.error(response.data.responseMessage);
      }
      setIsApproveRejectUpdating(false);
    } catch (error) {
      setIsApproveRejectUpdating(false);
      console.log(error);
      toast.error(error.response.data.responseMessage);
    }
  };
  useEffect(() => {
    const source = axios.CancelToken.source();
    walletManagementApi(source);
    return () => {
      source.cancel();
    };
  }, [location?.state?.userId]);

  const handleChange = (e) => {
    setFiltersData({ ...filtersData,  });
    console.log("filtersData", filtersData);

  };

  const handleBlur = () => {
    handleChange();
  };

  return (
    <Box className={classes.muiMainContainer}>
      <GoBack title={`${userData?.status}  Transaction Details`} />
      <Box className="mainBox">
        <Grid container spacing={2}>
          <Grid item lg={3} md={3} sm={4} xs={12}>
            <Typography variant="body2">Username:</Typography>
          </Grid>
          <Grid item lg={9} md={9} sm={8} xs={12}>
            <Typography variant="body2">{userData?.userId?.userName || ""}</Typography>
          </Grid>

          <Grid item lg={3} md={3} sm={4} xs={12}>
            <Typography variant="body2">Wallet Address:</Typography>
          </Grid>
          <Grid item lg={9} md={9} sm={8} xs={12}>
            <Box className="displayStart">
              <Typography variant="body2">
                {userData && userData?.walletAddress
                  ? sortAddress(userData?.walletAddress)
                  : "..."}
              </Typography>
              {userData?.walletAddress && (
                <CopyToClipboard
                  text={userData.walletAddress}
                  onCopy={() => toast.success("Copied to clipboard")}
                >
                  <FaRegCopy
                    size={14}
                    style={{
                      cursor: "pointer",
                      color: "#fff",
                      marginLeft: "5px",
                    }}
                  />
                </CopyToClipboard>
              )}
            </Box>
          </Grid>
          <Grid item lg={3} md={3} sm={4} xs={12}>
            <Typography variant="body2">Transaction Hash:</Typography>
          </Grid>
          <Grid item lg={9} md={9} sm={8} xs={12}>
            <Typography variant="body2">
              {userData && userData?.hash ? sortAddress(userData?.hash) : "..."}
            </Typography>
          </Grid>
          <Grid item lg={3} md={3} sm={4} xs={12}>
            <Typography variant="body2">Amount (In USDT):</Typography>
          </Grid>
          <Grid item lg={9} md={9} sm={8} xs={12}>
            <Typography variant="body2">
              {userData && userData?.amount ? userData?.amount : "..."}
            </Typography>
          </Grid>
          <Grid item lg={3} md={3} sm={4} xs={12}>
            <Typography variant="body2">Charge:</Typography>
          </Grid>
          <Grid item lg={9} md={9} sm={8} xs={12}>
            <Typography variant="body2">
              {userData && userData?.charge ? userData?.charge : "..."}
            </Typography>
          </Grid>
          <Grid item lg={3} md={3} sm={4} xs={12}>
            <Typography variant="body2">After Charge:</Typography>
          </Grid>
          <Grid item lg={9} md={9} sm={8} xs={12}>
            <Typography variant="body2">
              {userData && userData?.AfterCharge ? userData?.AfterCharge : "..."}
            </Typography>
          </Grid>
          <Grid item lg={3} md={3} sm={4} xs={12}>
            <Typography variant="body2">quantity:</Typography>
          </Grid>
          <Grid item lg={9} md={9} sm={8} xs={12}>
            <Typography variant="body2">
              {userData && userData?.quantity ? userData?.quantity : "..."}
            </Typography>
          </Grid>
          <Grid item lg={3} md={3} sm={4} xs={12}>
            <Typography variant="body2">Created Date & Time:</Typography>
          </Grid>
          <Grid item lg={9} md={9} sm={8} xs={12}>
            <Typography variant="body2">
              {" "}
              {moment(userData?.createdAt).format("lll")}
            </Typography>
          </Grid>
          {userData?.status !== "PENDING" && (
            <Grid item lg={3} md={3} sm={4} xs={12}>
              <Typography variant="body2">
                {userData?.status === "REJECT" ? "Rejection" : "Approval"} Date
                & Time:
              </Typography>
            </Grid>
          )}
          {userData?.status !== "PENDING" && (
            <Grid item lg={9} md={9} sm={8} xs={12}>
              <Typography variant="body2">
                {" "}
                {moment(userData?.updatedDate).format("lll")}
              </Typography>
            </Grid>
          )}
          <Grid item lg={3} md={3} sm={4} xs={12}>
            <Typography variant="body2">Status:</Typography>
          </Grid>
          <Grid item lg={9} md={9} sm={8} xs={12}>
            <Typography variant="body2">
              {userData?.status == "APPROVE"
                ? "APPROVED"
                : userData?.status || "..."}
            </Typography>
          </Grid>
          {userData?.status == "REJECT" && (
            <>
              <Grid item lg={3} md={3} sm={4} xs={12}>
                <Typography variant="body2">Reason:</Typography>
              </Grid>
              <Grid item lg={9} md={9} sm={8} xs={12}>
                <Typography variant="body2">
                  {userData?.reason || "..."}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
      <Box className="displayCenter">
        {userData?.status === "PENDING" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenApproveModal(true);
            }}
          >
            Take Action
          </Button>
        )}

        <Box ml={1}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              history(-1);
            }}
          >
            BACK
          </Button>
        </Box>
      </Box>
      {openApproveModal && (
        <ConfirmationModal
          open={openApproveModal}
          isLoading={isApproveRejectUpdating}
          handleClose={() => {
            setOpenApproveModal(false);
          }}
          filter={filtersData}
          setFilter={setFiltersData}
          type="reason"
          handleBlur={handleBlur}
          title={filtersData?.status}
          desc={`Are you sure, you want to ${filtersData?.status} this Withdrawal Request ?`}
          handleSubmit={(item) => {

            approveRejectApi(item);
            // if (filtersData?.status == "APPROVE") {
            //   transferSol(item);
            // } else {
            //   setIsSubmit(true);
            //   handleChange({ target: { value: filtersData?.reason } });
            //   if (error == "" && filtersData.reason !== "") {
            //     setIsSubmit(false);
            //     approveRejectApi(item);
            //   }
            // }
          }}
          error={error}
          setError={setError}
          auth={auth}
          isSubmit={isSubmit}
        />
      )}
    </Box>
  );
};

export default DepositTransuctionDetail;
