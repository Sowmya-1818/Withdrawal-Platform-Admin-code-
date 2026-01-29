import {
  Box,
  Grid,
  Typography,
  makeStyles,
  TextField,
  Button,
  FormControl,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { CSVLink } from "react-csv";
import { getAPIHandler } from "src/ApiConfig/service";
import axios from "axios";
import { downloadExcel, listUserHandlerExcel } from "src/utils";

const useStyle = makeStyles((theme) => ({
  filtterBox: {
    "& .filterTitle": {
      color: "#FFFFFF",
      fontSize: "14px",
      marginBottom: "5px",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "1px solid rgba(0, 0, 0, 0.08)",
    },
    "& .textfields:hover .MuiOutlinedInput-notchedOutline,  & .selectTag:hover .MuiOutlinedInput-notchedOutline ,  & .keyboardPicker:hover .MuiOutlinedInput-notchedOutline ":
      {
        border: "1px solid rgba(0, 0, 0, 0.08)",
      },
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: "2px",
    },
    "& .MuiOutlinedInput-input": {
      fontSize: "12px",
      color: theme.palette.text.primary,
    },
    "& .MuiOutlinedInput-root": {
      height: "40px",
      "& svg": {
        color: "#8C8C8C",
        fontSize: "20px",
      },
    },
    "& .ActionButtons": {
      alignItems: "end",
      height: "100%",
      gap: "10px",
    },

    "& .clearBtn, & .applyBtn": {
      padding: "10px 35px 9px 38px",
      borderRadius: "5px",

      fontWeight: 400,
      fontSize: "14px",
    },
    "& .clearBtn": {
      background: "#E1E1E1",
    },
    "& .adviserClearBtn, & .projectlistClearBtn, & .CjobListClearBtn": {
      height: "40px",
    },

    "& .csvBtn": {
      padding: "10px !important",
    },
    "& .adviserDonloadBtn, & .projectlistDownlodBtn, & .CjobListDownloadBtn": {
      height: "40px",
    },
    "& .actions": {
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
        alignItems: "start",
      },
    },
    "& .keyboard": {
      width: "15px",
      height: "15px",
    },
    "& .sideButton": {
      marginTop: "25px",
      [theme.breakpoints.down("sm")]: {
        marginTop: "0px",
      },
    },
  },
}));

