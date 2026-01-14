// validators/authValidator.js
import { body, validationResult } from "express-validator"

// Validador para actualización de perfil
export const updateProfileValidator = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("El username debe tener entre 3 y 30 caracteres")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("El username solo puede contener letras, números y guiones bajos"),

  body("currentPassword")
    .optional()
    .notEmpty()
    .withMessage("La contraseña actual no puede estar vacía"),

  body("newPassword")
    .optional()
    .isLength({ min: 8 })
    .withMessage("La nueva contraseña debe tener al menos 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("La contraseña debe contener al menos una mayúscula, una minúscula y un número")
]

// Middleware para manejar errores de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Errores de validación",
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    })
  }
  next()
}
