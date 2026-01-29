import { postAPIHandler, putAPIHandler } from "src/ApiConfig/service";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  Typography,
  makeStyles,
  IconButton,
} from "@material-ui/core";
import * as XLSX from "xlsx";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as yep from "yup";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
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
  },
}));

function AddBlackListUser() {
  const classes = useStyles();
  const history = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [inputTextFields, setInputTextFields] = useState("");
  const [inputEmailFields, setInputEmailFields] = useState("");

  let isValid = inputEmailFields
    .split(",")
    .every((item) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.trim()));

  const addTicketApi = async (values) => {
    setIsSubmit(true);
    if (inputEmailFields == "" || isValid) {
      setIsSubmit(false);
      try {
        setIsUpdating(true);
        const response = await putAPIHandler({
          endPoint: "editBlockedUserName",
          dataToSend: {
            userName: inputTextFields
              ? inputTextFields
                  .split(",")
                  .map((item) => item.trim().toLowerCase())
                  ?.filter((item) => item != "")
              : undefined,
            email: inputEmailFields
              ? inputEmailFields
                  .split(",")
                  .map((item) => item.trim().toLowerCase())
                  .filter((item) => item.trim() !== "")
                  .filter((item) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item))
              : undefined,
          },
        });
        if (response.data.responseCode === 200) {
          setInputTextFields("");
          toast.success(response.data.responseMessage);
          history("/blacklist-management");
        } else {
          toast.error(response.data.responseMessage);
        }
        setIsUpdating(false);
      } catch (error) {
        setIsUpdating(false);
        console.log(error);
        toast.error(error.response.data.responseMessage);
      }
    }
  };
  const [userNameData, setUserNameData] = useState();
  const fileInputRef = React.createRef();
  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const readXlsxFile = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const workbook = XLSX.read(bufferArray, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileUpload = async (file) => {
    try {
      const data = await readXlsxFile(file);
      const transformedData = data.map((row) => Object.values(row)[0]);
      setInputTextFields(transformedData.join(","));
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  const downloadSampleFile = () => {
    const usernames = inputTextFields.split(",");
    const emails = inputEmailFields.split(",");

    let combinedData = [];
    for (let i = 0; i < Math.max(usernames.length, emails.length); i++) {
      combinedData.push({
        Username: usernames[i] || "",
        Email: emails[i] || "",
      });
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(combinedData);

    XLSX.utils.book_append_sheet(wb, ws, "SampleData");

    const fileName = "Sample_File.xlsx";

    XLSX.writeFile(wb, fileName);
  };
  return (
    <Box className={classes.main}>
      <Box mb={5}>
        <GoBack title="Add Blacklist Username" />
      </Box>
      <Container maxWidth="sm">
        <Paper elevation={3}>
          <Box p={3}>
            <Box className="displaySpacebetween">
              <Button
                variant="contained"
                color="primary"
                onClick={downloadSampleFile}
              >
                Download sample File
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFileButtonClick}
              >
                Upload Username
              </Button>

              <input
                ref={fileInputRef}
                accept=".xlsx"
                style={{ display: "none" }}
                id="raised-button-file-xmlx"
                type="file"
                onChange={(e) => {
                  handleFileUpload(e.target.files[0]);
                }}
                multiple
              />
            </Box>
          </Box>
          <Box p={3}>
            <Typography variant="body2">Username</Typography>
            <FormControl fullWidth>
              <TextField
                fullWidth
                placeholder="Enter file names"
                type="text"
                variant="outlined"
                name="userName"
                multiline
                rows={2}
                disabled={isUpdating}
                value={inputTextFields}
                onChange={(e) => setInputTextFields(e.target.value)}
              />
            </FormControl>
            <Box mt={1}>
              <Typography variant="body2">
                Sample file without comma(Eg Prem,Rajan,Ram).
              </Typography>
            </Box>
            <FormHelperText error>
              {/* {touched.userName && errors.userName} */}
            </FormHelperText>
          </Box>
          <Box px={3}>
            <Typography variant="body2">Registered Email</Typography>
            <FormControl fullWidth>
              <Box mt={1} width="100%">
                <TextField
                  fullWidth
                  placeholder="Enter email addresses"
                  type="text"
                  variant="outlined"
                  name="email"
                  multiline
                  rows={2}
                  disabled={isUpdating}
                  value={inputEmailFields}
                  onChange={(e) => setInputEmailFields(e.target.value)}
                />
                <FormHelperText error>
                  {isSubmit &&
                    inputEmailFields !== "" &&
                    !isValid &&
                    "Please enter valid email."}
                </FormHelperText>
              </Box>
            </FormControl>
            <FormHelperText error>
              {/* Validation errors if any */}
            </FormHelperText>
          </Box>
          <Box className="displayCenter" py={4}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isUpdating}
              onClick={addTicketApi}
            >
              Add
              {isUpdating && <ButtonCircularProgress />}
            </Button>

            <Box style={{ marginLeft: "16px" }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => history(-1)}
                disabled={isUpdating}
              >
                Back
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default AddBlackListUser;
