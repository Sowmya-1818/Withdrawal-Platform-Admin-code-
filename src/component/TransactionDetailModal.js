import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  makeStyles,
  Divider,
} from "@material-ui/core";
import React from "react";
import { IoMdClose } from "react-icons/io";

const useStyle = makeStyles((theme) => ({
  transactionModalBox: {},
  detailsBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom:"10px",
    "& .blackText":{
        color:"#000 !important"
    }
  },
}));

export default function TransactionDetailModal({setDepositModal,depositModal}) {
  const classes = useStyle();
  return (
    <Dialog
    open={depositModal}
    onClose={()=>setDepositModal(false)}
    fullWidth
    maxWidth="xs"
    >
      <DialogContent>
      <IconButton
              style={{ position: "absolute", top: "5px", right: "5px" }}
              onClick={()=>setDepositModal(false)}
            >
              <IoMdClose />
            </IconButton>
            <Box align="center">
              <Box my={2}>
                <Typography variant="h6">Transaction Details</Typography>
              </Box>
              <Divider style={{ height: "2px", marginBottom: "20px" }} />
              <Box align="center">
                <Typography variant="body1">Amount</Typography>
                <Typography variant="h6">2333.7362372728672</Typography>
                <Typography variant="body1" style={{ color: "#3A8738" }}>
                  completed
                </Typography>
                <Typography variant="body2">
                  Crypto has arrived in your account. View your spot account
                  balance for more details.
                </Typography>
              </Box>
              <Divider style={{ height: "1px", marginBottom: "20px", marginTop: "20px"  }} />
              <Box className={classes.detailsBox}>
                <Box>
                  <Typography variant="body2">Email/Phone no.</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" className="blackText">8272732327</Typography>
                </Box>
              </Box>
              <Box className={classes.detailsBox}>
                <Box>
                  <Typography variant="body2">Transaction Fees</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" className="blackText">0.01</Typography>
                </Box>
              </Box>
              <Box className={classes.detailsBox}>
                <Box>
                  <Typography variant="body2">Date & Time</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" className="blackText">Oct 11 2022 10:20:30</Typography>
                </Box>
              </Box>
              <Box className={classes.detailsBox}>
                <Box>
                  <Typography variant="body2">Transaction Hash</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" className="blackText">kjsdhhsdhsxcxcgxs</Typography>
                </Box>
              </Box>
            </Box>

      </DialogContent>
      
    </Dialog>
  )
}
