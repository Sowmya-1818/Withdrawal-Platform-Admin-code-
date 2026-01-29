import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  makeStyles,
  Typography,
  Paper,
  FormHelperText,
  TextField,
  IconButton,
  Grid,
} from "@material-ui/core";
import { useNavigate, useLocation } from "react-router-dom";
import { handleNegativeValue } from "src/utils";
import JoditEditor from "jodit-react";
import PageLoading from "src/component/PageLoading";
import { putAPIHandler } from "src/ApiConfig/service";
import { toast } from "react-hot-toast";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import GoBack from "src/component/GoBack";
import { IoAddSharp } from "react-icons/io5";
import { RiSubtractFill } from "react-icons/ri";

const useStyles = makeStyles((theme) => ({
  muiMainContainer: {
    "& .mainContainer": {
      display: "flex",
      flexDirection: "column",
      gap: "30px",
    },
    "& .head": {
      padding: "50px 20px 20px 20px",
      borderBottom: "1px solid #000",
      marginBottom: "50px",
    },
    "& h3": {
      fontWeight: "700",
      fontSize: "32px",
      lineHeight: "normal",
      fontFamily: "'Arial Bold', 'Arial', sans-serif",
    },
    "& .MuiOutlinedInput-root": {
      width: "100%",
    },
    "& .MuiInputBase-root": { background: "#fff" },
    "& .MuiInputBase-input": { color: "#000" },

    "& .align": {
      height: "100%",
    },
    "& .btnBox": { gap: "20px", marginTop: "50px" },
    "& h6": {
      fontWeight: "700",
      fontSize: "18px",
      lineHeight: "normal",
      fontFamily: "'Arial Bold', 'Arial', sans-serif",
    },
    "& .displayEnd": {
      [theme.breakpoints.down("sm")]: { justifyContent: "start" },
    },
  },
}));
const PrivacyPolicy = () => {
  const classes = useStyles();
  const history = useNavigate();
  const location = useLocation();
  console.log("location?.state?.data==>", location?.state?.data);
  const editor = useRef(null);
  const [description, setDescription] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const config = {
    readonly: false,
  };
  const [levelValues, setLevelValues] = useState([
    {
      email: "",
    },
  ]);
  console.log("levelValues==>>>", levelValues);
  const editStaticContentApi = async (values) => {
    setIsValid(true);
    if (description !== "" && description !== "<p><br></p>") {
      setIsValid(false);

      try {
        setIsUpdating(true);

        const response = await putAPIHandler({
          endPoint: "editStaticContent",
          dataToSend: {
            _id: location?.state?.data?._id,
            description: description,
            email: levelValues ? levelValues : undefined,
          },
        });
        if (response.data.responseCode == 200) {
          toast.success(response.data.responseMessage);
          history("/static-content");
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

  const handleLevelChange = (index, field, newValue) => {
    setLevelValues((prevValues) =>
      prevValues.map((value, i) =>
        i === index ? { ...value, [field]: newValue } : value
      )
    );
  };

  useEffect(() => {
    if (location?.state) {
      console.log(" ---- location?.state?.data ", location?.state?.data.email)
      setDescription(
        location?.state?.data?.description
          ? location?.state?.data?.description
          : ""
      );
      if(location?.state?.data.email.length>0){
      setLevelValues(
        location?.state?.data?.email ? location?.state?.data?.email : []
      );}else{
        setLevelValues([
          {
            email: "",
          },]
        );}
    }
  }, [location]);

  return (
    <Box className={classes.muiMainContainer}>
      <Box mb={5}>
        <GoBack
          title={`Edit ${location?.state && location?.state?.data?.title}`}
        />
      </Box>
      <Paper elevation={2}>
        <Box className="mainContainer">
          <Box>
            <Typography variant="h6">Discription</Typography>
          </Box>
          <Box>
            <JoditEditor
              ref={editor}
              value={description}
              config={config}
              tabIndex={1}
              onBlur={(e) => setDescription(e)}
              inputProps={{ maxLength: 500 }}
              variant="outlined"
              fullWidth
              disabled={isUpdating}
              size="small"
            />
            {isValid && description == "<p><br></p>" && (
              <FormHelperText error>
                Please enter valid description
              </FormHelperText>
            )}
            {isValid && description == "" && (
              <FormHelperText error>Description is requied.</FormHelperText>
            )}
          </Box>
          {location?.state?.data?.title === "CONTACT_US" && (
            <>
              <Box mb={1}>
                <Typography variant="body2">Emails</Typography>
              </Box>
              <Grid container spacing={2}>
                {levelValues?.map((value, index) => (
                  <Grid item xs={12} sm={3} md={3} key={index} mt={1}>
                    <Box>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="email"
                        value={value.email}
                        onChange={(e) =>
                          handleLevelChange(index, "email", e.target.value)
                        }
                      />
                    </Box>

                    {location?.state?.type !== "VIEW" && (
                      <Box>
                        {index === levelValues.length - 1 && (
                          <IconButton
                            onClick={() => {
                              if (location?.state?.type !== "VIEW") {
                                const newLevel = {};
                                if (levelValues.length <= 14) {
                                  setLevelValues((prevValues) => [
                                    ...prevValues,
                                    newLevel,
                                  ]);
                                }
                              }
                            }}
                          >
                            <IoAddSharp style={{ color: "#fff" }} />
                          </IconButton>
                        )}
                        {index > 0 && (
                          <IconButton
                            onClick={() =>
                              location?.state?.type !== "VIEW" &&
                              setLevelValues((prevValues) =>
                                prevValues
                                  .filter((_, i) => i !== index)
                                  .map((value, i) => {
                                    if (i >= index) {
                                      const newLevel =
                                        parseInt(value.level) - 1;
                                      return {
                                        ...value,
                                        level: newLevel.toString(),
                                      };
                                    }
                                    return value;
                                  })
                              )
                            }
                          >
                            <RiSubtractFill style={{ color: "#fff" }} />
                          </IconButton>
                        )}
                      </Box>
                    )}
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          <Box className="displayCenter btnBox">
            <Button
              variant="contained"
              color="primary"
              disabled={isUpdating}
              onClick={() => {
                editStaticContentApi();
              }}
            >
              Update
              {isUpdating && <ButtonCircularProgress />}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={isUpdating}
              onClick={() => {
                history(-1);
              }}
            >
              Back
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
export default PrivacyPolicy;
