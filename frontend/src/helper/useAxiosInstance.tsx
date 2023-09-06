import axios, { AxiosInstance } from "axios";
import { BASE_URL } from "./config";
import { useNavigate } from "react-router-dom";

// const API_URL = `${BASE_URL}/api`;

const useAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
  });
  const navigate = useNavigate();

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 403) {
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

export default useAxiosInstance;
