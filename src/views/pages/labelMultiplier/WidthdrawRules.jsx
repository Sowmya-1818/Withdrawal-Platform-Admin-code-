import {
  Box,
  FormHelperText,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

export default function WidthdrawRules({
  withdrawRules,
  handleChange,
  location,
  isLevelUpdating,
  isSubmit,
}) {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <Box
        className="rulesClx displaySpacebetween"
        mb={openModal && 2}
        onClick={() => setOpenModal(!openModal)}
      >
        <Typography variant="body2" style={{ marginLeft: "11px" }}>
          Widthdraw Rules
        </Typography>
        <IconButton>
          <MdOutlineKeyboardArrowDown
            style={{ transform: openModal ? "rotate(180deg)" : "" }}
          />
        </IconButton>
      </Box>
      <FormHelperText error>
        {!openModal && isSubmit && (
          <Box mb={2}> Please enter Widthdraw Rules</Box>
        )}
      </FormHelperText>

      {openModal && (
        <Box mb={3} mt>
          {withdrawRules &&
            withdrawRules.map((rule, index) => (
              <div key={index}>
                <Box mt={1}>
                  <Typography variant="body2">Rule {index + 1}</Typography>
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
                      location?.state?.type === "VIEW" || isLevelUpdating
                    }
                    onChange={(e) => handleChange(index, e)}
                  />
                  <FormHelperText error>
                    {isSubmit &&
                      rule.ruleTitle === "" &&
                      "Please enter the title"}
                  </FormHelperText>
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
                      location?.state?.type === "VIEW" || isLevelUpdating
                    }
                    onChange={(e) => handleChange(index, e)}
                  />
                  <FormHelperText error>
                    {isSubmit &&
                      rule.ruleDescription === "" &&
                      "Please enter the description"}
                  </FormHelperText>
                </Box>
              </div>
            ))}
        </Box>
      )}
    </>
  );
}
