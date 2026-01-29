import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Tooltip,
  Table,
  IconButton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
} from "@material-ui/core";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { toast } from "react-hot-toast";
import Filtter from "src/component/Filtter";
import NoDataFound from "src/component/NoDataFound";
import GoBack from "src/component/GoBack";
import Pagination from "@material-ui/lab/Pagination";
import { getAPIHandler, postAPIHandler } from "src/ApiConfig/service";
import * as web3 from "@solana/web3.js";
import bs58 from "bs58";
import { makeStyles } from "@material-ui/core/styles";
import { MdDelete, MdEdit } from "react-icons/md";
import * as splToken from "@solana/spl-token";
import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import * as XLSX from "xlsx";

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

function ApprovedSol() {
  let filterData = {};
  const classes = useStyles();
  const history = useNavigate();
  const [gameData, setGameData] = useState([]);
  const [withdrawSettings, setwithdrawSettings] = useState([]);
  const [isGameUpdating, setIsGameUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [historyType, setHistoryType] = useState("");
  const [filtersData, setFiltersData] = useState({
    fromDate: null,
    toDate: null,
    search: "",
    // status: "ALL",
    historyType: "modren",
  });
  const [noOfPages, setNoOfPages] = useState({
    pages: 1,
    totalPages: 1,
  });

  const [walletAddress, setWalletAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPrivateKeyInputVisible, setIsPrivateKeyInputVisible] =
    useState(false);
  const [isPrivateKeyApproved, setIsPrivateKeyApproved] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tokenmint, setTokenMint] = useState("");
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  //   const [feeWallet, setFeeWallet] = useState(""); // Fee Wallet state
  let storedtoken;
  let mainurl;
  let transferurl;


  const feeWallet = process.env.REACT_APP_SOL_FEE_WALLET;
  console.log(feeWallet, 'feeWalletre');
  
  const handlePrivateKeyChange = (e) => {
    const inputKey = e.target.value;
    setPrivateKey(inputKey);

    try {
      // Decode the private key and generate the wallet's public key
      const decodedKey = bs58.decode(inputKey);
      const keypair = web3.Keypair.fromSecretKey(decodedKey);
      setWalletAddress(keypair.publicKey.toBase58()); // Set wallet address
      setIsPrivateKeyApproved(true); // Mark as private key approved
      toast.success("Wallet connected successfully via private key.");
    } catch (error) {
      setWalletAddress(""); // Clear wallet address if private key is invalid
      setIsPrivateKeyApproved(false);
      toast.error("Invalid private key. Please enter a valid key.");
    }
  };

  const handleApprovePrivateKey = () => {
    if (privateKey) {
      try {
        // Attempt to decode the private key using bs58
        const decodedKey = bs58.decode(privateKey);
        setIsPrivateKeyApproved(true); // Mark private key as approved
        toast.success("Private key successfully approved.");
      } catch (error) {
        toast.error("Invalid private key.");
      }
    } else {
      toast.error("Please enter a valid private key.");
    }
  };

 

  const settings = async () => {
    try {
      const response = await getAPIHandler({
        endPoint: "getwithdrawsettingsmodren",
        tokenDATA: window.sessionStorage.getItem("moderntoken"),
        paramsData: {
          page: page,
          limit: 10,
          ...filterData,
        },
      });
console.log(response, 'responsewithdrawSettings');

      // if (response && response.data && Array.isArray(response.data.result)) {
      //   const filteredData = response.data.result.filter(
      //     (item) => item.status === 'ACTIVE'
      //   );
      if (response && response.data && Array.isArray(response.data.result)) {
        const filteredData = response.data.result.filter(
          (item) =>
            item.status === 'ACTIVE' &&
            (item.Symbol === 'SOL' )
        );
      
      console.log(filteredData, 'filteredDataSOL');
      
        console.log(filteredData[0].Token_Mint, 'filteredData');
        setTokenMint(filteredData[0].Token_Mint); // Set the tokenMint state with the filteredData[0].Token_Mint

      } else {
        console.error('Invalid response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {

    settings();

  }, [tokenmint]);

  // Fetch game settings including the Fee_wallet
  const getwithdrawarsfunction = async (type) => {

    if (type === "modren") {
      storedtoken = window.sessionStorage.getItem("moderntoken");
      mainurl = "gettransactionHistorymodren"

    } else {

      storedtoken = window.sessionStorage.getItem("retrotoken");
      mainurl = "gettransactionHistoryretro"

    }

    console.log("Fetching withdrawals from:", mainurl);


    try {
      filterData = {
        search: filtersData?.search ? filtersData?.search : null,
        fromDate: filtersData.fromDate
          ? moment(filtersData.fromDate).format("YYYY-MM-DD")
          : null,
        toDate: filtersData.toDate
          ? moment(filtersData.toDate).format("YYYY-MM-DD")
          : null,
        // status: filtersData?.status !== "ALL" ? filtersData.status : undefined,
      };

      console.log(filterData, 'filterDatarm');

      const response = await getAPIHandler({
        endPoint: mainurl,
        tokenDATA: storedtoken,
        paramsData: {
          page: page,
          limit: 10,
          status: "APPROVED",
          Symbol: "SOL",
          ...filterData,
        },

      });

      console.log(response, "response from APPROVED");

      if (response.data.responseCode === 200) {
        // Filter the data to only include approved items
        const approvedData = response.data.result.docs;
        console.log(approvedData, "approvedData");
        setGameData(approvedData);
        setIsClear(false);
        setNoOfPages({
          pages: response.data.result.pages,
          totalPages: response.data.result.total,
        });
      }
      setIsGameUpdating(false);
    } catch (error) {
      setGameData([]);
      setIsGameUpdating(false);
    }


  };
  useEffect(() => {
    const source = axios.CancelToken.source();

    return () => {
      source.cancel();
    };
  }, [page]);
  useEffect(() => {
    getwithdrawarsfunction(filtersData.historyType);
  }, [filtersData.historyType, page]);
  //   useEffect(() => {
  //     if (isClear) {
  //       gameManagementApi();
  //     }
  //   }, [isClear]);
  const handleClearFilter = () => {
    setFiltersData({
      ...filtersData,
      ["fromDate"]: null,
      ["toDate"]: null,
      ["search"]: "",
      ["status"]: "ALL",
    });
    setIsClear(true);
  };

  const handleRowSelect = (id) => {

    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelected, id];
      }
    });

  };

  const handleSelectAll = () => {
    if (selectAllChecked) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...gameData]);
    }
    setSelectAllChecked(!selectAllChecked);
  };

  const fetchAllApprovedWithdrawals = async () => {
    const type = filtersData.historyType;
    const tokenDATA = type === "modren"
      ? window.sessionStorage.getItem("moderntoken")
      : window.sessionStorage.getItem("retrotoken");
    const endPoint = type === "modren" ? "gettransactionHistorymodren" : "gettransactionHistoryretro";
    let currentPage = 1;
    const aggregatedData = [];

    while (true) {
      const response = await getAPIHandler({
        endPoint,
        tokenDATA,
        paramsData: {
          page: currentPage,
          limit: 100,
          status: "APPROVED",
          Symbol: "SOL",
          search: filtersData?.search ? filtersData?.search : null,
          fromDate: filtersData.fromDate
            ? moment(filtersData.fromDate).format("YYYY-MM-DD")
            : null,
          toDate: filtersData.toDate
            ? moment(filtersData.toDate).format("YYYY-MM-DD")
            : null,
        },
      });

      if (!response || !response.data || response.data.responseCode !== 200) {
        break;
      }

      const pageData = Array.isArray(response.data.result?.docs)
        ? response.data.result.docs
        : [];
      aggregatedData.push(...pageData);

      const totalPages = Number(response.data.result?.pages);
      if (!totalPages || currentPage >= totalPages) {
        break;
      }

      currentPage += 1;
    }

    return aggregatedData;
  };

  const handleDownload = async () => {
    if (isDownloading) {
      return;
    }

    try {
      setIsDownloading(true);
      const data = await fetchAllApprovedWithdrawals();

      if (!Array.isArray(data) || data.length === 0) {
        toast.error("No data available for export.");
        return;
      }

      const flatData = data.map((item) => {
        const formattedItem = {};

        Object.keys(item || {}).forEach((key) => {
          const value = item[key];

          if (value && typeof value === "object") {
            formattedItem[key] = JSON.stringify(value);
          } else {
            formattedItem[key] = value;
          }
        });

        return formattedItem;
      });

      const worksheet = XLSX.utils.json_to_sheet(flatData);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Withdrawals SOL");
      XLSX.writeFile(workbook, "Approved_Withdrawals_SOL.xlsx");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Failed to download Excel");
    } finally {
      setIsDownloading(false);
    }
  };



  const handleApproveClick = async () => {


    if (filtersData.historyType === "modren") {
      storedtoken = window.sessionStorage.getItem("moderntoken");
      transferurl = "approveRejectWithdrawalmodren"
    } else {
      storedtoken = window.sessionStorage.getItem("retrotoken");
      transferurl = "approveRejectWithdrawalretro"
    }

    if (!privateKey) {
      toast.error("Please enter the private key before approving.");
      return;
    }

    if (!walletAddress) {
      toast.error("Wallet not connected. Please connect your wallet first.");
      return;
    }

    const { PublicKey, Keypair, SystemProgram, Connection, Transaction } = web3;

    try {
     console.log(privateKey, "privateKey");

      const decodedPrivateKey = bs58.decode(privateKey);
      console.log(decodedPrivateKey, "decodedPrivateKey");
      
      const sender = Keypair.fromSecretKey(decodedPrivateKey);
      console.log(sender, "senderPublicKey");

      if (!feeWallet) {
        toast.error("Fee wallet not available.");
        return;
      }

      const connection = new Connection("https://april-ybrd7e-fast-mainnet.helius-rpc.com/");

      // const connection = new Connection("https://api.devnet.solana.com"); // https://api.testnet.solana.com

      if (selectedRows.length === 0) {
        toast.error("No rows selected for approval.");
        return;
      }

      let totalTokenAmount = 0;
      let totalFeeTokens = 0;
      const MAX_TRANSACTIONS_PER_BATCH = 20;
      let transferBatch = [];
      let feeBatch = [];
      // let batch=[];
      let transactionCount = 0;

      // Check wallet balance
      const walletBalance = await connection.getBalance(sender.publicKey);
      const solBalance = walletBalance / web3.LAMPORTS_PER_SOL;

      console.log(`Wallet balance: ${solBalance} SOL`);


      console.log(filtersData.historyType, "filtersData.historyType");




      if (tokenmint == "So11111111111111111111111111111111111111112") {
        console.log(tokenmint, "tokenmintif");
        selectedRows.forEach(row => {
          totalTokenAmount += parseFloat(row.Token_Amount) || 0;
          totalFeeTokens += row.Fee_tokens !== undefined ? parseFloat(row.Fee_tokens) : 0;
        });

        totalTokenAmount = Math.floor(totalTokenAmount * 1e9) / 1e9;
        totalFeeTokens = Math.floor(totalFeeTokens * 1e9) / 1e9;

        console.log(`Total Token Amount: ${totalTokenAmount}, Total Fee Tokens: ${totalFeeTokens}`);

        if (solBalance < totalTokenAmount + totalFeeTokens) {
          toast.error("Insufficient SOL balance to cover all transactions and fees. Approval stopped.");
          return;
        }



        for (const row of selectedRows) {
          const transactionAmount = Math.floor((parseFloat(row.Token_Amount) || 0) * 1e9);
          const feeAmount = row.Fee_tokens !== undefined ? Math.floor(parseFloat(row.Fee_tokens) * 1e9) : Math.floor(0.0022 * 1e9);
          console.log(row.walletAddress, feeWallet, 'transactionAmount, feeAmount');


          const transferInstruction = SystemProgram.transfer({
            fromPubkey: sender.publicKey,
            toPubkey: new PublicKey(row.walletAddress),
            lamports: transactionAmount,
          });

          const feeTransferInstruction = SystemProgram.transfer({
            fromPubkey: sender.publicKey,
            toPubkey: new PublicKey(feeWallet),
            lamports: feeAmount,
          });


          console.log(transferInstruction, feeTransferInstruction, 'transferInstruction, feeTransferInstruction');

          transferBatch.push(transferInstruction);
          feeBatch.push(feeTransferInstruction);

          transactionCount++;

          // Execute transactions in batches
          if (transactionCount >= MAX_TRANSACTIONS_PER_BATCH) {
            await executeTransaction([...transferBatch, ...feeBatch], sender, connection);
            transferBatch = [];
            feeBatch = [];
            transactionCount = 0;
          }
        }

        // Execute any remaining transactions
        if (transferBatch.length > 0 || feeBatch.length > 0) {
          await executeTransaction([...transferBatch, ...feeBatch], sender, connection);
        }

        const senderBalance = await connection.getBalance(sender.publicKey);
        console.log(`Sender balance after transaction: ${(senderBalance / web3.LAMPORTS_PER_SOL).toFixed(2)} SOL`);
      }


      else {
        console.log(tokenmint, "tokenmint else");

        const batch = []; // collect all instructions here

        const speexecuteTransaction = async (batchInstructions) => {
          try {
            const transaction = new Transaction().add(...batchInstructions);
            const signature = await connection.sendTransaction(transaction, [sender]);
            console.log("Transaction signature:", signature);
            const status = await connection.getSignatureStatus(signature);
            await connection.confirmTransaction(signature, "confirmed");
      // if (status && status.value && status.value.err === null) {
        console.log("Transaction confirmed successfully.");
        toast.success("Transactions successfully processed.");

        // const responseData = {
        //   hash: signature,
        //   userIds: selectedRows,
        //   status: "TRANSFERRED",
        // };
        const responseData = {
          hash: signature,
          userIds: selectedRows.map((row) => row._id),
          status: "TRANSFERRED",
        };
        console.log("Response DataTRANSFERRED", responseData);

        try {
          setIsGameUpdating(true);
          const response = await postAPIHandler({
            endPoint: transferurl,
            dataToSend: responseData,
            tokenDATA: storedtoken,
          });

          console.log(response, "response from approveRejectWithdrawal");

          if (response && response.data.responseCode === 200) {
            toast.success("Transaction data successfully posted.");
            // gameManagementApi();
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            toast.error("Failed to post transaction data.");
          }
        } catch (error) {
          console.error("Error posting transaction data:", error);
          toast.error("An error occurred while posting transaction data.");
        } finally {
          setIsGameUpdating(false);
        }
      // } else {
      //   console.log("Transaction failed:", status.value.err);
      //   toast.error("Transaction failed.");
      // }

           
          } catch (error) {
            console.error("Transaction failed:", error);
          }
        };



        for (const some of selectedRows) {
          console.log(some, "some");

          const mintPublicKey = new PublicKey(tokenmint);

          try {
            const receiverPublicKey = new PublicKey(some.walletAddress);
            const feeReceiverPublicKey = new PublicKey(feeWallet);

            const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
              connection,
              sender,
              mintPublicKey,
              sender.publicKey
            ).catch((error) => {
              console.error(`Error creating fromTokenAccount:`, error);
              return null;
            });

            const toUserTokenAccount = await getOrCreateAssociatedTokenAccount(
              connection,
              sender,
              mintPublicKey,
              receiverPublicKey
            ).catch((error) => {
              console.error(`Error creating toTokenAccount for user ${some.walletAddress}:`, error);
              return null;
            });

            const toFeeTokenAccount = await getOrCreateAssociatedTokenAccount(
              connection,
              sender,
              mintPublicKey,
              feeReceiverPublicKey
            ).catch((error) => {
              console.error(`Error creating toTokenAccount for fee wallet ${some.fee_wallet}:`, error);
              return null;
            });

            if (!fromTokenAccount || !toUserTokenAccount || !toFeeTokenAccount) {
              console.error(`Skipping transfer because one of the token accounts couldn't be created`);
              continue; // Skip this row if failed
            }

            const mintInfo = await splToken.getMint(connection, mintPublicKey);

            const userAmount = Math.floor(parseFloat(some.Token_Amount) * Math.pow(10, mintInfo.decimals));
            const feeAmount = Math.floor(parseFloat(some.Fee_tokens) * Math.pow(10, mintInfo.decimals));

            const userTransferInstruction = splToken.createTransferInstruction(
              fromTokenAccount.address,
              toUserTokenAccount.address,
              sender.publicKey,
              userAmount,
              [],
              splToken.TOKEN_PROGRAM_ID
            );

            const feeTransferInstruction = splToken.createTransferInstruction(
              fromTokenAccount.address,
              toFeeTokenAccount.address,
              sender.publicKey,
              feeAmount,
              [],
              splToken.TOKEN_PROGRAM_ID
            );

            batch.push(userTransferInstruction);
            batch.push(feeTransferInstruction);

          } catch (error) {
            console.error(`Error processing row ${some.walletAddress}:`, error);
          }
        }

        if (batch.length > 0) {
          console.log(`Executing batch with ${batch.length} instructions`);
          await speexecuteTransaction(batch); // Send all at once, 1 TX Hash 🚀
        }

      }

    } catch (error) {
      console.error("Error processing the transactions:", error);
      toast.error("An error occurred while processing the transactions.");
    }
  };

  const executeTransaction = async (instructions, sender, connection) => {
    try {
      console.log("Transaction Instructions:", instructions);

      const { blockhash } = await connection.getLatestBlockhash();
      console.log("Blockhash: ", blockhash);

      const transaction = new web3.Transaction({
        recentBlockhash: blockhash,
        feePayer: sender.publicKey,
      }).add(...instructions);

      console.log("Transaction details:", transaction);

      const signature = await web3.sendAndConfirmTransaction(connection, transaction, [sender], { commitment: "processed" });

      console.log("Transaction hash:", signature);

      const status = await connection.getSignatureStatus(signature);
      if (status && status.value && status.value.err === null) {
        console.log("Transaction confirmed successfully.");
        toast.success("Transactions successfully processed.");

        // const responseData = {
        //   hash: signature,
        //   userIds: selectedRows,
        //   status: "TRANSFERRED",
        // };
        const responseData = {
          hash: signature,
          userIds: selectedRows.map((row) => row._id),
          status: "TRANSFERRED",
        };
        console.log("ResponseDataTRANSFERRED", responseData);

        try {
          setIsGameUpdating(true);
          const response = await postAPIHandler({
            endPoint: transferurl,
            dataToSend: responseData,
            tokenDATA: storedtoken,
          });

          console.log(response, "response from approveRejectWithdrawal2");

          if (response && response.data.responseCode === 200) {
            toast.success("Transaction data successfully posted.");
            // gameManagementApi();
            // setTimeout(() => {
            //   window.location.reload();
            // }, 1000);
          } else {
            toast.error("Failed to post transaction data.");
          }
        } catch (error) {
          console.error("Error posting transaction data:", error);
          toast.error("An error occurred while posting transaction data.");
        } finally {
          setIsGameUpdating(false);
        }
      } else {
        console.log("Transaction failed:", status.value.err);
        toast.error("Transaction failed.");
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("An error occurred during the transaction.");
    }
  };

  useEffect(() => {
    if (gameData.length > 0 && selectedRows.length === gameData.length) {
      setSelectAllChecked(true);
    } else {
      setSelectAllChecked(false);
    }
  }, [gameData, selectedRows]);

  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title={"Approved Withdrawals SOL"} />
        <Box className="p-4" display="flex" alignItems="center">
          <TextField
            label="Enter Private Key"
            type="password"
            value={privateKey}
            onChange={handlePrivateKeyChange}
            variant="outlined"
            className="flex-1"
            style={{ maxWidth: "100%", width: "500px" }}
          />
          {privateKey && (
            <Button
              variant="contained"
              color="primary"
              className="bg-green-600 hover:bg-green-700 text-white font-medium"
              style={{ marginLeft: "10px" }}
              onClick={handleApproveClick}
            >
              Approve
            </Button>
          )}
        </Box>
      </Box>

      <Box mt={3} mb={3}>
        <Paper elevation={3}>
          <Filtter
            filter={filtersData}
            setFilter={(data) => setFiltersData(data)}
            clearFilters={handleClearFilter}
            onClickFun={getwithdrawarsfunction}
            type="ledger"
            // type="else2"
            placeholder="Search"
            filterData={{
              ...filterData,
              limit: noOfPages.totalPages,
              status: "APPROVED",
            }}
            excelTableName="Approved Withdrawals SOL"
            apiEndPoint="transactionHistory"
          />
          <Box display="flex" justifyContent="flex-end" padding={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? "Exporting..." : "Export to Excel"}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S/N</TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell>Wallet</TableCell>
                  <TableCell>Network</TableCell>
                  <TableCell>Initiated</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>USDT Amount</TableCell>
                  <TableCell>Charge</TableCell>
                  <TableCell>After Charge</TableCell>
                  <TableCell>Token Amount</TableCell>
                  <TableCell>Fee Tokens</TableCell>
                  <TableCell>Token</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Transaction Type</TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectAllChecked}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gameData.length === 0 ? (
                  <NoDataFound />
                ) : (
                  gameData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                      {/* <TableCell>{row?.userId?.userName}</TableCell>{" "} */}
                      <TableCell>
                      {row.userId?.userName || ""}
                        {/* <Link
                          to={`/user-dashboard/${row.userId?._id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {row.userId?.userName || ""}
                        </Link> */}
                      </TableCell>
                      <TableCell>{row?.walletAddress}</TableCell>
                      <TableCell>{row?.token}</TableCell>
                      {/* <TableCell>{row?.createdAt}</TableCell> */}
                      <TableCell>
                        {" "}
                        {moment(row?.createdAt).format("lll")
                          ? moment(row?.createdAt).format("lll")
                          : "--"}
                      </TableCell>
                      <TableCell>{row?.quantity}</TableCell>
                      <TableCell>{row?.amount}</TableCell>
                      <TableCell>{row?.charge}</TableCell>
                      <TableCell>
                        {row?.AfterCharge
                          ? parseFloat(row.AfterCharge).toFixed(4)
                          : "0.0000"}
                      </TableCell>
                      <TableCell>{row?.Token_Amount}</TableCell>
                      <TableCell>{row?.Fee_tokens || 0.0022} </TableCell>
                      <TableCell>{row?.Symbol}</TableCell>
                      <TableCell
                        style={
                          row?.status == "REJECTED"
                            ? { color: "red" }
                            : row?.status == "PENDING"
                              ? { color: "orange" }
                              : row?.status == "APPROVED"
                                ? { color: "green" }
                                : { color: "gray" }
                        }
                      >
                        {row?.status}
                      </TableCell>
                      <TableCell>{row?.transactionType}</TableCell>
                      <TableCell>
                        <Tooltip title="View">
                          <IconButton
                            onClick={() => history(`/withdrawal/${row._id}`)}
                          >
                            <MdEdit size={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton>
                            <MdDelete size={20} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.some(
                            (item) =>
                              JSON.stringify(item) === JSON.stringify(row)
                          )}
                          onChange={() => handleRowSelect(row)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container justify="center">
        <Pagination
          count={noOfPages.pages}
          page={page}
          onChange={(_, page) => setPage(page)}
        />
      </Grid>
    </Box>
  );
}

export default ApprovedSol;
