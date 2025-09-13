import { Router } from "express";

import {
  createNewAccount,
  getAllCustomers,
} from "../controllers/auth.controllers.js";
import { createNewAccountValidation } from "../validations/auth.validations.js";

const router = Router();

router.post(
  "/create-new-account",
  createNewAccountValidation,
  createNewAccount
);

router.get("/all/customers", getAllCustomers);

export default router;
