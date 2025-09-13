import { check } from "express-validator";

export const createNewAccountValidation = [
  check("fullname")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Fullname must be at least 3 characters long"),
  check("email").trim().isEmail().withMessage("Invalid email address"),
  check("password")
    .trim()
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  check("mobile")
    .trim()
    .isMobilePhone("en-IN")
    .withMessage("Invalid mobile number"),
  check("role")
    .trim()
    .isIn(["user", "owner", "deliveryBoy"])
    .withMessage("Invalid role"),
];
