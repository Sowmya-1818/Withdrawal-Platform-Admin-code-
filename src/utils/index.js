import { getAPIHandler, getAPIHandlerspin } from "src/ApiConfig/service";
import * as XLSX from "xlsx";
import { PublicKey } from "@solana/web3.js";

export function sortAddress(add) {
  const sortAdd = `${add.slice(0, 6)}...${add.slice(add.length - 4)}`;
  return sortAdd;
}
export function replacetext(text, replaceTo, replaceWith) {
  // Replace '-' with ' ' and split the string into words
  const words = text
    .split(replaceTo)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  // Join the words with space
  return words.join(replaceWith);
}
export const calculateTimeLeft = (endDate) => {
  if (endDate) {
    let difference = +new Date(endDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  } else {
    return false;
  }
};

export const getFolderListDataApi = async (
  source,
  page,
  folderType,
  search
) => {
  try {
    const response = await getAPIHandler({
      endPoint: "listFolder",
      source: source,
      paramsData: {
        folderType: folderType,
        // page: page,
        // limit: "10",
        // sort: "ALPHA",
        // search: search,
      },
    });
    if (response.data.responseCode === 200) {
      return response.data.result;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const getBase64 = (file, cb) => {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    cb(reader.result);
  };
  reader.onerror = function (err) {
    console.log("Error: ", err);
  };
};

export function generateRandomName() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const nameLength = Math.floor(Math.random() * (8 - 5 + 1)) + 3;
  let randomName = "";

  for (let i = 0; i < nameLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const character = characters.charAt(randomIndex);

    if (i === 0) {
      randomName += character.toUpperCase();
    } else {
      randomName += character;
    }
  }

  return randomName;
}

export const downloadExcel = (dataToPrint, sheetName) => {
  const workSheet = XLSX.utils.json_to_sheet(dataToPrint);
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, sheetName);
  let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
  XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
  XLSX.writeFile(workBook, `${sheetName}.xlsx`);
};

export const listUserHandlerExcel = async ({ paramsData, endPoint }) => {
  console.log(paramsData, "paramsData");
   const tokendata = window.sessionStorage.getItem("spintoken");
  try {
    const res = await getAPIHandlerspin({
      endPoint: endPoint,
      tokenDATA: tokendata,
      paramsData: {
        page: 1,
        ...paramsData,
        
      },
    });
    console.log(res, "reslistdata");
    const flattenObject = (obj, parentKey = "", result = {}) => {
      for (let key in obj) {
        const newKey = parentKey ? `${key}` : key; // Create a unique key
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          flattenObject(obj[key], newKey, result); // Recursively flatten
        } else {
          result[newKey] = obj[key]; // Assign value directly
        }
      }
      return result;
    };
    if (res.data.responseCode === 200) {
      return res.data.result.docs.map(item => flattenObject(item));
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};


export const validateAccountAddress = async (account) => {
  try {
    new PublicKey(account);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};


export const handleNegativeValue = (event) => {
  const {
    key,
    target: { value, selectionStart },
  } = event;
  const newValue =
    value.slice(0, selectionStart) + value.slice(selectionStart + 1);
  const parsedValue = parseFloat(newValue);
  if (
    ["ArrowUp", "ArrowDown", "-"].includes(key) &&
    (isNaN(parsedValue) || parsedValue < 0)
  ) {
    event.preventDefault();
  }
};
