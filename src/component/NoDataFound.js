import { Box, Typography } from "@material-ui/core";
import React, { useContext } from "react";

export default function NoDataFound({ data }) {
  return (
    <Box
      display="flex"
      textAlign="center"
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      <Box align="center">
        <img
          src={"/images/nodataImg.png"}
          style={{ maxWidth: "150px", marginTop: "30px" }}
          alt=""
        />
        <Typography variant="body1" style={{ color: "#898989" }}>
          {data}
        </Typography>
      </Box>
    </Box>
  );
}
