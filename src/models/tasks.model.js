// definir contrato en tanto backend con base de datos

import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true, },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  done: { type: Boolean, default: false }
},
  {
    versionKey: false,
    timestamps: true
  }
);

taskSchema.index({ userId: 1 });

const Task = mongoose.model('Task', taskSchema);

export { Task }