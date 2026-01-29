import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import { IoMdClose } from "react-icons/io";

const useStyle = makeStyles((theme) => ({
  transactionBox: {},
}));

export default function TransactionSuccessModal({ openModal, setOpenModal }) {
  const classes = useStyle();
  return (
    <Box className={classes.transactionBox}>
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent>
          <IconButton
            style={{ position: "absolute", top: "5px", right: "5px" }}
            onClick={() => setOpenModal(false)}
          >
            <IoMdClose />
          </IconButton>
          <Box align="center">
            <Box mt={6}>
              <Avatar src="images/success.png" style={{height:"100px", width:"100px"}} />
            </Box>
            <Box my={3}>
              <Typography variant="body2">Transaction successfully!</Typography>
            </Box>
            <Box mt={3} mb={6}>
              <Typography variant="h6">DT 600 added to your wallet</Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
