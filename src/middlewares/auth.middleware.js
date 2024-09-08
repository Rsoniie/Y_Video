import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
// import { JsonWebTokenError } from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req, res, next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token)
        {
            throw new ApiError(401, "Unauthorized Error")
        }
    
        const decodedToken =  jwt.verify(token, process.env.ACESS_TOKEN_SECRET)
        const user = await User.findbyId(decodedToken?._id).select("-password -refreshToken")
    
        if(!user)
        {
            throw new ApiError(401, "Invalid Acess Token")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid accessToken")
    }

})