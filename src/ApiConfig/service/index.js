import axios from "axios";
import ApiConfig from "../ApiConfig";
import CryptoJS from "crypto-js";



// const encryptSecretKey = (key) => {

//   const encrypted = CryptoJS.AES.encrypt(key, key).toString();

//   return encrypted;
// };

const secretKey = process.env.REACT_APP_SECRET_KEY;

const drivesecrekekey = process.env.REACT_APP_SECRET_KEY_Drive;

const tetrisSecretKey = process.env.REACT_APP_SECRET_KEY_Tetris;

console.log(secretKey, "secretKey");
console.log(drivesecrekekey, "drivesecrekekey");
console.log(tetrisSecretKey, "tetrisSecretKey");

export const encryptSecretKey = (key, timestamp) => {
  const payloadToEncrypt = `${key}&TimeStamp=${timestamp}`;

  console.log(payloadToEncrypt, "payloadToEncrypt");

  const encrypted = CryptoJS.AES.encrypt(payloadToEncrypt, key).toString();

  console.log("encrypted", encrypted);
  return encrypted;
};

export const postAPIHandler = async ({ endPoint, dataToSend, paramsData, tokenDATA, secret_key }) => {
  console.log(endPoint, dataToSend, paramsData, tokenDATA, "endPoint, dataToSend, paramsData");
  // const currentTime = new Date().getTime()
  try {
    return await axios({
      method: "POST",
      url: ApiConfig[endPoint],
      headers: {
        token: tokenDATA,
        // clientid: encryptSecretKey(secret_key,currentTime)
      },

      data: dataToSend ? dataToSend : null,
      params: paramsData ? paramsData : null,
    });
  } catch (error) {
    console.log(error);
    return error.response;
  }
};



