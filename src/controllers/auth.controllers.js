import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js";
import { validationResult, matchedData } from "express-validator";

const createNewAccount = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ApiError(400, "Validation errors", errors.array()));
  }

  const { fullname, email, password, mobile, role } = matchedData(req);
  const existingUser = await User.findOne({ email }).lean();

  if (existingUser) {
    return next(new ApiError(400, "Email is already in use"));
  }

  const newUser = await User.create({
    fullname,
    email,
    password,
    mobile,
    role,
  });

  const accessToken = await newUser.generateAccessToken();

  const userResponse = {
    _id: newUser._id,
    fullname: newUser.fullname,
    email: newUser.email,
    mobile: newUser.mobile,
    role: newUser.role,
  };

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { user: userResponse, accessToken },
        "User created successfully"
      )
    );
});

const loginUser = asyncHandler(async (req, res, next) => {
  console.log(req.body);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ApiError(400, "Validation errors", errors.array()));
  }

  const { email, password } = matchedData(req);

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return next(new ApiError(404, "User not found. Please create an account"));
  }

  const isPasswordMatch = await existingUser.comparePassword(password);

  console.log(isPasswordMatch);

  if (!isPasswordMatch) {
    return next(new ApiError(400, "Invalid Credentials"));
  }
  const accessToken = await existingUser.generateAccessToken();

  const userResponse = {
    _id: existingUser._id,
    fullname: existingUser.fullname,
    email: existingUser.email,
    mobile: existingUser.mobile,
    role: existingUser.role,
  };

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: userResponse, accessToken },
        "User login successfull"
      )
    );
});

const logoutUser = asyncHandler(async (req, res, next) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  };

  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out Successfully..."));
});

const getAllCustomers = asyncHandler(async (req, res, next) => {
  const users = await User.find({ role: "user" });

  return res
    .status(200)
    .json(new ApiResponse(200, users, "customer fetched successfully"));
});

export { createNewAccount, loginUser, logoutUser, getAllCustomers };
