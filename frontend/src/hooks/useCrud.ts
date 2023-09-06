import { useState } from "react";
import useAxiosInstance from "../helper/useAxiosInstance";
import { BASE_URL } from "../helper/config";

interface IuseCrud<T> {
  data: T[];
  fetchData: () => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export const useCrud = <T>(initData: T[], apiUrl: String): IuseCrud<T> => {
  const axiosInstance = useAxiosInstance();
  const [data, setData] = useState<T[]>(initData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<T[]>(`${BASE_URL}${apiUrl}`, {});
      const data = response.data;
      setData(data);
      setError(null);
      setLoading(false);
      return data;
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setError(new Error("400"));
      }
      setLoading(false);
      throw error;
    }
  };
  return { data, fetchData, loading, error };
};
