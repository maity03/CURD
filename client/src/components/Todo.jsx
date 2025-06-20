import React, { useState, useEffect } from "react";
import axios from "axios";

const URL = "http://localhost:5000";

const Todo = () => {
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ task: "", status: "" });

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${URL}/api/todo`);
      setTodos(res.data.reverse());
    } catch (error) {
      console.error("Failed to fetch todos:", error.message);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!task || !status) {
      alert("Please enter task and status");
      return;
    }
    try {
      await axios.post(`${URL}/api/todo`, { task, status });
      setTask("");
      setStatus("");
      fetchTodos();
    } catch (error) {
      alert("Error: " + error.response?.data?.error || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL}/api/todo/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Failed to delete todo:", error.message);
    }
  };

  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditData({ task: todo.task, status: todo.status });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${URL}/api/todo/${id}`, editData);
      setEditId(null);
      setEditData({ task: "", status: "" });
      fetchTodos();
    } catch (error) {
      console.error("Failed to update todo:", error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 mt-10">
      <h2 className="text-xl font-bold text-center">Todo List</h2>

      <div className="space-y-2">
        <label className="label">Task</label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Enter task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <label className="label">Status</label>
        <select
          className="select select-bordered w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="" disabled>
            Select status
          </option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="ongoing">Ongoing</option>
        </select>
        <button onClick={handleAddTodo} className="btn btn-primary w-full">
          Add Todo
        </button>
      </div>

      <h2 className="text-l font-semibold text-center">All Todos</h2>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo._id} className="flex flex-col bg-base-200 p-2 rounded">
            {editId === todo._id ? (
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  className="input input-bordered mb-1 w-full max-w-xs"
                  value={editData.task}
                  onChange={(e) =>
                    setEditData({ ...editData, task: e.target.value })
                  }
                />
                <select
                  className="select select-bordered mb-1 w-full max-w-xs"
                  value={editData.status}
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="ongoing">Ongoing</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(todo._id)}
                    className="btn btn-sm btn-success"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="btn btn-sm btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{todo.task}</p>
                  <p className="text-sm">Status: {todo.status}</p>
                </div>
                <div className="flex flex-row gap-1">
                  <button
                    onClick={() => startEdit(todo)}
                    className="btn btn-sm btn-warning"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
