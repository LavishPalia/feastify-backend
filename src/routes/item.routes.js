import { Router } from "express";

import { addItem, editItem } from "../controllers/item.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.post(
  "/create/:restaurantId",
  verifyToken,
  upload.single("image"),
  addItem
);
router.post(
  "/edit/:restaurantId/:itemId",
  verifyToken,
  upload.single("image"),
  editItem
);

export default router;