export const postAPIHandlermain = async ({ endPoint, dataToSend, paramsData, tokenDATA }) => {
  console.log(endPoint, dataToSend, paramsData, tokenDATA, "endPoint, dataToSend, paramsData");

  try {
    return await axios({
      method: "POST",
      url: ApiConfig[endPoint],
      headers: {
        token: tokenDATA
      },
      data: dataToSend ? dataToSend : null,
      params: paramsData ? paramsData : null,
    });
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export const postAPIHandlerspin = async ({ endPoint, dataToSend, paramsData, tokenDATA }) => {
  console.log(endPoint, dataToSend, paramsData, "endPoint, dataToSend, paramsData");

  try {
    return await axios({
      method: "POST",
      url: ApiConfig[endPoint],
      headers: {
        Authorization: tokenDATA,
      },
      data: dataToSend ? dataToSend : null,
      params: paramsData ? paramsData : null,
    });
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

// export const postAPIHandlercarrace = async ({ endPoint, dataToSend, paramsData , tokenDATA}) => {
//   console.log(endPoint, dataToSend, paramsData, "endPoint, dataToSend, paramsData");

//   try {
//     return await axios({
//       method: "POST",
//       url: ApiConfig[endPoint],
//       headers: {
//         Authorization: tokenDATA,
//       },
//       data: dataToSend ? dataToSend : null,
//       params: paramsData ? paramsData : null,
//     });
//   } catch (error) {
//     console.log(error);
//     return error.response;
//   }
// };

export const postAPIHandlercarrace = async ({ endPoint, dataToSend, paramsData, tokenDATA }) => {
  console.log("Sending request to:", endPoint);
  console.log("With token:", tokenDATA); // Debugging Authorization token
  console.log("Payload:", dataToSend); // Debugging request data
  // const currentTime = new Date().getTime()

  try {
    const response = await axios({
      method: "POST",
      url: ApiConfig[endPoint],
      headers: {
        Authorization: `Bearer ${tokenDATA}`,
        // clientid: encryptSecretKey(process.env.REACT_APP_SECRET_KEY_Drive,currentTime)
      },
      data: dataToSend ? dataToSend : null,
      params: paramsData ? paramsData : null,
    });

    return response; // Successful response
  } catch (error) {
    console.error("Error:", error.response);  // Debugging error response
    return error.response;
  }
};

export const postAPIHandlerstring = async ({ endPoint, dataToSend, paramsData, tokenDATA }) => {
  console.log(endPoint, dataToSend, paramsData, "endPoint, dataToSend, paramsData");

  try {
    return await axios({
      method: "POST",
      url: ApiConfig[endPoint],
      headers: {
        Authorization: tokenDATA,
      },
      data: dataToSend ? dataToSend : null,
      params: paramsData ? paramsData : null,
    });
  } catch (error) {
    console.log(error);
    return error.response;
  }
};
export const postAPIHandlertetris = async ({ endPoint, dataToSend, paramsData, tokenDATA }) => {
  console.log(endPoint, dataToSend, paramsData, "endPoint, dataToSend, paramsData");
  const currentTime = new Date().getTime();
  try {
    return await axios({
      method: "POST",
      url: ApiConfig[endPoint],
      headers: {
        Authorization: `Bearer ${tokenDATA}`,
        clientid: encryptSecretKey(tetrisSecretKey, currentTime)
      },
      data: dataToSend ? dataToSend : null,
      params: paramsData ? paramsData : null,
    });
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export const putAPIHandler = async ({ endPoint, dataToSend, paramsData, secret_key }) => {
  console.log(endPoint, dataToSend, paramsData, "endPoint, dataToSend, paramsData");
  const currentTime = new Date().getTime()
  try {
    return await axios({
      method: "PUT",
      url: ApiConfig[endPoint],
      headers: {
        token: window.sessionStorage.getItem("token"),
        clientid: encryptSecretKey(secret_key, currentTime)
      },
      data: dataToSend ? dataToSend : null,
      params: paramsData ? paramsData : null,
    });
  } catch (error) {
    console.log(error);
    return error.response;
  }
};
export const deleteAPIHandler = async ({
  endPoint,
  dataToSend,
  paramsData,
}) => {
  const currentTime = new Date().getTime()
  try {
    return await axios({
      method: "DELETE",
      url: ApiConfig[endPoint],
      headers: {
        token: window.sessionStorage.getItem("token"),
        clientid: encryptSecretKey(process.env.REACT_APP_SECRET_KEY, currentTime)
      },
      data: dataToSend ? dataToSend : null,
      params: paramsData ? paramsData : null,
    });
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export const getAPIHandler = async ({ endPoint, id, source, paramsData, tokenDATA, secret_key }) => {
  console.log(ApiConfig[endPoint], endPoint, id, source, paramsData, tokenDATA, "something");
  const currentTime = new Date().getTime()
  try {
    return await axios({
      method: "GET",
      url: id ? `${ApiConfig[endPoint]}/${id}` : ApiConfig[endPoint],
      params: paramsData ? paramsData : null,

      headers: {
        token: tokenDATA,
        // window.sessionStorage.getItem("token"),
        // clientid: encryptSecretKey(secret_key,currentTime)
      },
      cancelToken: source ? source.token : null,
    });
  } catch (error) {
    console.log(error, 'getting error');
  }
};



export const getAPIHandlerspin = async ({ endPoint, id, source, paramsData, tokenDATA }) => {
  console.log(endPoint, id, tokenDATA, "endPoint, id, tokenDATA ");

  try {
    return await axios({
      method: "GET",
      url: id ? `${ApiConfig[endPoint]}/${id}` : ApiConfig[endPoint],
      params: paramsData ? paramsData : null,
      headers: {
        Authorization: tokenDATA,
        // window.sessionStorage.getItem("token"),
      },
      cancelToken: source ? source.token : null,
    });
  } catch (error) {
    console.log(error);
  }
};

// export const getAPIHandlercarrace = async ({ endPoint, id, source, paramsData, tokenDATA  }) => {

//   try {
//     return await axios({
//       method: "GET",
//       url: id ? `${ApiConfig[endPoint]}/${id}` : ApiConfig[endPoint],
//       params: paramsData ? paramsData : null,
//       headers: {
//         Authorization: tokenDATA,
//         // window.sessionStorage.getItem("token"),
//       },
//       cancelToken: source ? source.token : null,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };


// export const getAPIHandler = async ({ endPoint, id, source, paramsData }) => {
//   // console.log("🌐 [getAPIHandler] Invoked with params:");
//   // console.log("🔹 endPoint:", endPoint);
//   // console.log("🔹 id:", id);
//   // console.log("🔹 source:", source);
//   // console.log("🔹 paramsData:", paramsData);

//   try {
//     const finalUrl = id
//       ? `${ApiConfig[endPoint]}/${id}`
//       : ApiConfig[endPoint];

//     // console.log("Final constructed URL:", finalUrl);

//     const token = window.sessionStorage.getItem("token");
//     console.log("Token from sessionStorage:", token);

//     const response = await axios({
//       method: "GET",
//       url: finalUrl,
//       params: paramsData || null,
//       headers: {
//         token: token,
//       },
//       cancelToken: source ? source.token : null,
//     });

//     console.log("[getAPIHandler] Response received:", response);
//     return response;
//   } catch (error) {
//     console.error("[getAPIHandler] Error during API call:", error);
//     throw error; // optional: so it can be handled upstream
//   }
// };


export const getAPIHandlercarrace = async ({ endPoint, id, source, paramsData, tokenDATA }) => {
  const currentTime = new Date().getTime()
  console.log("endPoint getAPIHandlercarrace", endPoint);
  console.log("id getAPIHandlercarrace", id);
  console.log("source getAPIHandlercarrace", source);
  console.log("paramsData getAPIHandlercarrace", paramsData);
  console.log("tokenDATA getAPIHandlercarrace", tokenDATA);

  try {
    // Ensure token is provided
    if (!tokenDATA) {
      throw new Error("Authorization token is missing");
    }

    // Construct the URL with the endpoint and optional ID
    const url = id ? `${ApiConfig[endPoint]}/${id}` : ApiConfig[endPoint];

    console.log("Constructed URL in getAPIHandlercarrace:", url);

    // Make the GET request using axios
    const response = await axios({
      method: "GET",
      url: url,
      params: paramsData || null,  // Use paramsData if provided, else send null
      headers: {
        Authorization: `Bearer ${tokenDATA}`, // Ensure the Authorization header is formatted correctly
         clientid: encryptSecretKey(process.env.REACT_APP_SECRET_KEY_Drive,currentTime)
      },
      cancelToken: source ? source.token : null,  // Use the cancel token if provided
    });

    // Check if the response is valid
    console.log(response, "responsecarhandler");

    if (response.status === 200) {
      return response;
    } else {
      // Handle unexpected response status
      throw new Error(`Unexpected response status: ${response.status}`);
    }

  } catch (error) {
    // Enhanced error handling: Check for axios error types
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error("API Error Response:", error.response.data);
      console.error("Error Status:", error.response.status);
    } else if (error.request) {
      // Request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // General error
      console.error("Error Message:", error.message);
    }
    throw error;  // Rethrow the error after logging it for further handling
  }
};



export const getAPIHandlertetris = async ({ endPoint, id, source, paramsData, tokenDATA }) => {
  console.log(endPoint, id, source, paramsData, tokenDATA,"endPoint, id, source, paramsData");
  console.log( tokenDATA,"tokenDATA");
  const currentTime = new Date().getTime();
  try {
    let config = {
      method: "GET",
      url: id ? `${ApiConfig[endPoint]}/${id}` : ApiConfig[endPoint],
      headers: {
         Authorization: `Bearer ${tokenDATA}`,
        clientid: encryptSecretKey(tetrisSecretKey, currentTime)
      },
      params: paramsData ? paramsData : null,
    };
    if (source) {
      config.cancelToken = source.token;
    }
    return await axios(config);
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export const patchAPIHandler = async ({ endPoint, dataToSend, paramsData }) => {
  const currentTime = new Date().getTime()

  try {
    return await axios({
      method: "PATCH",
      url: ApiConfig[endPoint],
      headers: {
        token: window.sessionStorage.getItem("token"),
        clientid: encryptSecretKey(process.env.REACT_APP_SECRET_KEY, currentTime)
      },
      data: dataToSend ? dataToSend : null,
      params: paramsData ? paramsData : null,
    });
  } catch (error) {
    console.log(error);
    return error.response;
  }
};
