import axios, { AxiosResponse } from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 100000000,
});

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;

    if (res && typeof res === "object" && "data" in res) {
      // ← spread semua field, tidak perlu tambah manual kalau ada field baru
      response.data = { ...res };
    } else {
      response.data = {
        data: res,
        success: true,
      };
    }

    return response;
  },
  (error) => {
    const message =
      error?.response?.data?.message || error.message || "Terjadi kesalahan";

    return Promise.reject(new Error(message));
  },
);

export default axiosClient;
