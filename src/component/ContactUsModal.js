import React, { useRef } from "react";
import {
  Typography,
  Dialog,
  DialogContent,
  Button,
  Box,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import ButtonCircularProgress from "./ButtonCircularProgress";
import JoditEditor from "jodit-react";

export default function ContactUsModal({
  title,
  desc,
  isLoading,
  open,
  handleClose,
  handleSubmit,
  type,
  filter,
  setFilter,
  status,
  error,
  handleBlur,
  typeContact,
}) {
  const editor = useRef(null);

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
        {status !== "BLOCK" ? (
          <>
            {type == "reason" && (
              <>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  multiline
                  className="textField"
                  rows={5}
                  placeholder="Type message..."
                  value={filter?.reason}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      reason: e.target.value,
                    });
                  }}
                />
                <Box className="displaySpacebetween">
                  <FormHelperText error>{error}</FormHelperText>
                  <Typography variant="body1" textAlign="end">
                    {filter?.reason?.length}/600
                  </Typography>
                </Box>
              </>
            )}
            {typeContact == "contactUs" && (
              <>
                <JoditEditor
                  ref={editor}
                  value={filter?.reason}
                  config={{
                    readonly: false,
                  }}
                  tabIndex={1}
                  onBlur={(e) => {
                    setFilter({
                      ...filter,
                      reason: e,
                    });
                  }}
                  variant="outlined"
                  fullWidth
                  disabled={isLoading}
                  size="small"
                />
              </>
            )}
          </>
        ) : (
          <></>
        )}

        <Box my={3} align="center">
          <Button
            disabled={isLoading}
            variant="contained"
            color="primary"
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
            disabled={isLoading || (typeContact == "contactUs" && error !== "")}
            variant="contained"
            color="primary"
            onClick={() => {
              handleSubmit();
            }}
            style={{ marginleft: "8px" }}
          >
            {isLoading ? <ButtonCircularProgress /> : "Confirm"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
