import { asyncHandler } from "../utils/asyncHandler.js";
import { matchedData, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Restaurant } from "../models/Restaurant.model.js";

export const checkOwnership = (originalOwner, requestingUser) => {
  if (originalOwner.toString() !== requestingUser.toString()) {
    return false;
  }

  return true;
};

const createRestaurant = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ApiError(400, "Validation errors", errors.array()));
  }

  let image;

  if (req.file) {
    console.log(req.file);

    const result = await uploadOnCloudinary(req.file.path);
    image = result.secure_url;
    console.log(`uploaded image data`, result);
  }

  const { name, address, city, state } = matchedData(req);

  const newRestaurant = await Restaurant.create({
    name,
    image,
    address,
    city,
    state,
    owner: req.user._id,
  });

  await newRestaurant.populate("owner");

  res
    .status(201)
    .json(
      new ApiResponse(201, newRestaurant, "Restaurant created successfully")
    );
});

const editRestaurant = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, "Validation errors", errors.array()));
  }

  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return next(new ApiError(404, "Restaurant not found"));
  }

  if (!checkOwnership(restaurant.owner, req.user._id)) {
    return next(new ApiError(403, "Unauthorized to edit this restaurant"));
  }

  let image = restaurant.image;

  if (req.file) {
    const uploaded = await uploadOnCloudinary(req.file.path);
    if (uploaded?.secure_url) {
      const oldImage = restaurant.image;
      image = uploaded.secure_url;
      if (oldImage) {
        await deleteFromCloudinary(oldImage);
      }
    }
  }

  const data = matchedData(req);
  const updateFields = { ...data, image };

  console.log("update fields", updateFields);

  restaurant.set(updateFields);
  await restaurant.save();
  await restaurant.populate("owner");

  res
    .status(200)
    .json(new ApiResponse(200, restaurant, "Restaurant updated successfully"));
});

const getRestaurantDetails = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findOne({ owner: req.user._id }).populate(
    "owner"
  );

  res.status(200).json(new ApiResponse(200, restaurant, "Restaurant found"));
});

export { createRestaurant, editRestaurant, getRestaurantDetails };
