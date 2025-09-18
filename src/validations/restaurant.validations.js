// src/validators/restaurant.validation.ts
import { check } from "express-validator";

export const createRestaurantValidation = [
  check("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  check("address")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters long"),
  check("city")
    .trim()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("City must only contain letters")
    .isLength({ min: 2 })
    .withMessage("City must be at least 2 characters long"),
  check("state")
    .trim()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("State must only contain letters")
    .isLength({ min: 2 })
    .withMessage("State must be at least 2 characters long"),
];

export const editRestaurantValidation = [
  check("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  check("address")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters long"),
  check("city")
    .optional()
    .trim()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("City must only contain letters")
    .isLength({ min: 2 })
    .withMessage("City must be at least 2 characters long"),
  check("state")
    .optional()
    .trim()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("State must only contain letters")
    .isLength({ min: 2 })
    .withMessage("State must be at least 2 characters long"),
];
