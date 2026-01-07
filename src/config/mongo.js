import mongoose from "mongoose"

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.URI_DB)
    console.log("✅ Conectado a MongoDB con éxito")
  } catch (error) {
    console.log("❌ Error al conectarse a MongoDB", error.message)
  }
}

const getDbStatus = () => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  }

  return {
    state: mongoose.connection.readyState,
    status: states[mongoose.connection.readyState]
  }
}

export { connectDb, getDbStatus }
