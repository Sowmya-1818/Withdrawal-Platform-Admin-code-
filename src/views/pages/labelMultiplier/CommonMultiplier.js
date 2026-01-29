import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";

export default function CommonMultiplier({
  ticketNumber,
  setTicketNumber,
  isLoading,
}) {
  const addFormFields = () => {
    setTicketNumber([...ticketNumber, { title: "", description: "" }]);
  };

  const removeFormFields = (i) => {
    let newFormValues = [...ticketNumber];
    newFormValues.splice(i, 1);
    setTicketNumber(newFormValues);
  };

  const [dataField, setDataField] = useState(false);
  useEffect(() => {
    if (ticketNumber.length === 0) {
      setDataField(false);
    }
  }, [ticketNumber]);
  return (
    <Box>
      {dataField && (
        <>
          {ticketNumber &&
            ticketNumber.map((element, index) => {
              return (
                <FormField
                  element={element}
                  index={index}
                  ticketNumber={ticketNumber}
                  addFormFields={addFormFields}
                  removeFormFields={removeFormFields}
                  setTicketNumber={setTicketNumber}
                  isLoading={isLoading}
                  dataField={dataField}
                  setDataField={setDataField}
                />
              );
            })}
        </>
      )}
      {!dataField && (
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDataField(true)}
          >
            Add Data
          </Button>
        </Box>
      )}
    </Box>
  );
}

const FormField = ({
  element,
  index,
  addFormFields,
  removeFormFields,
  setTicketNumber,
  ticketNumber,
  isLoading,
  dataField,
  setDataField,
}) => {
  const handleChange = (i, e) => {
    let newFormValues = [...ticketNumber];
    newFormValues[i][e.target.name] = e.target.value;
    setTicketNumber(newFormValues);
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6}>
          <Box mt={2}>
            <Box mb={1}>
              <Typography variant="body2" mb={1} style={{color:"#FFFFFF"}}>
                Level
              </Typography>
            </Box>
            <FormControl fullWidth>
              <TextField
                value={element?.title || ""}
                fullWidth
                variant="outlined"
                onChange={(e) => handleChange(index, e)}
                type="number"
                placeholder="Please enter the level number."
                name="title"
              />
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Box mt={2}>
            <Box mb={1}>
              <Typography variant="body2" style={{color:"#FFFFFF"}}>Equivalent Multiplier</Typography>
            </Box>

            <TextField
              fullWidth
              value={element?.description || ""}
              onChange={(e) => handleChange(index, e)}
              variant="outlined"
              type="number"
              placeholder="Please enter the equivalent multiplier."
              name="description"
            />
          </Box>
        </Grid>
      </Grid>

      {index === ticketNumber.length - 1 && (
        <Box
          style={{
            width: "100%",
          }}
          mt={1}
        >
          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => addFormFields()}
            >
              Add Data
            </Button>
            {dataField && ticketNumber.length === 1 && (
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setDataField(false)}
                >
                  Remove Data
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}
      {ticketNumber && ticketNumber.length > 1 && (
        <Box
          style={{
            width: "100%",
          }}
          mt={1}
        >
          <Box mt={3}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => removeFormFields(index)}
            >
              Remove Data
            </Button>
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
};
