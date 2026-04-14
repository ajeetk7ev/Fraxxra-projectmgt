import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config/env.js";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowecase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        //optional:I thought to add file integration as well with multer and cloudinay
        avatar: {
            type: String, // cloudinary url
            default: ""
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function () {
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function(password){
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name
        },
        config.JWT_SECRET,
        {
            expiresIn: config.JWT_EXPIRE
        }
    );
};

export const User = mongoose.model("User", userSchema);
