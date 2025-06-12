import mongoose, { Types } from "mongoose";

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
  },
});
const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
