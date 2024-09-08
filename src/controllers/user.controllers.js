import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { response } from "express";

const generateAcessandRefreshToken = async (userId) => {
  try {
    const user = User.findById(userId);
    const acessToken = user.generateAccessToken();
    const refreshToken = user.genrateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { acessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

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

  const { fullname, email, username, password } = req.body;
  console.log(fullname, email);

  if (
    [fullname, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User Already Existed");
  }

  const avatarlocalPath = req.files?.avatar[0]?.path;
  const coverImagelocalPath = req.files?.coverImage[0]?.path;
  if (!avatarlocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarlocalPath);
  //  console.log(avatar);
  const coverImage = await uploadOnCloudinary(coverImagelocalPath);
  console.log(coverImage);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    fullname,
    password,
    email,
    avatar: avatar.url,
    coverimage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Sucessfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // Getting info of data req -> body
  // Checking for username or password is true or not
  // find the user
  // password check
  // Acess Token and refresh token
  // send cookie

  const { email, password, username } = req.body;

  if (!email || !username) {
    throw new ApiError(400, "username and email is needed");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User doesn't Exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }
  const {accessToken, refreshToken} = await generateAcessandRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  // Sending in Cookies....

  const options = {
    httpOnly: true,
    secure: true
  }


  return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(200, 
    {
      user: loggedInUser, accessToken, refreshToken
    },
    "User logged in Successfully"
    )
  )
});

const logoutUser = asyncHandler(async(req, res) => {
 await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }


  return res.status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(
    new ApiResponse(200, {}, "User loggedOut Successfully")
  )

})

export { registerUser,
  loginUser,
  logoutUser
 };
