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

const getAllCustomers = asyncHandler(async (req, res, next) => {
  const users = await User.find({ role: "user" });

  return res
    .status(200)
    .json(new ApiResponse(200, users, "customer fetched successfully"));
});

export { createNewAccount, getAllCustomers };
