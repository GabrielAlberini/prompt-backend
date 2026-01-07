// middleware/auth.js
import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "Token de autenticación requerido"
      })
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Token mal formado"
      })
    }

    const token = authHeader.split(" ")[1]

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Adjuntar info del usuario al request
    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Token inválido o expirado"
    })
  }
}

export { authMiddleware }
