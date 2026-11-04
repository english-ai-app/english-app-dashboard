import axios from "axios";

const API_URL = "http://localhost:5000";
const AUTH_API_URL =
  process.env.REACT_APP_AUTH_API_URL || "http://localhost:8082";
export const AUTH_STORAGE_KEY = "englishAppAuth";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || API_URL,
});
export const authAxios = axios.create({ baseURL: AUTH_API_URL });

const attachAuthInterceptors = (client) => {
  client.interceptors.request.use(
    (config) => {
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) {
        const { accessToken } = JSON.parse(storedAuth);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error.response?.data || error)
  );
};

attachAuthInterceptors(axiosInstance);
attachAuthInterceptors(authAxios);

export default axiosInstance;
