import api from "./api";
import { handleApiError } from "./apiUtils";

const taskApi = {
  addTask: async (projectId, taskData) => {
    try {
      const { data } = await api.post(`/tasks/project/${projectId}`, taskData);
      return { success: true, data: data.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  getProjectTasks: async (projectId, params = {}) => {
    try {
      const { data } = await api.get(`/tasks/project/${projectId}`, { params });
      return { success: true, data: data.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateTask: async (taskId, updateData) => {
    try {
      const { data } = await api.patch(`/tasks/${taskId}`, updateData);
      return { success: true, data: data.data };
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteTask: async (taskId) => {
    try {
      const { data } = await api.delete(`/tasks/${taskId}`);
      return { success: true, data: data.data };
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default taskApi;
