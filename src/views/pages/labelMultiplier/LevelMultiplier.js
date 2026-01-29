import {
  Box,
  Button,
  Container,
  FormHelperText,
  IconButton,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import GoBack from "src/component/GoBack";
import { getAPIHandler, putAPIHandler } from "src/ApiConfig/service";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import { IoAddSharp } from "react-icons/io5";
import { RiSubtractFill } from "react-icons/ri";
import WidthdrawRules from "./WidthdrawRules";
import JoditEditor from "jodit-react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const useStyles = makeStyles((theme) => ({
  muiMainContainer: {
    "& .head": {
      padding: "50px 20px 20px 20px",
      borderBottom: "1px solid #000",
    },
    "& h3": {
      fontWeight: "700",
      fontSize: "32px",
    },
    "& .mainContainer": {
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "50px",
      "& .headContiner": {
        display: "flex",
        flexDirection: "column",
        gap: "30px",

        "& .secendMainBox": {
          height: "100px",
          maxWidth: "1000px",
          width: "100%",
          display: "flex",
          gap: "30px",
          "@media(max-width:450px)": { flexDirection: "column" },
        },
      },
      "& .rulesClx": {
        background: "#19051c",
        borderRadius: "10px",
        cursor: "pointer",
      },
    },
  },
}));

const arrayRules = [
  {
    ruleTitle: "",
    ruleDescription: "",
  },
  {
    ruleTitle: "",
    ruleDescription: "",
  },
  {
    ruleTitle: "",
    ruleDescription: "",
  },
];

