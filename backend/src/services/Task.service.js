import { Task } from "../models/Task.model.js";
import { Project } from "../models/Project.model.js";
import { ApiError } from "../utils/ApiError.js";

class TaskService {
    static async addTask(taskData, userId) {
        // Verify project belongs to user
        const project = await Project.findOne({ _id: taskData.projectId, createdBy: userId });
        if (!project) {
            throw new ApiError(404, "Project not found or unauthorized");
        }

        const task = await Task.create(taskData);
        return task;
    }

    static async getProjectTasks(projectId, userId, { page = 1, limit = 10, status, priority, search }) {
        // Verify project belongs to user
        const project = await Project.findOne({ _id: projectId, createdBy: userId });
        if (!project) {
            throw new ApiError(404, "Project not found or unauthorized");
        }

        const query = { projectId };

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        const skip = (page - 1) * limit;

        const tasks = await Task.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalTasks = await Task.countDocuments(query);

        return {
            tasks,
            pagination: {
                total: totalTasks,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalTasks / limit)
            }
        };
    }

    static async updateTask(taskId, userId, updateData) {
        // Find task and populate project to check ownership
        const task = await Task.findById(taskId).populate("projectId");
        
        if (!task || task.projectId.createdBy.toString() !== userId.toString()) {
            throw new ApiError(404, "Task not found or unauthorized");
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $set: updateData },
            { new: true }
        );

        return updatedTask;
    }

    static async deleteTask(taskId, userId) {
        const task = await Task.findById(taskId).populate("projectId");
        
        if (!task || task.projectId.createdBy.toString() !== userId.toString()) {
            throw new ApiError(404, "Task not found or unauthorized");
        }

        await Task.findByIdAndDelete(taskId);
        return { message: "Task deleted successfully" };
    }
}

export default TaskService;
