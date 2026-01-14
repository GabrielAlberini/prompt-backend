import { Router } from "express"
import { login, register, updateProfile, refreshToken } from "../controllers/authController.js"
import { authMiddleware } from "../middleware/auth.js"
import { updateProfileValidator, handleValidationErrors } from "../validators/authValidator.js"

const authRouter = Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/refresh", authMiddleware, refreshToken)
authRouter.patch("/profile", authMiddleware, updateProfileValidator, handleValidationErrors, updateProfile)

export { authRouter }