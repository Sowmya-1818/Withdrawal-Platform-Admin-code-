import React from "react";
import { Box, CardHeader, makeStyles } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  listLoderBox: {
    "& .MuiCardHeader-root": {
      padding: "0 0 16px 0",
    },
    "& .earnCard": {
      padding: "5px 24px",
      borderRadius: "0px",
      boxShadow: "none",
    },
  },
}));

export default function ListLoder() {
  const classes = useStyles();

  return (
    <Box className={classes.listLoderBox}>
      <CardHeader
        title={
          <Skeleton
            animation="wave"
            height={30}
            width="95%"
            style={{ marginBottom: 6 }}
          />
        }
        subheader={<Skeleton animation="wave" height={20} width="60%" />}
      />
    </Box>
  );
}
