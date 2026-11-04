import { authAxios } from "../utils/AxiosCustomize";

export const register = async (userData) => {
  const response = await authAxios.post("/api/auth/register", userData);
  return response.data;
};

export const loginWithCredentials = async (username, password) => {
  const response = await authAxios.post("/api/auth/login", {
    username,
    password,
  });
  return response.data;
};

export const verifyEmail = async (email, otp) => {
  const response = await authAxios.post("/api/auth/verify-email", {
    email,
    otp,
  });
  return response.data;
};

export const resendOtp = async (email) => {
  const response = await authAxios.post("/api/auth/resend-otp", { email });
  return response.data;
};
