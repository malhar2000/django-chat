import { AuthServiceProp } from "../@types/auth-service";
import axios from "axios";

export const useAuthService = (): AuthServiceProp => {
  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:8000/api/token/", {
        username,
        password,
      });
      console.log(response);
    } catch (error) {
      return error;
    }
  };
  return { login };
};
