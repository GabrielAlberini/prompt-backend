// punto de entrada
// archivo que ejecuta servicios

import express from "express"
import { connectDb, getDbStatus } from "./config/mongo.js"
import { taskRouter } from "./routes/taskRouter.js"
import { authRouter } from "./routes/authRouter.js"
import { authMiddleware } from "./middleware/auth.js"
import { logger } from "./middleware/logger.js"
import { limiter } from "./middleware/limiter.js"
import cors from "cors"
import morgan from "morgan"
import { config } from "dotenv"
config()

const PORT = process.env.PORT

const server = express()
server.use(cors())
server.use(express.json())

server.use(morgan(logger))

server.get("/", (req, res) => {
  const db = getDbStatus()

  if (db.state === 1) {
    return res.status(200).json({
      success: true,
      message: "API Tasks funcionando correctamente",
      database: db.status
    })
  }

  return res.status(503).json({
    success: false,
    message: "API disponible pero la base de datos no está conectada",
    database: db.status
  })
})

server.use("/auth", limiter, authRouter)
server.use("/tasks", authMiddleware, taskRouter)

server.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Ruta no encontrada",
      path: req.originalUrl,
      method: req.method
    }
  })
})

server.listen(PORT, () => {
  console.log("✅ Conectado al puerto http://localhost:1111")
  connectDb()
})