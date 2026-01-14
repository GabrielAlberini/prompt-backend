import { Router } from "express"
import { login, register, updateProfile, refreshToken } from "../controllers/authController.js"
import { authMiddleware } from "../middleware/auth.js"
import { updateProfileValidator, handleValidationErrors } from "../validators/authValidator.js"

const authRouter = Router()

authRouter.post("/register", register)
authRouter.post("/login", login)

authRouter.patch("/profile", authMiddleware, updateProfileValidator, handleValidationErrors, updateProfile)
authRouter.post("/refresh", authMiddleware, refreshToken)

export { authRouter }