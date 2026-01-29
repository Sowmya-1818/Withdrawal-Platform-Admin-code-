import { sortAddress } from "src/utils";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import { IconButton } from "@material-ui/core";
import { FaRegCopy } from "react-icons/fa";

const CopyWalletAddress = ({ address }) => {
  return (
    <div>
      {sortAddress(address)}
      <CopyToClipboard text={address}>
        <IconButton
          onClick={() => toast.success("Copied")}
          style={{
            width: "37px",
            height: "26px",
          }}
        >
          <FaRegCopy />
        </IconButton>
      </CopyToClipboard>
    </div>
  );
};

export default CopyWalletAddress;
