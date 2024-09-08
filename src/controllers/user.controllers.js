import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { response } from "express";




const registerUser = asyncHandler(async (req, res) => {
    
  // User details from frontend..
  // Validation...
  // Check if user exists or not 
  // Check for images and avatar..
  // Upload them to clodinary..
  // Verification of avatar upload in clodinary
  // create user object -create entry in db
  // remove password and refresh tokens field from response
  // Check for user creation..
  // return response or throw error


  const {fullname, email, username, password} = req.body;
  console.log(fullname, email);

    if([fullname, email, password, username].some((field) => field?.trim() === ""))
    {
      throw new ApiError(400, "All fields are required");
    }

   const existedUser =  await User.findOne({
      $or: [{username}, {email}]
    })

    if(existedUser)
    {
      throw new ApiError(409, "User Already Existed");
    }

    const avatarlocalPath = req.files?.avatar[0]?.path;
    const coverImagelocalPath = req.files?.coverImage[0]?.path;
    if(!avatarlocalPath)
    {
      throw new ApiError(400, "Avatar file is required");
    }

   
   const avatar = await uploadOnCloudinary(avatarlocalPath);
  //  console.log(avatar);
   const coverImage = await uploadOnCloudinary(coverImagelocalPath);
   console.log(coverImage)

   if(!avatar)
   {
    throw new ApiError(400, "Avatar file is required");
   }

  const user =  await User.create({
    username: username.toLowerCase(),
    fullname,
    password,
    email,
    avatar: avatar.url,
    coverimage: coverImage?.url || ""
   })


   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" 
   )

   if(!createdUser)
   {
    throw new ApiError(500, "Something went wrong while registering the user")
   }

   return res.status(201).json(
    new ApiResponse(200, createdUser, "User Registered Sucessfully")
   )
 
})

 
export {registerUser} 