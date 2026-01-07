// controllers/authController.js
import bcrypt from "bcryptjs"
import { User } from "../models/auth.model.js"
import jwt from "jsonwebtoken"

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Validar campos requeridos
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Todos los campos son obligatorios"
      })
    }

    // Verificar si ya existe el usuario
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "El usuario o correo ya está registrado"
      })
    }

    const hash = await bcrypt.hash(password, 10)

    const newUser = new User({ username, email, password: hash })
    await newUser.save()

    return res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      user: {
        id: newUser._id,
        email: newUser.email
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email y contraseña son obligatorios"
      })
    }

    // Buscar usuario por email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Credenciales inválidas"
      })
    }

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Credenciales inválidas"
      })
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    return res.status(200).json({
      success: true,
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error("Error en /login:", error)
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    })
  }
}

export { login, register }
