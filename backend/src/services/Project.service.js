import { Project } from "../models/Project.model.js";
import { ApiError } from "../utils/ApiError.js";

class ProjectService {
    static async createProject({ projectName, description, userId }) {
        if (!projectName || !description) {
            throw new ApiError(400, "Project name and description are required");
        }

        const project = await Project.create({
            projectName,
            description,
            createdBy: userId
        });

        return project;
    }

    static async getAllProjects(userId, page = 1, limit = 10, search = "") {
        const skip = (page - 1) * limit;
        const query = { createdBy: userId };

        if (search) {
            query.projectName = { $regex: search, $options: "i" };
        }
        
        const [projects, total] = await Promise.all([
            Project.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Project.countDocuments(query)
        ]);

        return {
            projects,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    static async getProjectById(projectId, userId) {
        const project = await Project.findOne({ _id: projectId, createdBy: userId });
        if (!project) {
            throw new ApiError(404, "Project not found");
        }
        return project;
    }

    static async updateProject(projectId, userId, updateData) {
        const project = await Project.findOneAndUpdate(
            { _id: projectId, createdBy: userId },
            { $set: updateData },
            { new: true }
        );

        if (!project) {
            throw new ApiError(404, "Project not found or unauthorized");
        }

        return project;
    }

    static async deleteProject(projectId, userId) {
        const project = await Project.findOneAndDelete({ _id: projectId, createdBy: userId });

        if (!project) {
            throw new ApiError(404, "Project not found or unauthorized");
        }

        return project;
    }
}

export default ProjectService;
