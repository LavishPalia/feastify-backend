import { matchedData, validationResult } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Item } from "../models/Item.model.js";
import { Restaurant } from "../models/Restaurant.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { checkOwnership } from "./restaurant.controllers.js";

const addItem = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ApiError(400, "Validation errors", errors.array()));
  }

  const { name, price, description, category, type } = matchedData(req);

  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return next(new ApiError(404, "Restaurant not found"));
  }

  if (!checkOwnership(restaurant.owner, req.user._id)) {
    return next(new ApiError(403, "Unauthorized to add item"));
  }

  let image;
  if (req.file) {
    const result = await uploadOnCloudinary(req.file.path);
    image = result.secure_url;
  }

  const item = await Item.create({
    name,
    price,
    description,
    type,
    category,
    image,
    restaurant: restaurant._id,
  });

  await item.populate("restaurant");

  return res
    .status(201)
    .json(new ApiResponse(201, item, "Item created successfully"));
});

const editItem = asyncHandler(async (req, res, next) => {
  const { restaurantId, itemId } = req.params;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ApiError(400, "Validation errors", errors.array()));
  }

  const { name, price, description, category, type } = matchedData(req);

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    return next(new ApiError(404, "Restaurant not found"));
  }

  if (!checkOwnership(restaurant.owner, req.user._id)) {
    return next(new ApiError(403, "Unauthorized to edit item"));
  }

  const item = await Item.findById(itemId);

  if (!item) {
    return next(new ApiError(404, "Item not found"));
  }

  let image = item.image;

  if (req.file) {
    const uploaded = await uploadOnCloudinary(req.file.path);

    console.log(`uploaded image data`, uploaded);

    if (uploaded?.secure_url) {
      const oldImage = item.image;
      image = uploaded.secure_url;

      if (oldImage) {
        await deleteFromCloudinary(oldImage);
      }
    }
  }

  item.set({ name, price, description, type, category, image });
  await item.save();
  await item.populate("restaurant");

  return res
    .status(200)
    .json(new ApiResponse(200, item, "Item updated successfully"));
});

export { addItem, editItem };
