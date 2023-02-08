import axios from "axios"

export const axiosInstance = axios.create({
  
    baseURL : process.env.baseURL+"/api/" || "http://localhost:5000/api/"
})