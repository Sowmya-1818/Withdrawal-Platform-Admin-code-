import axios from "axios";
import { ENV_CONSTANTS } from "./../Constants";
import EncryptionUtil from "./EncryptionUtils";

// admin APIs
export const adminApiHandlerWithoutToken = async (method, url, requestBody = {}, controller) => {

  try {
    const baseURL = `${ENV_CONSTANTS.API_SERVER_URL}${url}`;
    const data = {
      method,
      url: baseURL,
      data: requestBody,
      cancelToken: new axios.CancelToken((cancel) => {
        controller.signal.addEventListener('abort', () => {
          cancel('Request canceled by component unmount.');
        });
      })
    };
    return axios(data)
      .then((response) => response)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  } catch (error) {
    return error;
  }
};

// export const adminApiHandler = async (method, url, requestBody = {}, controller) => {
//   var AdminToken = EncryptionUtil.decryptionAES(localStorage.getItem('adminToken'));
//   try {
//     const baseURL = `${ENV_CONSTANTS.API_SERVER_URL}${url}`;
//     const data = {
//       method,
//       url: baseURL,
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: `Bearer ${AdminToken}`,
//       },
//       data: requestBody,
//       cancelToken: new axios.CancelToken((cancel) => {
//         controller.signal.addEventListener('abort', () => {
//           cancel('Request canceled by component unmount.');
//         });
//       })
//     };
//     return axios(data)
//       .then((response) => response)
//       .then((response) => {
//         return response;
//       })
//       .catch((error) => {
//         // if (error.response.status === 401) {
//         //   AdminRefreshTokenApi();
//         // }
//         return error;
//       });
//   } catch (error) {
//     return error;
//   }
// };




export const adminApiHandler = async (method, url, requestBody = {}, controller) => {
  const AdminToken = EncryptionUtil.decryptionAES(localStorage.getItem("adminToken"));

  try {
    const baseURL = `${ENV_CONSTANTS.API_SERVER_URL}${url}`;
    console.log(baseURL, "baseURL");
    
    
    const config = {
      method,
      url: baseURL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${AdminToken}`,
      },
      data: requestBody,
      signal: controller?.signal, // Use `signal` from AbortController
    };

    const response = await axios(config);
    return response;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.warn("Request canceled:", error.message);
    } else {
      console.error("API call error:", error);
    }
    return error;
  }
};

export const adminApiHandlerWithFile = async (method, url, requestBody = {}, controller) => {
  var AdminToken = EncryptionUtil.decryptionAES(localStorage.getItem('adminToken'));
  try {
    const baseURL = `${ENV_CONSTANTS.API_SERVER_URL}${url}`;
    const data = {
      method,
      url: baseURL,
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${AdminToken}`,
      },
      data: requestBody,
      cancelToken: new axios.CancelToken((cancel) => {
        controller.signal.addEventListener('abort', () => {
          cancel('Request canceled by component unmount.');
        });
      })
    };
    return axios(data)
      .then((response) => response)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        // if (error.response.status === 401) {
        //   AdminRefreshTokenApi();
        // }
        return error;
      });
  } catch (error) {
    return error;
  }
};


export const adminDownloadApiHandler = async (method, url, requestBody = {}, controller) => {
  var AdminToken = EncryptionUtil.decryptionAES(localStorage.getItem('adminToken'));
  try {
    const baseURL = `${ENV_CONSTANTS.API_SERVER_URL}${url}`;
    const data = {
      method,
      url: baseURL,
      responseType: "blob",
      headers: {
        'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        Authorization: `Bearer ${AdminToken}`,
      },
      data: requestBody,
      cancelToken: new axios.CancelToken((cancel) => {
        controller.signal.addEventListener('abort', () => {
          cancel('Request canceled by component unmount.');
        });
      })
    };
    return axios(data)
      .then((response) => response)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        // if (error.response.status === 401) {
        //   AdminRefreshTokenApi();
        // }
        return error;
      });
  } catch (error) {
    return error;
  }
};