// El router analiza método y ruta y luego ejecuta su controlador

import { Router } from "express"
import { getAllTasks, getTask, addNewTask, updateTask, deleteTask } from "../controllers/taskController.js"

const taskRouter = Router()

// http://localhost:1111/providers ❌
// http://localhost:1111/tasks ✅

taskRouter.get("/", getAllTasks)
taskRouter.get("/:id", getTask)
taskRouter.post("/", addNewTask)
taskRouter.patch("/:id", updateTask)
taskRouter.delete("/:id", deleteTask)

export { taskRouter }