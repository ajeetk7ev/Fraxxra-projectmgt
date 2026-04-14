import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            index: true
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        status: {
            type: String,
            enum: ["todo", "in-progress", "completed"],
            default: "todo"
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },
        dueDate: {
            type: Date,
            required: [true, "Due date is required"],
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Task = mongoose.model("Task", taskSchema);
