import { Router } from "express";

import { getCurrentUser } from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/current", verifyToken, getCurrentUser);

export default router;
