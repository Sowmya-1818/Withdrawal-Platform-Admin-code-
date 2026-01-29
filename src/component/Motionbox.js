import { Box, makeStyles } from "@material-ui/core";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const useStyle = makeStyles(() => ({
  MotionBox: {},
}));

export default function Motionbox({ children }) {
  const classes = useStyle();
  return (
    <Box className={classes.MotionBox}>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
