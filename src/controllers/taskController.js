// controllers/tasksController.js
import { Types } from "mongoose"
import { Task } from "../models/tasks.model.js"

const getAllTasks = async (req, res) => {
  try {
    // Solo traer tareas del usuario logueado
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json({ success: true, data: tasks })
  } catch (e) {
    res.status(500).json({ success: false, error: e.message })
  }
}

const getTask = async (req, res) => {
  try {
    const { id } = req.params

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "ID inválido"
      })
    }

    // Buscar tarea del usuario logueado
    const foundTask = await Task.findOne({ _id: id, userId: req.user.id })

    if (!foundTask) {
      return res.status(404).json({ success: false, error: "Tarea no encontrada" })
    }

    res.json({ success: true, data: foundTask })
  } catch (e) {
    res.status(500).json({ success: false, error: e.message })
  }
}

const addNewTask = async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ success: false, error: "Error en la petición, data invalida" })
    }

    // Asociar tarea al usuario logueado
    const newTask = new Task({ text, userId: req.user.id })
    const savedTask = await newTask.save()
    res.status(201).json({ success: true, data: savedTask })
  } catch (e) {
    res.status(500).json({ success: false, error: e.message })
  }
}

const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const { done } = req.body

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "ID inválido"
      })
    }

    if (done === undefined || typeof done !== "boolean") {
      return res.status(400).json({ success: false, error: "Error, done debe ser booleano" })
    }

    // Actualizar solo si la tarea pertenece al usuario
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { done },
      { new: true }
    )

    if (!updatedTask) {
      return res.status(404).json({ success: false, error: "Tarea no encontrada o no autorizada" })
    }

    res.json({ success: true, data: updatedTask })
  } catch (e) {
    res.status(500).json({ success: false, error: e.message })
  }
}

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "ID inválido"
      })
    }

    // Eliminar solo si la tarea pertenece al usuario
    const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user.id })

    if (!deletedTask) {
      return res.status(404).json({ success: false, error: "Tarea no encontrada o no autorizada" })
    }

    res.json({ success: true, data: { id: deletedTask._id } })
  } catch (e) {
    res.status(500).json({ success: false, error: e.message })
  }
}

export { getAllTasks, getTask, addNewTask, updateTask, deleteTask }