export default function Filtter({
  filter,
  setFilter,
  clearFilters,
  onClickFun,
  type,
  placeholder,
  filterData,
  excelTableName,
  apiEndPoint,
}) {
  const classes = useStyle();
  const [gameData, setGameData] = useState([]);
  const [isCategoryUpdating, setIsCategoryUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const status = [
    {
      label: "ALL",
      value: "ALL",
    },
    {
      label: type == "else" ? "PENDING" : "ACTIVE",
      value: type == "else" ? "PENDING" : "ACTIVE",
    },
    {
      label: type == "else" ? "RESPONDED" : "BLOCK",
      value: type == "else" ? "RESPONDED" : "BLOCK",
    },
  ];
  const walletStatus = [
    {
      label: "APPROVED",
      value: "APPROVED",
    },
    {
      label: "REJECTED",
      value: "REJECTED",
    },
    {
      label: "PENDING",
      value: "PENDING",
    },
    {
      label: "TRANSFERRED",
      value: "TRANSFERRED",
    },
  ];
  const transactionType = [
    {
      label: "BUY",
      value: "BUY",
    },
    {
      label: "WITHDRAW",
      value: "WITHDRAW",
    },
  ];


  const historyType = [
    
    {
      label: "retro",
      value: "retro",
    },
    {
      label: "modren",
      value: "modren",
    },
   
    // {
    //   label: "dailyReward",
    //   value: "dailyReward",
    // },
    // {
    //   label: "referral",
    //   value: "referral",
    // },
    // {
    //   label: "withdrawals",
    //   value: "withdrawals",
    // },
  ];
  
 
  const gameManagementApi = async (source) => {
    try {
      setGameData([]);

      setIsCategoryUpdating(true);
      const response = await getAPIHandler({
        endPoint: "listgame",
        source: source,
      });

      if (response.data.responseCode === 200) {
        setGameData([
          ...response?.data?.result?.docs,
          { gameTitle: "GLOBAL" },
          { gameTitle: "ALL" },
        ]);
        setIsCategoryUpdating(false);
      }
      setIsCategoryUpdating(false);
    } catch (error) {
      setIsCategoryUpdating(false);
    }
  };
  useEffect(() => {
    const source = axios.CancelToken.source();
    if (type === "faq") {
      gameManagementApi(source);
    }
    return () => {
      source.cancel();
    };
  }, [type]);
  return (
    <Box className={classes.filtterBox}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2}>
          <Box>
            <Typography className="filterTitle">Search</Typography>
            <TextField
              variant="outlined"
              fullWidth
              placeholder={placeholder}
              onChange={(e) => {
                setFilter({ ...filter, ["search"]: e.target.value });
              }}
              value={filter.search}
              className="textfields"
            />
          </Box>
        </Grid>
       
        {type != "faq" && (
          <>
            <Grid item xs={12} sm={6} md={2}>
              <Box>
                <Typography className="filterTitle">From</Typography>
                <FormControl fullWidth>
                  <KeyboardDatePicker
                    inputVariant="outlined"
                    id="date-picker-dialog"
                    format="MM/DD/YYYY"
                    placeholder="DD/MM/YYYY"
                    className="keyboardPicker"
                    disableFuture
                    InputProps={{ readOnly: true }}
                    keyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    fullWidth
                    value={filter.fromDate}
                    onChange={(date) => {
                      setFilter({
                        ...filter,
                        ["fromDate"]: new Date(date),
                      });
                    }}
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box>
                <Typography className="filterTitle">To</Typography>
                <FormControl fullWidth>
                  <KeyboardDatePicker
                    inputVariant="outlined"
                    id="date-picker-dialog"
                    format="MM/DD/YYYY"
                    placeholder="DD/MM/YYYY"
                    className="keyboardPicker"
                    InputProps={{ readOnly: true }}
                    keyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    fullWidth
                    value={filter.toDate}
                    
                    disableFuture
                    onChange={(date) => {
                      setFilter({
                        ...filter,
                        ["toDate"]: new Date(date),
                        
                      });
                    }}
                    disabled={!filter?.fromDate}
                    minDate={filter?.fromDate}
                  />
                </FormControl>
              </Box>
            </Grid>
          </>
        )}

        {(type === "user" || type === "else" || type === "else1") && (
          <Grid item xs={12} sm={6} md={2}>
            <Box>
              <Typography className="filterTitle">Status</Typography>
              <Autocomplete
                fullWidth
                disableClearable={true}
                value={filter.status}
                onChange={(event, value) => {
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
              />
            </Box>
          </Grid>
        )}
        {type === "faq" && (
          <Grid item xs={12} sm={6} md={2}>
            <Box>
              <Typography className="filterTitle">Screen Name</Typography>
              <Autocomplete
                fullWidth
                disableClearable={true}
                value={filter.screenName}
                onChange={(event, value) => {
                  setFilter({
                    ...filter,
                    screenName: value,
                  });
                }}
                options={
                  (gameData && gameData.map((data) => data.gameTitle)) || []
                }
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
          </Grid>
        )}
        {type === "else" && <Grid item xs={12} sm={6} md={2}></Grid>}
        {type === "faq" && <Grid item xs={12} sm={6} md={4}></Grid>}
        {/* {type === "wallet" && (
          <>
            <Grid item xs={12} sm={6} md={2}>
              <Box>
                <Typography className="filterTitle">Status</Typography>
                <Autocomplete
                  fullWidth
                  disableClearable={true}
                  value={filter.status}
                  onChange={(event, value) => {
                    setFilter({
                      ...filter,
                      status: value,
                    });
                  }}
                  options={
                    (walletStatus &&
                      walletStatus?.map((option) => option.label)) ||
                    []
                  }
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
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box>
                <Typography className="filterTitle">
                  Transaction Type
                </Typography>
                <Autocomplete
                  fullWidth
                  disableClearable={true}
                  value={filter.transactionType}
                  onChange={(event, value) => {
                    setFilter({
                      ...filter,
                      transactionType: value,
                    });
                  }}
                  options={
                    (transactionType &&
                      transactionType?.map((option) => option.label)) ||
                    []
                  }
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
            </Grid>


            <Grid item xs={12} sm={6} md={2}>
              <Box>
                <Typography className="filterTitle">
                  User Histories
                </Typography>
                <Autocomplete
                  fullWidth
                  disableClearable={true}
                  value={filter.historyType}
                  onChange={(event, value) => {
                    setFilter({
                      ...filter,
                      historyType: value,
                    });
                  }}
                  options={
                    (historyType &&
                      historyType?.map((option) => option.label)) ||
                    []
                  }
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
            </Grid>
          </>
        )} */}

{type === "wallet" && (
  <Grid item xs={12} sm={6} md={2}>
    <Box>
      <Typography className="filterTitle">Status</Typography>
      <Autocomplete
  fullWidth
  disableClearable={true}
  value={filter.status}
  onChange={(event, value) => {
    setFilter({ ...filter, status: value });
  }}
  options={walletStatus?.map((option) => option.label) || []}
  renderInput={(params) => (
    <TextField {...params} placeholder="Status" variant="outlined" fullWidth />
  )}
/>

    </Box>
  </Grid>
)}

 {type === "ledger" && (
  <>
    <Grid item xs={12} sm={6} md={2}>
      <Box>
        <Typography className="filterTitle">History Type</Typography>
        <Autocomplete
          fullWidth
          disableClearable={true}
          value={filter.historyType}
          onChange={(event, value) => {
            setFilter({
              ...filter,
              historyType: value,
            });
          }}
          options={
            (historyType && historyType?.map((option) => option.label)) || []
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="History Type"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </Box>
    </Grid>

    {/* Conditionally render the ReferredBy field only when historyType is "referral" */}
    {/* {filter.historyType === "referral" && (
      <Grid item xs={12} sm={6} md={2}>
        <Box>
          <Typography className="filterTitle">User Name</Typography>
          <TextField
            variant="outlined"
            fullWidth
            placeholder={placeholder}
            onChange={(e) => {
              setFilter({ ...filter, ["ReferredBy"]: e.target.value });
            }}
            value={filter.ReferredBy}
            className="textfields"
          />
        </Box>
      </Grid>
    )} */}
  </>
)}


  


        <Grid item xs={12} sm={6} md={2} className="sideButton">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={onClickFun}
          >
            Search
          </Button>
        </Grid>
        {type !== "wallet" && (
          <Grid item xs={12} sm={6} md={2} className="sideButton">
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={clearFilters}
            >
              Reset
            </Button>
          </Grid>
        )}
      </Grid>
      <Box className="displayEnd" mt={3}>
        {type === "wallet" && (
          <Button
            variant="contained"
            color="secondary"
            onClick={clearFilters}
            style={{ marginRight: "16px" }}
          >
            Reset
          </Button>
        )}
        {/* {type !== "faq" && type !== "ledger" && (
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              if (!isLoading) {
                setIsLoading(true);
                
                const response = await listUserHandlerExcel({
                  paramsData: filterData,
                  endPoint: apiEndPoint,
                });

                console.log(response, "responsedownloadExcel");
                if (response) {
                  downloadExcel(response, excelTableName);
                }
                setIsLoading(false);
              }
            }}
          >
            {isLoading ? "Loading..." : "EXPORT AS EXCEL"}
          </Button>
        )} */}
      </Box>
    </Box>
  );
}
