// apiService.js

import axios from 'axios';
import ApiConfig from '../ApiConfig/ApiConfig';  // Correct the import path as needed

// ✅ Base API URL from environment variable
const API_BASE_URL = ApiConfig.baseurl;  // This is the base URL

// ✅ Auth Headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');  // Retrieving token from localStorage
    return {
        'Content-Type': 'application/json',  // Setting content-type to JSON
        ...(token && { 'Authorization': `Bearer ${token}` }),  // Including token in Authorization header if it exists
    };
};

// ✅ Generic GET Request
export const getData = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
            headers: getAuthHeaders(),
            params,  // Including query params if any
        });
        console.log("GET Response:", response.data);
        return response.data;  // Returning response data from the API
    } catch (error) {
        console.error("GET Error:", error.response || error);
        throw error;  // Throwing error in case of failure
    }
};

// ✅ Generic POST Request
export const postData = async (endpoint, data = {}) => {
    try {
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
            headers: getAuthHeaders(),  // Sending auth headers with POST request
        });
        console.log("POST Response:", response.data);
        return response.data;  // Returning response data from the API
    } catch (error) {
        console.error("POST Error:", error.response || error);
        throw error;  // Throwing error in case of failure
    }
};

// ✅ Generic PUT Request
export const putData = async (endpoint, data = {}) => {
    try {
        const response = await axios.put(`${API_BASE_URL}${endpoint}`, data, {
            headers: getAuthHeaders(),  // Sending auth headers with PUT request
        });
        console.log("PUT Response:", response.data);
        return response.data;  // Returning response data from the API
    } catch (error) {
        console.error("PUT Error:", error.response || error);
        throw error;  // Throwing error in case of failure
    }
};

// ✅ Generic DELETE Request
export const deleteData = async (endpoint, params = {}) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}${endpoint}`, {
            headers: getAuthHeaders(),
            params,  // Including query params if any
        });
        console.log("DELETE Response:", response.data);
        return response.data;  // Returning response data from the API
    } catch (error) {
        console.error("DELETE Error:", error.response || error);
        throw error;  // Throwing error in case of failure
    }
};
