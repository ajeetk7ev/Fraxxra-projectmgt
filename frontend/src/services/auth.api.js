import api from "./api";
import { handleApiError } from "./apiUtils";

const authApi = {
  register: async (userData) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  login: async (credentials) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getMe: async () => {
    try {
      const { data } = await api.get("/auth/me");
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

};

export default authApi;
