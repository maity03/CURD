import Todo from "../models/curdModels.js";

//Getting all tasks
export const getTodo = async (req, res) => {
  try {
    const todo = await Todo.find();
    res.status(200).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//creating a task
export const createTodo = async (req, res) => {
  try {
    const { task, status } = req.body;
    const todo = await Todo.create({ task, status });
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Update a todo
export const updateTodo = async (req, res) => {
  try {
    const { task, status } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { task, status },
      { new: true, runValidators: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo updated", todo: updatedTodo });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
