import { Router } from "express";

import {
  createRestaurant,
  editRestaurant,
  getRestaurantDetails,
} from "../controllers/restaurant.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createRestaurantValidation,
  editRestaurantValidation,
} from "../validations/restaurant.validations.js";
const router = Router();

router.post(
  "/create",
  verifyToken,
  upload.single("image"),
  createRestaurantValidation,
  createRestaurant
);
router.put(
  "/edit/:id",
  verifyToken,
  upload.single("image"),
  editRestaurantValidation,
  editRestaurant
);
router.get("/details", verifyToken, getRestaurantDetails);

export default router;
