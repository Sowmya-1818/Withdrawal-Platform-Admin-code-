
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
import { getAPIHandler, getAPIHandlerspin, postAPIHandler, postAPIHandlerspin } from "src/ApiConfig/service";
import * as web3 from "@solana/web3.js";
import bs58 from "bs58";
import { makeStyles } from "@material-ui/core/styles";
import { MdDelete, MdEdit } from "react-icons/md";
import { GetApprovedWithdrawalsApi, GetWithdrawalsApi, transfertowallet } from "../../../ApiConfig/Utils/APIs/Admin_Apis";
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

function Approvedwithdrawalstringsol() {
  let filterData = {};
  const classes = useStyles();
  const history = useNavigate();
  const [gameData, setGameData] = useState([]);
  const [withdrawSettings, setwithdrawSettings] = useState([]);
  const [isGameUpdating, setIsGameUpdating] = useState(false);
  const [page, setPage] = useState(1);
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
  const controllers = []
  const [totalPage, setTotalPage] = useState('');
  const [totalRecord, setTotalRecord] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [tokenmint, setTokenMint] = useState("");
  const [isPrivateKeyInputVisible, setIsPrivateKeyInputVisible] =
    useState(false);
  const [isPrivateKeyApproved, setIsPrivateKeyApproved] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  //   const [feeWallet, setFeeWallet] = useState(
  //     "8DvEmHkBQULpUkBaJeZ55gDXhrJcBMxQzCdny6HFbtgx"
  //   ); // Fee Wallet state

  const feeWallet = process.env.REACT_APP_SOL_FEE_WALLET;

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


  useEffect(() => {
    if (totalRecord || totalRecord === 0) {
      var page = totalRecord / limit;
      console.log(page, "page");
      setNoOfPages({
        pages: page.toFixed(0),
        totalPages: totalRecord,
      });
      setTotalPage(page);
    }
  }, [totalRecord, limit])


  const settings = async (currentPage) => {
    try {
      console.log(currentPage, "currentPage");

      // Log the filtersData to debug its structure


      const controller = new AbortController();
      controllers.push(controller);

      const response = await GetWithdrawalsApi(
        filtersData?.search,
        startDate,
        endDate,
        currentPage,
        limit,
        controller,

        filterData,// Added filterData to the API call

      );
      console.log(response, "responseGetWithdrawalsApi");


      if (response.status === 200) {
        const filteredData = response.data.data.filter(item => item.status === true && item.name === 'SOL');
        // setGameData(filteredData);

        console.log(filteredData, "filtered response manuv");
        console.log(response.data.totalRecord, "totalRecord");

        console.log(filteredData[0].TokenAddress, 'filteredDataTokenAddress');
        setTokenMint(filteredData[0].TokenAddress);
        console.log(totalPage, "totalPage");
        setTotalRecord(response.data.totalRecord);

      }
      else {
        console.error('Invalid response structure:', response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {

    settings();

  }, [tokenmint])

  const fetchTransferWithdrawals = async (currentPage) => {
    try {
      console.log(currentPage, "currentPage");

      // Log the filtersData to debug its structure
      const filterData = {
        search: filtersData?.search || null,
        fromDate: filtersData?.fromDate
          ? moment(filtersData.fromDate).format("YYYY-MM-DD")
          : null,
        toDate: filtersData?.toDate
          ? moment(filtersData.toDate).format("YYYY-MM-DD")
          : null,
      };
      console.log(filtersData?.search, 'filterData'); // Debugging the filterData

      const controller = new AbortController();
      controllers.push(controller);
      const Symbol = "SOL"
      const response = await GetApprovedWithdrawalsApi(
        filtersData?.search,
        startDate,
        endDate,
        currentPage,
        limit,
        Symbol,
        controller,

        filterData, // Added filterData to the API call

      );
      console.log(response, "responseGetApprovedWithdrawalsApi");

      const solanaData = response.data.data

      console.log(solanaData, "🌟 Solana filtered data");

      if (response.status === 200) {
        setGameData(response.data.data);
        for (let i = 0; i < response.data.data.length; i++) {
          console.log(`Item ${i + 1}:`, response.data.data[i].user_id?.username);
        }
        console.log(response.data.data, "response manu");

        console.log(totalPage, "totalPage");
        setTotalRecord(response.data.totalRecord);
      }
    } catch (error) {
      console.error("Error fetching transfer withdrawals:", error);
    }
  };

  useEffect(() => {

    fetchTransferWithdrawals(page);

  }, [page, filtersData])


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

  // const handleRowSelect = (id) => {
  //   setSelectedRows((prevSelected) => {
  //     if (prevSelected.includes(id)) {
  //       return prevSelected.filter((rowId) => rowId !== id);
  //     } else {
  //       return [...prevSelected, id];
  //     }
  //   });
  // };

  const handleRowSelect = (row) => {
    setSelectedRows((prevSelected) => {
      const exists = prevSelected.find((item) => item._id === row._id);

      const newSelectedRows = exists
        ? prevSelected.filter((item) => item._id !== row._id)
        : [...prevSelected, row];

      console.log("Updated Selected Data:", newSelectedRows);
      return newSelectedRows;
    });
  };

  //   const handleSelectAll = () => {
  //     if (selectAllChecked) {
  //       setSelectedRows([]); // Deselect all rows if "Select All" checkbox is unchecked
  //     } else {
  //       setSelectedRows(gameData.map((data) => data.reqId)); // Select all rows if "Select All" checkbox is checked
  //     }
  //     setSelectAllChecked(!selectAllChecked); // Toggle the "Select All" checkbox state
  //   };

  const handleSelectAll = () => {
    if (selectAllChecked) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...gameData]);
    }
    setSelectAllChecked(!selectAllChecked);
  };

  const fetchAllApprovedWithdrawals = async () => {
    let currentPage = 1;
    const aggregatedData = [];

    while (true) {
      const controller = new AbortController();
      const response = await GetApprovedWithdrawalsApi(
        filtersData?.search,
        startDate,
        endDate,
        currentPage,
        100,
        "SOL",
        controller,
        {
          search: filtersData?.search || null,
          fromDate: filtersData?.fromDate
            ? moment(filtersData.fromDate).format("YYYY-MM-DD")
            : null,
          toDate: filtersData?.toDate
            ? moment(filtersData.toDate).format("YYYY-MM-DD")
            : null,
        }
      );

      if (!response || !response.data) {
        break;
      }

      const pageData = Array.isArray(response.data.data) ? response.data.data : [];
      aggregatedData.push(...pageData);

      const totalPages = Number(response.data.totalPages);
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

      XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Withdrawals String SOL");
      XLSX.writeFile(workbook, "Approved_Withdrawals_String_SOL.xlsx");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Failed to download Excel");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleApproveClick = async () => {

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


      if (tokenmint == "So11111111111111111111111111111111111111112") {
        console.log(tokenmint, "tokenmintif");
        selectedRows.forEach(row => {
          totalTokenAmount += parseFloat(row.amount) || 0;
          totalFeeTokens += row.FeeTokens !== undefined ? parseFloat(row.FeeTokens) : 0;
        });

        totalTokenAmount = Math.floor(totalTokenAmount * 1e9) / 1e9;
        totalFeeTokens = Math.floor(totalFeeTokens * 1e9) / 1e9;

        console.log(`Total Token Amount: ${totalTokenAmount}, Total Fee Tokens: ${totalFeeTokens}`);

        if (solBalance < totalTokenAmount + totalFeeTokens) {
          toast.error("Insufficient SOL balance to cover all transactions and fees. Approval stopped.");
          return;
        }



        for (const row of selectedRows) {
          const transactionAmount = Math.floor((parseFloat(row.amount) || 0) * 1e9);
          const feeAmount = row.FeeTokens !== undefined ? Math.floor(parseFloat(row.FeeTokens) * 1e9) : Math.floor(0.0022 * 1e9);
          console.log(row.wallet_id, feeWallet, 'transactionAmount', transactionAmount, 'feeAmount', feeAmount);


          const transferInstruction = SystemProgram.transfer({
            fromPubkey: sender.publicKey,
            toPubkey: new PublicKey(row.wallet_id),
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
          console.log("Executing batch of instructions:", batchInstructions);

          try {
            const transaction = new Transaction().add(...batchInstructions);
            const signature = await connection.sendTransaction(transaction, [sender]);
            console.log("Transaction signature:", signature);

            const status = await connection.getSignatureStatus(signature);
            await connection.confirmTransaction(signature, "confirmed");

            // If the transaction is confirmed, we proceed with further logic
            console.log("Transaction confirmed successfully.");
            toast.success("Transactions successfully processed.");

            const responseData = {
              hash: signature,
              userIds: selectedRows.map((row) => row._id),
              status: "TRANSFERRED",
            };
            console.log("Response DataTRANSFERRED", responseData);

            if (responseData) {
              const controller = new AbortController();
              controllers.push(controller);
              const responseData = {
                transactionHash: signature,
                withdrawalsData: selectedRows,

                // userIds: [selectedRows[0],selectedRows[1]],
                status: "TRANSFERRED",
              };
console.log(responseData, "responseData");

              const response = await transfertowallet(responseData, controller);
              console.log(response, "response transfertowallet11");
              if (response.status === 200) {
                // getWithdrawApi()
                toast.success(response.data.message);
                setTimeout(() => {
                  window.location.reload();
                }, 1000);


              } else if (response.response.status === 404) {
                toast.error(response.response.data?.message);
              } else if (response.response.status === 401) {
                toast.error(response.response.data?.message);
              } else {
                toast.error("Something went wrong!");
              }


            }
          } catch (error) {
            console.error("Transaction failed:", error);
            toast.error("Transaction failed, please try again.");
          }
        };



        for (const some of selectedRows) {
          console.log(some, "some". tokenmint, 'tokenmint');

          const mintPublicKey = new PublicKey(tokenmint);
          console.log(mintPublicKey, 'mintPublicKey');

          try {
            const receiverPublicKey = new PublicKey(some.wallet_id);
            const feeReceiverPublicKey = new PublicKey(feeWallet);
            // console.log(feeReceiverPublicKey, 'feeReceiverPublicKey');
            // console.log(receiverPublicKey, 'receiverPublicKey');



            const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
              connection,
              sender,
              mintPublicKey,
              sender.publicKey
            ).catch((error) => {
              console.error(`Error creating fromTokenAccount:`, error);
              return null;
            });


            // filepath: d:\StringbankLivecode1\stringbank\src\views\pages\Withdrawals\Approvedwithdrawalstringsol.js
            const accountInfo = await splToken.getAccount(connection, fromTokenAccount.address);
            console.log("accountInfo:", accountInfo);
            const rawAmount = parseInt(accountInfo.amount.toString());
            const decimals = accountInfo.decimals;
            const balance = rawAmount / Math.pow(10, 9);
            console.log(`Balance of fromTokenAccount: ${balance}`);
            // const userAmount = Math.floor(parseFloat(some.amount) * Math.pow(10, mintInfo.decimals));
            // const feeAmount = Math.floor(parseFloat(some.FeeTokens) * Math.pow(10, mintInfo.decimals));




            const toUserTokenAccount = await getOrCreateAssociatedTokenAccount(
              connection,
              sender,
              mintPublicKey,
              receiverPublicKey
            ).catch((error) => {
              console.error(`Error creating toTokenAccount for user ${some.wallet_id}:`, error);
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

            const userAmount = Math.floor(parseFloat(some.TransferTokens) * Math.pow(10, mintInfo.decimals));
            const feeAmount = Math.floor(parseFloat(some.FeeTokens) * Math.pow(10, mintInfo.decimals));
           

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
            console.error(`Error processing row ${some.wallet_id}:`, error);
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
        console.log("Response DataTRANSFERREDmmm", responseData);

        if (responseData) {
          const controller = new AbortController();
          controllers.push(controller);
          const responseData = {
            transactionHash: signature,
            withdrawalsData: selectedRows,

            // userIds: [selectedRows[0],selectedRows[1]],
            status: "TRANSFERRED",
          };

          const response = await transfertowallet(responseData, controller);
          console.log(response, "response transfertowalletmmm");
          if (response.status === 200) {
            // getWithdrawApi()
            toast.success(response.data.message);
            setTimeout(() => {
              window.location.reload();
            }, 1000);


          } else if (response.response.status === 404) {
            toast.error(response.response.data?.message);
          } else if (response.response.status === 401) {
            toast.error(response.response.data?.message);
          } else {
            toast.error("Something went wrong!");
          }


        }
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
    // console.log(gameData, "Updated gameData");
  }, [gameData, selectedRows]);


  return (
    <Box className={classes.main}>
      <Box className="displaySpacebetween">
        <GoBack title={"Approved Withdrawals String Sol"} />
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
            // onClickFun={gameManagementApi}
            type="else2"
            placeholder="Search"
            filterData={{
              ...filterData,
              limit: noOfPages.totalPages,
              status: "APPROVED",
            }}
            excelTableName="Approved Withdrawals string sol"
            apiEndPoint="Pending"
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
                  <TableCell>Initiated</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>USDT Amount</TableCell>
                  <TableCell>Charge</TableCell>
                  <TableCell>After Charge</TableCell>
                  <TableCell>Tokens Amount</TableCell>
                  <TableCell>Network</TableCell>
                  <TableCell>Symbol </TableCell>
                  <TableCell>Status</TableCell>
                  {/* <TableCell>Actions</TableCell> */}
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

                      <TableCell>{row.user_id?.username || "Anonymous"}</TableCell>
                      {/* <TableCell>
                        <Link
                          to={`/user-dashboard/${row.user_id?._id}`} state={{ username: row.user_id?.username }}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {row.user_id?.username || "Anonymous"}
                        </Link>
                      </TableCell> */}

                      <TableCell>{row.wallet_id}</TableCell>

                      <TableCell>
                        {" "}
                        {moment(row?.createdAt).format("lll")
                          ? moment(row?.createdAt).format("lll")
                          : "--"}
                      </TableCell>
                      <TableCell>{row?.amount}</TableCell>
                      <TableCell>{row?.USDT_Amount}</TableCell>
                      <TableCell>{row?.charge}</TableCell>
                      <TableCell>{row?.after_charge}</TableCell>
                      <TableCell>{row?.TransferTokens}</TableCell>
                      <TableCell>{row?.method_id.name}</TableCell>
                      <TableCell>{row?.TokenSymbol}</TableCell>

                      {/* <TableCell>{row?.wallet_currency_id.symbol}</TableCell> */}



                      <TableCell
                        style={
                          row?.status === 1
                            ? { color: "green" }
                            : row?.status === 2
                              ? { color: "orange" }
                              : row?.status === 3
                                ? { color: "red" }
                                : { color: "black" } // Default color, just in case the status is not 1, 2, or 3
                        }
                      >
                        {row?.status === 1
                          ? "approved"
                          : row?.status === 2
                            ? "pending"
                            : row?.status === 3
                              ? "rejected"
                              : "unknown"} {/* You can also handle other status if needed */}
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


      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={noOfPages.pages}
          page={page}
          onChange={(event, value) => setPage(value)}
          shape="rounded"
          color="primary"
        />
      </Box>
    </Box>
  );
}

export default Approvedwithdrawalstringsol;
