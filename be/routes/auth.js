import { Router } from "express";
import {
    login,
    register,
    requestPasswordReset,
    resetPassword,
    getCurrentUser,
} from "../controllers/auth";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post(`/register`, register);
router.post(`/login`, login);
router.post(`/request-password-reset`, requestPasswordReset);
router.post(`/reset-password`, resetPassword);
router.get(`/current-user`, authMiddleware, getCurrentUser);

export default router;
