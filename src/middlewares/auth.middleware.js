import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"
// import { JsonWebTokenError } from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req, res, next) => {

    try {
 
        console.log("Getting into try of verifyJWT");
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token)
        {
            throw new ApiError(401, "Unauthorized Error")
        }
        // console.log("Token is present from middleware");
        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        // console.log(decodedToken, "decoded from middlewares");
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