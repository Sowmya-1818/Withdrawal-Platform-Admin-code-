import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { calculateTimeLeft } from "src/utils";
import { getAPIHandler } from "src/ApiConfig/service";
import toast from "react-hot-toast";
import { Connection, PublicKey } from "@solana/web3.js";
import { RPC } from "src/constants";

export const AuthContext = createContext();

const setSession = (accessToken) => {
  if (accessToken) {
    sessionStorage.setItem("token", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    sessionStorage.removeItem("token");
    delete axios.defaults.headers.common.Authorization;
  }
};

function checkLogin() {
  const accessToken = window.sessionStorage.getItem("token");
  return accessToken ? true : false;
}

export default function AuthProvider(props) {
  const [isLogin, setIsLogin] = useState(checkLogin());
  const [userData, setUserData] = useState({});
  const [dashboardData, setDashboardData] = useState({});
  const [endTime, setEndtime] = useState();
  const [timeLeft, setTimeLeft] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isDashboardUpdating, setIsDashboardUpdating] = useState(false);
  const [walletAddress, setWalletAddress] = useState();
  const [solbalance, setBalance] = useState();
  const [wallet, setWallet] = useState({});

  const getProfileDataApi = async (source) => {
    try {
      setUserData({});
      setIsProfileUpdating(true);
      const response = await getAPIHandler({
        endPoint: "getProfile",
        source: source,
      });
      if (response.data.responseCode === 200) {
        setUserData(response.data.result);
        setIsProfileUpdating(false);
      }
      setIsProfileUpdating(false);
    } catch (error) {
      setIsProfileUpdating(false);
    }
  };

  const isWalletConnected = async () => {
    try {
      const solana = window.solana;
      if (solana) {
        if (solana.isPhantom) {
          const response = await solana.connect({ onlyIfTrusted: false });
          setWalletAddress(response.publicKey.toString());
          setWallet(response);
        } else {
          toast.error("Please install phantom wallet!");
        }
      } else {
        toast.error("Please install phantom wallet!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBalance = async (walletAddress) => {
    try {
      const connection = new Connection(RPC, "confirmed");
      const balance = await connection.getBalance(new PublicKey(walletAddress));
      const balanceInSOL = balance / Math.pow(10, 9);
      setBalance(balanceInSOL);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      const solana = window.solana;
      if (solana) {
        await solana.disconnect();
        setWalletAddress("");
        setWallet();
        toast.success("Disconnect successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchBalance(walletAddress);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (endTime) {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft(endTime));
      }, 1000);
      return () => clearTimeout(timer);
    }
  });
  useEffect(() => {
    const source = axios.CancelToken.source();
    if (window.sessionStorage.getItem("token")) {
      // getProfileDataApi(source);
    }
    return () => {
      source.cancel();
    };
  }, [window.sessionStorage.getItem("token")]);
  let data = {
    userLoggedIn: isLogin,
    userData,
    isProfileUpdating,
    isLoading,
    timeLeft,
    isDashboardUpdating,
    dashboardData,
    solbalance,
    setWalletAddress,
    setWallet,
    walletAddress,
    wallet,
    handleDisconnect: handleDisconnect,
    isWalletConnected: isWalletConnected,
    setIsDashboardUpdating,
    setIsProfileUpdating,
    setEndtime,
    setDashboardData,
    userLogIn: (type, data) => {
      console.log(type, data, "data");
      setUserData(data)
      setIsLogin(type);
      setSession(data);
    },
    // getProfileDataApi: (data) => getProfileDataApi(data),
  };

  return (
    <AuthContext.Provider value={data}>{props.children}</AuthContext.Provider>
  );
}
