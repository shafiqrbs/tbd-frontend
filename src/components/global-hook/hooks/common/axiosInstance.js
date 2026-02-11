import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Api-Key": import.meta.env.VITE_API_KEY,
    },
});

export default axiosInstance;
