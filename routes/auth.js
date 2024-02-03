import { Router } from "express";
import { AuthController } from "../controllers/auth.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

export const createAuthRouter = ({ authModel }) => {
  const authRouter = Router()
  const authController = new AuthController({ authModel })

  authRouter.post('/login', authController.login)
  authRouter.get('/login', verifyToken, authController.getUserInfo)

  return authRouter
}