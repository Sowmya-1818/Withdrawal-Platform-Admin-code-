import React from "react";
import {
  Typography,
  Dialog,
  DialogContent,
  Button,
  Box,
  TextField,
  IconButton,
  FormHelperText,
} from "@material-ui/core";
import ButtonCircularProgress from "./ButtonCircularProgress";
import { Autocomplete } from "@material-ui/lab";
import { IoClose } from "react-icons/io5";

export default function ConfirmationModal({
  title,
  desc,
  isLoading,
  open,
  handleClose,
  handleSubmit,
  type,
  filter,
  setFilter,
  auth,
  error,
  handleBlur,
  isSubmit,
}) {
  const status = [
    {
      label: "REJECT",
      value: "REJECT",
    },
    {
      label: "APPROVE",
      value: "APPROVE",
    },
  ];
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isLoading) {
          handleClose();
        }
      }}
      fullWidth
      maxWidth="xs"
    >
      <DialogContent>
        <Box align="center" mt={3}>
          <Typography variant="h4" style={{ color: "#FFFFFF" }}>
            {title}
          </Typography>
        </Box>
        <Box align="center" mt={1} mb={2}>
          <Typography variant="body2">{desc}</Typography>
        </Box>
        {type === "reason" && (
          <>
            <Box mb={2}>
              {/* <Autocomplete
                fullWidth
                disableClearable={true}
                
                value={filter.status}
                onChange={(event, value) => {
                  console.log(value, "value");
                  
                  setFilter({
                    ...filter,
                    status: value,
                  });

                 
                }}
                options={(status && status.map((option) => option.label)) || []}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Status"
                    variant="outlined"
                    fullWidth
                  />
                )}
              /> */}

              <Autocomplete
                fullWidth
                disableClearable={true}
                value={filter.status}
                onChange={(event, value) => {
                  console.log(value, "selected label");

                  // Find the corresponding status object based on the selected label
                  const selectedStatus = status.find((option) => option.label === value);
                  console.log(selectedStatus, "selectedStatus");
                  

                  setFilter({
                    ...filter,
                    status: selectedStatus ? selectedStatus.value : "", // Use the value ("APPROVED" or "REJECTED")
                  });
                }}
                options={(status && status.map((option) => option.label)) || []}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Status"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

            </Box>

          </>
        )}
        <Box my={3} align="center">
          <Button
            disabled={isLoading}
            variant="contained"
            color="secondary"
            onClick={() => {
              if (!isLoading) {
                handleClose();
              }
            }}
            style={{ marginRight: "8px" }}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            variant="contained"
            color="primary"
            onClick={() => {
              handleSubmit();
            }}
            style={{ marginleft: "8px" }}
          >
            {isLoading ? (
              <ButtonCircularProgress />
            ) : (
              "confirm"
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
