import { Router } from "express";

import {
  createNewAccount,
  getAllCustomers,
  loginUser,
  logoutUser,
  sendOTP,
  verifyOTP,
  resetPassword,
} from "../controllers/auth.controllers.js";
import {
  createNewAccountValidation,
  loginValidation,
} from "../validations/auth.validations.js";

const router = Router();

router.post(
  "/create-new-account",
  createNewAccountValidation,
  createNewAccount
);

router.post("/login", loginValidation, loginUser);
router.post("/logout", logoutUser);

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

router.get("/all/customers", getAllCustomers);

export default router;
