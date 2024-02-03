import { Router } from "express";
import { AuthController } from "../controllers/auth.js";

export const createAuthRouter = ({ authModel }) => {
  const authRouter = Router()
  const authController = new AuthController({ authModel })

  authRouter.post('/login', authController.login)

  return authRouter
}