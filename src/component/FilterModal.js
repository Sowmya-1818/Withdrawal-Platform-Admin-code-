import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  makeStyles,
  Button,
  Divider,
  Grid,
  TextField,
  FormControl,
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";

const useStyle = makeStyles((theme) => ({
  FilterModalBox: {
    "& p": {
      marginBottom: "10px",
    },
  },

  buttonBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

export default function FilterModal({ filterModal, setFilterModal }) {
  const classes = useStyle();
  const [tabs, setTabs] = useState("All");
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  return (
    <Box className={classes.FilterModalBox}>
      <Dialog
        open={filterModal}
        onClose={() => setFilterModal(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent>
          <IconButton
            style={{ position: "absolute", top: "5px", right: "5px" }}
            onClick={() => setFilterModal(false)}
          >
            <IoMdClose />
          </IconButton>
          <Box align="center">
            <Box my={2}>
              <Typography variant="h6">Filter</Typography>
            </Box>
            <Divider style={{ height: "2px", marginBottom: "20px" }} />

            <Box align="start">
              <Typography variant="body2">Status</Typography>
            </Box>
            <Box className="mainTab" mb={2}>
              <Box
                className={tabs === "All" ? "tabActiveButtons" : "tabButtons"}
                onClick={() => setTabs("All")}
              >
                <Typography variant="body2">All</Typography>
              </Box>
              <Box
                className={
                  tabs === "Pending" ? "tabActiveButtons" : "tabButtons"
                }
                onClick={() => setTabs("Pending")}
              >
                <Typography variant="body2">Pending</Typography>
              </Box>
              <Box
                className={
                  tabs === "Completed" ? "tabActiveButtons" : "tabButtons"
                }
                onClick={() => setTabs("Completed")}
              >
                <Typography variant="body2">Completed</Typography>
              </Box>
            </Box>

            <Box className="cardDetailsFiels">
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box align="start" mb={2}>
                      <Typography variant="body2">From Date</Typography>
                      <FormControl fullWidth>
                        <KeyboardDatePicker
                          className="datePickerField"
                          inputVariant="outlined"
                          id="date-picker-dialog"
                          format="DD/MM/YYYY"
                          name="dob"
                          value={selectedDate}
                          onChange={handleDateChange}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box align="start" mb={2}>
                      <Typography variant="body2">To Date</Typography>
                      <FormControl fullWidth>
                        <KeyboardDatePicker
                          className="datePickerField"
                          inputVariant="outlined"
                          id="date-picker-dialog"
                          format="DD/MM/YYYY"
                          name="dob"
                          value={selectedDate}
                          onChange={handleDateChange}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                        />
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12} sm={12}>
                    <Box align="start" mb={2}>
                      <Typography variant="body2">Select Coin</Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Select Coin"
                        name="coin"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box className={classes.buttonBox} my={2}>
                <Button variant="text">Reset</Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ paddingLeft: "55px", paddingRight: "55px" }}
                >
                  Confirm
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
