import api from "./api";
import { handleApiError } from "./apiUtils";

const projectApi = {
  createProject: async (projectData) => {
    try {
      const { data } = await api.post("/projects", projectData);
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getAllProjects: async (params = {}) => {
    try {
      const { data } = await api.get("/projects", { params });
      return { success: true, data: data.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getProjectById: async (projectId) => {
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      return { success: true, data: data.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateProject: async (projectId, updateData) => {
    try {
      const { data } = await api.patch(`/projects/${projectId}`, updateData);
      return { success: true, data: data.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteProject: async (projectId) => {
    try {
      const { data } = await api.delete(`/projects/${projectId}`);
      return { success: true, data: data.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default projectApi;
