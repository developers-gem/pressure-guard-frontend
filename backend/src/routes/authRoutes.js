import { Router } from "express";
import { register, login, me,deleteUser } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.delete("/delete-user", deleteUser);


export default router;
