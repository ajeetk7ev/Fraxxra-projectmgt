import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../config/logger.js";

class AuthService {
    static async register({ name, email, password }) {
        const existedUser = await User.findOne({ email });

        if (existedUser) {
            throw new ApiError(409, "User with email already exists");
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        const createdUser = await User.findById(user._id).select("-password");

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user");
        }

        return createdUser;
    }

    static async login({ email, password }) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(404, "User does not exist");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials");
        }

        const accessToken = user.generateAccessToken();

        const loggedInUser = await User.findById(user._id).select("-password");

        return { user: loggedInUser, accessToken };
    }

    static async googleAuth({ name, email, googleId, avatar }) {
        let user = await User.findOne({ email });

        if (user) {
            // Update googleId if not present (incase user registered with email first)
            if (!user.googleId) {
                user.googleId = googleId;
                if (avatar) user.avatar = avatar;
                await user.save();
            }
        } else {
            user = await User.create({
                name,
                email,
                googleId,
                avatar
            });
        }

        const accessToken = user.generateAccessToken();
        const loggedInUser = await User.findById(user._id).select("-password");

        return { user: loggedInUser, accessToken };
    }
}

export default AuthService;
