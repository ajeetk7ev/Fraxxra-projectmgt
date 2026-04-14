import AuthService from "../services/Auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import config from "../config/env.js";

class AuthController {
    static register = asyncHandler(async (req, res) => {
        const user = await AuthService.register(req.body);
        return res
            .status(201)
            .json(new ApiResponse(201, user, "User registered successfully"));
    });

    static login = asyncHandler(async (req, res) => {
        const { user, accessToken } = await AuthService.login(req.body);

        const options = {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            maxAge: config.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json(
                new ApiResponse(
                    200,
                    { user, accessToken },
                    "User logged in successfully"
                )
            );
    });

    static logout = asyncHandler(async (req, res) => {
        const options = {
            httpOnly: true,
            secure: config.NODE_ENV === "production"
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .json(new ApiResponse(200, {}, "User logged out successfully"));
    });

    static getCurrentUser = asyncHandler(async (req, res) => {
        return res
            .status(200)
            .json(new ApiResponse(200, req.user, "User fetched successfully"));
    });
}

export default AuthController;
