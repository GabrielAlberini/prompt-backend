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

const updateProfile = async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body
    const userId = req.user.id

    // Buscar usuario actual
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado"
      })
    }

    // Si se quiere cambiar la contraseña, validar la contraseña actual
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          error: "La contraseña actual es requerida para cambiar la contraseña"
        })
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: "La contraseña actual es incorrecta"
        })
      }
    }

    // Si se quiere cambiar el username, verificar que no esté en uso
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: "El username ya está en uso"
        })
      }
    }

    // Actualizar campos
    const updateData = {}
    if (username && username !== user.username) {
      updateData.username = username
    }
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    // Si no hay nada que actualizar
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No hay cambios para actualizar"
      })
    }

    // Actualizar usuario
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    // Si se cambió el username, generar nuevo token
    let newToken = null
    if (updateData.username) {
      newToken = jwt.sign(
        { id: updatedUser._id, username: updatedUser.username, email: updatedUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      )
    }

    return res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email
      },
      ...(newToken && { token: newToken })
    })
  } catch (error) {
    console.error("Error en /updateProfile:", error)
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    })
  }
}

const refreshToken = async (req, res) => {
  try {
    const userId = req.user.id

    // Buscar usuario actual para obtener información actualizada
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado"
      })
    }

    // Generar nuevo token con información actualizada del usuario
    const newToken = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    )

    return res.status(200).json({
      success: true,
      message: "Token refrescado correctamente",
      token: newToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error("Error en /refreshToken:", error)
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    })
  }
}

export { login, register, updateProfile, refreshToken }
