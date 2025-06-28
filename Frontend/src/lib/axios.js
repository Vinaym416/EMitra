import axios from "axios";


export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api", // Backend URL
  withCredentials: true, // Send cookies with requests
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token in requests
  },
});