const LevelMultiplier = () => {
  const editor = useRef(null);
  const classes = useStyles();
  const history = useNavigate();
  const location = useLocation();
  const [levelData, setLevelData] = useState();
  const [disclaimer, setDisclaimer] = useState("");
  const [isLevelUpdating, setIsLevelUpdating] = useState(false);
  const [levelValues, setLevelValues] = useState([
    {
      level: "1",
      multiplier: "1",
      additionalParams: {},
    },
  ]);

  const handleNegativeValue = (event) => {
    if (
      event.key === "-" ||
      event.key === "+" ||
      event.key === "*" ||
      event.key === "/"
    ) {
      event.preventDefault();
    }
  };
  const [isSubmit, setIsSubmit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [newParamName, setNewParamName] = useState("");
  const [newParamValue, setNewParamValue] = useState("1");

  const [gameMinMax, setGameMinMax] = useState({
    minValue: "",
    maxValue: "",
  });
  const [gameRules, setGameRules] = useState(arrayRules);
  const [withdrawRules, setWithdrawRules] = useState(arrayRules);

  const isRuleEmpty = () => {
    for (let i = 0; i < withdrawRules.length; i++) {
      if (
        withdrawRules[i].ruleTitle === "" ||
        withdrawRules[i].ruleDescription === ""
      ) {
        return true;
      }
    }
    return false;
  };

  const editLevelApi = async () => {
    if (isRuleEmpty()) {
      setIsSubmit(true);
    } else {
      try {
        setIsLevelUpdating(true);
        const response = await putAPIHandler({
          endPoint: "editgame",
          dataToSend: {
            _id: location?.state?.levelId,
            level: levelValues,
            rules: gameRules,
            min: gameMinMax?.minValue,
            max: gameMinMax?.maxValue,
            withdrawalRules: withdrawRules,
            disclaimer: disclaimer,
          },
        });
        if (response.data.responseCode === 200) {
          toast.success(response.data.responseMessage);
          getLevelApi();
          history(-1);
        } else {
          toast.error(response.data.responseMessage);
        }
        setIsLevelUpdating(false);
      } catch (error) {
        setIsLevelUpdating(false);
        console.log(error);
        toast.error(error?.response?.data?.responseMessage);
      }
    }
  };

  const getLevelApi = async () => {
    try {
      const response = await getAPIHandler({
        endPoint: "viewgame",
        paramsData: {
          _id: location?.state?.levelId,
        },
      });
      if (response.data.responseCode === 200) {
        setLevelData(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (location?.state?.levelId) {
      getLevelApi();
    }
  }, [location?.state?.levelId]);

  useEffect(() => {
    if (levelData) {
      setLevelValues(
        levelData?.level || [
          {
            level: "1",
            multiplier: "1",
            additionalParams: {},
          },
        ],
      );
      setGameMinMax({
        minValue: levelData?.min ? levelData?.min : "",
        maxValue: levelData?.max ? levelData?.max : "",
      });
      setDisclaimer(
        levelData && levelData.disclaimer ? levelData.disclaimer : "",
      );
      setWithdrawRules(
        levelData.withdrawalRules.length > 0
          ? levelData.withdrawalRules
          : arrayRules,
      );

      setGameRules(levelData?.rules.length > 0 ? levelData?.rules : arrayRules);
    }
  }, [levelData]);

  const handleLevelChange = (index, field, newValue) => {
    setLevelValues((prevValues) =>
      prevValues.map((value, i) =>
        i === index ? { ...value, [field]: newValue } : value,
      ),
    );
  };

  const handleAdditionalParamChange = (index, param, value) => {
    setLevelValues((prevValues) =>
      prevValues.map((level, i) => {
        if (i === index) {
          return {
            ...level,
            additionalParams: {
              ...level.additionalParams,
              [param]: value,
            },
          };
        }
        return level;
      }),
    );
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newRules = [...gameRules];
    newRules[index][name] = value;
    setGameRules(newRules);
  };

  const handleChangeWithdraw = (index, event) => {
    const { name, value } = event.target;
    const newRules = [...withdrawRules];
    newRules[index][name] = value;
    setWithdrawRules(newRules);
  };

  const addAdditionalParam = () => {
    const camelCasedName = newParamName
      .replace(/\s(.)/g, (match, group1) => group1.toUpperCase())
      .replace(/\s/g, "")
      .replace(/^(.)/, (match, group1) => group1.toLowerCase());
    setLevelValues((prevValues) =>
      prevValues.map((level) => ({
        ...level,
        additionalParams: {
          ...level.additionalParams,
          [camelCasedName]: newParamValue,
        },
      })),
    );
    setNewParamName("");
    setNewParamValue("1");
  };

  const initializeAdditionalParams = (additionalParams) => {
    const initializedParams = {};
    for (const param in additionalParams) {
      initializedParams[param] = "1";
    }
    return initializedParams;
  };

  return (
    <Box className={classes.muiMainContainer}>
      <>
        <Box mb={5}>
          <GoBack title={`${location?.state?.type} Level`} />
        </Box>

        <Box className="mainContainer">
          <Typography variant="h6" style={{ color: "#FFFFFF" }}>
            Admin can modify the Min number of level, which enables user to
            withdraw the reward after completing that level with Equivalent
            Multiplier for that level.
          </Typography>
          <Container maxWidth="lg">
            <Paper elevation={3} className="paperBox">
              <Box className="headContiner">
                <Box mt={3}>
                  <Box
                    className="rulesClx displaySpacebetween"
                    mb={2}
                    onClick={() => setOpenModal(!openModal)}
                  >
                    <Typography variant="body2" style={{ marginLeft: "11px" }}>
                      Game Rules
                    </Typography>
                    <IconButton>
                      <MdOutlineKeyboardArrowDown
                        style={{ transform: openModal ? "rotate(180deg)" : "" }}
                      />
                    </IconButton>
                  </Box>
                  {openModal && (
                    <Box mb={3} mt>
                      {gameRules.map((rule, index) => (
                        <div key={index}>
                          <Box mt={1}>
                            <Typography variant="body2">
                              Rule {index + 1}
                            </Typography>
                          </Box>
                          <Box mt={0.5} mb={1}>
                            <TextField
                              variant="outlined"
                              placeholder={`Title ${index + 1}`}
                              name={`ruleTitle`}
                              inputProps={{ maxLength: 50 }}
                              value={rule.ruleTitle}
                              fullWidth
                              disabled={
                                location?.state?.type === "VIEW" ||
                                isLevelUpdating
                              }
                              onChange={(e) => handleChange(index, e)}
                            />
                          </Box>
                          <Box mt={1}>
                            <Typography variant="body2">
                              Description {index + 1}
                            </Typography>
                          </Box>
                          <Box mt={0.5}>
                            <TextField
                              variant="outlined"
                              placeholder={`Description ${index + 1}`}
                              name={`ruleDescription`}
                              inputProps={{ maxLength: 600 }}
                              multiline
                              maxRows={3}
                              value={rule.ruleDescription}
                              fullWidth
                              disabled={
                                location?.state?.type === "VIEW" ||
                                isLevelUpdating
                              }
                              onChange={(e) => handleChange(index, e)}
                            />
                          </Box>
                        </div>
                      ))}
                    </Box>
                  )}

                  <WidthdrawRules
                    isSubmit={isSubmit}
                    isLevelUpdating={isLevelUpdating}
                    withdrawRules={withdrawRules}
                    handleChange={handleChangeWithdraw}
                    location={location}
                  />

                  <Box mb={2}>
                    <Typography variant="body2">Game Minimum Ticket</Typography>
                    <Box mt={0.8} mb={1}>
                      <TextField
                        variant="outlined"
                        placeholder="Enter value"
                        type="number"
                        fullWidth
                        value={gameMinMax.minValue}
                        onChange={(e) =>
                          setGameMinMax({
                            ...gameMinMax,
                            minValue: e.target.value,
                          })
                        }
                        onKeyDown={(event) => handleNegativeValue(event)}
                        onKeyPress={(event) => {
                          if (
                            event?.key === "-" ||
                            event?.key === "+" ||
                            event?.key === "*" ||
                            event?.key === "/"
                          ) {
                            event.preventDefault();
                          }
                        }}
                        disabled={
                          location?.state?.type === "VIEW" || isLevelUpdating
                        }
                      />
                      <FormHelperText error>
                        {isSubmit &&
                          gameMinMax.minValue == "" &&
                          "Please enter value."}
                        {isSubmit &&
                          gameMinMax.minValue !== "" &&
                          gameMinMax.minValue <= 0 &&
                          "Please enter greater than 0."}
                      </FormHelperText>
                    </Box>

                    <Typography variant="body2">Game Maximum Ticket</Typography>
                    <Box mt={0.8}>
                      <TextField
                        variant="outlined"
                        placeholder="Enter value"
                        type="number"
                        fullWidth
                        value={gameMinMax.maxValue}
                        onChange={(e) =>
                          setGameMinMax({
                            ...gameMinMax,
                            maxValue: e.target.value,
                          })
                        }
                        onKeyDown={(event) => handleNegativeValue(event)}
                        onKeyPress={(event) => {
                          if (
                            event?.key === "-" ||
                            event?.key === "+" ||
                            event?.key === "*" ||
                            event?.key === "/"
                          ) {
                            event.preventDefault();
                          }
                        }}
                        disabled={
                          location?.state?.type === "VIEW" || isLevelUpdating
                        }
                      />
                      <FormHelperText error>
                        {isSubmit &&
                          gameMinMax.maxValue == "" &&
                          "Please enter value."}
                        {isSubmit &&
                          gameMinMax.maxValue !== "" &&
                          gameMinMax.maxValue <= 0 &&
                          "Please enter greater than 0."}
                      </FormHelperText>
                    </Box>
                  </Box>

                  {levelValues?.map((value, index) => (
                    <Box className="displayCenter" key={index} mt={1}>
                      <Box className="displayCenter" style={{ gap: "3px" }}>
                        <Box>
                          <Typography variant="caption">Level</Typography>
                          <TextField
                            fullWidth
                            type="number"
                            variant="outlined"
                            placeholder="Please enter the level."
                            value={value.level}
                            disabled
                          />
                        </Box>
                        <Box>
                          <Typography variant="caption">Multiplier</Typography>
                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Multiplier"
                            value={value.multiplier}
                            onKeyDown={(event) => handleNegativeValue(event)}
                            onKeyPress={(event) => {
                              if (
                                event?.key === "-" ||
                                event?.key === "+" ||
                                event?.key === "*" ||
                                event?.key === "/"
                              ) {
                                event.preventDefault();
                              }
                            }}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const isValidNumber = /^-?\d*\.?\d{0,3}$/.test(
                                newValue,
                              );
                              if (isValidNumber) {
                                handleLevelChange(
                                  index,
                                  "multiplier",
                                  newValue,
                                );
                              }
                            }}
                            disabled={location?.state?.type === "VIEW"}
                          />
                        </Box>
                      </Box>
                      {Object.keys(value.additionalParams || {}).map(
                        (param, i) => (
                          <Box key={i} style={{ marginLeft: "5px" }}>
                            <Typography variant="caption">{param}</Typography>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder={param}
                              value={value.additionalParams[param]}
                              onChange={(e) =>
                                handleAdditionalParamChange(
                                  index,
                                  param,
                                  e.target.value,
                                )
                              }
                              disabled={location?.state?.type === "VIEW"}
                            />
                          </Box>
                        ),
                      )}
                      {location?.state?.type !== "VIEW" && (
                        <>
                          {index === levelValues.length - 1 && (
                            <IconButton
                              onClick={() => {
                                if (location?.state?.type !== "VIEW") {
                                  const additionalParams =
                                    initializeAdditionalParams(
                                      levelValues[0].additionalParams,
                                    );
                                  const newLevel = {
                                    level: (
                                      parseInt(
                                        levelValues[levelValues.length - 1]
                                          .level,
                                      ) + 1
                                    ).toString(),
                                    multiplier: "1",

                                    additionalParams,
                                  };
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
                                    }),
                                )
                              }
                            >
                              <RiSubtractFill style={{ color: "#fff" }} />
                            </IconButton>
                          )}
                        </>
                      )}
                    </Box>
                  ))}

                  <Box mt={2}>
                    <JoditEditor
                      ref={editor}
                      name="disclaimer"
                      value={disclaimer}
                      tabIndex={1}
                      onBlur={(e) => setDisclaimer(e)}
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                    <FormHelperText error>
                      {isSubmit &&
                        disclaimer === "" &&
                        "Please enter the disclaimer"}
                    </FormHelperText>
                  </Box>
                </Box>
                <Box className="displayCenter" gridGap={"20px"}>
                  {location?.state?.type !== "VIEW" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setIsSubmit(true);
                        if (
                          gameMinMax.minValue > 0 &&
                          gameMinMax.minValue !== "" &&
                          gameMinMax.maxValue > 0 &&
                          gameMinMax.maxValue !== "" &&
                          disclaimer !== ""
                        ) {
                          setIsSubmit(false);
                          editLevelApi();
                        }
                      }}
                      disabled={isLevelUpdating}
                    >
                      SAVE CHANGES{" "}
                      {isLevelUpdating && <ButtonCircularProgress />}
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={isLevelUpdating}
                    onClick={() => history(-1)}
                  >
                    GO BACK
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Container>
        </Box>
      </>
    </Box>
  );
};

export default LevelMultiplier;
