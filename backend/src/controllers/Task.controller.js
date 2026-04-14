import TaskService from "../services/Task.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class TaskController {
    static addTask = asyncHandler(async (req, res) => {
        const task = await TaskService.addTask(
            { ...req.body, projectId: req.params.projectId },
            req.user._id
        );
        return res
            .status(201)
            .json(new ApiResponse(201, task, "Task added successfully"));
    });

    static getProjectTasks = asyncHandler(async (req, res) => {
        const { page, limit, status, priority, search } = req.query;
        const result = await TaskService.getProjectTasks(
            req.params.projectId,
            req.user._id,
            { page, limit, status, priority, search }
        );
        return res
            .status(200)
            .json(new ApiResponse(200, result, "Tasks fetched successfully"));
    });

    static updateTask = asyncHandler(async (req, res) => {
        const task = await TaskService.updateTask(
            req.params.taskId,
            req.user._id,
            req.body
        );
        return res
            .status(200)
            .json(new ApiResponse(200, task, "Task updated successfully"));
    });

    static deleteTask = asyncHandler(async (req, res) => {
        const result = await TaskService.deleteTask(req.params.taskId, req.user._id);
        return res
            .status(200)
            .json(new ApiResponse(200, {}, result.message));
    });
}

export default TaskController;
