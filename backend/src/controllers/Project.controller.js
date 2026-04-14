import ProjectService from "../services/Project.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class ProjectController {
    static createProject = asyncHandler(async (req, res) => {
        const project = await ProjectService.createProject({
            ...req.body,
            userId: req.user._id
        });
        return res
            .status(201)
            .json(new ApiResponse(201, project, "Project created successfully"));
    });

    static getAllProjects = asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        
        const data = await ProjectService.getAllProjects(req.user._id, page, limit, search);
        return res
            .status(200)
            .json(new ApiResponse(200, data, "Projects fetched successfully"));
    });

    static getProjectById = asyncHandler(async (req, res) => {
        const project = await ProjectService.getProjectById(req.params.projectId, req.user._id);
        return res
            .status(200)
            .json(new ApiResponse(200, project, "Project fetched successfully"));
    });

    static updateProject = asyncHandler(async (req, res) => {
        const project = await ProjectService.updateProject(
            req.params.projectId,
            req.user._id,
            req.body
        );
        return res
            .status(200)
            .json(new ApiResponse(200, project, "Project updated successfully"));
    });

    static deleteProject = asyncHandler(async (req, res) => {
        await ProjectService.deleteProject(req.params.projectId, req.user._id);
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Project deleted successfully"));
    });
}

export default ProjectController;
