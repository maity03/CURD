import React, { useState, useEffect } from "react";
const URL = "http://localhost:5000";

const Todo = () => {
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("");
  const [deadline, setDeadline] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    task: "",
    status: "",
    deadline: "",
  });

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${URL}/api/todo`);
      const data = await res.json();
      setTodos(data.reverse()); // Show latest first
    } catch (error) {
      console.error("Failed to fetch todos:", error);
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
      const res = await fetch(`${URL}/api/todo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, status, deadline }),
      });
      if (res.ok) {
        setTask("");
        setStatus("");
        setDeadline("");
        fetchTodos();
      } else {
        const errorData = await res.json();
        alert("Error: " + errorData.error);
      }
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${URL}/api/todo/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditData({
      task: todo.task,
      status: todo.status,
      deadline: todo.deadline?.split("T")[0] || "",
    });
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`${URL}/api/todo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        setEditId(null);
        setEditData({ task: "", status: "", deadline: "" });
        fetchTodos();
      }
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 mt-20">
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
        <label className="label">Deadline</label>
        <input
          type="date"
          className="input input-bordered w-full"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
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
                <input
                  type="date"
                  className="input input-bordered mb-2 w-full max-w-xs"
                  value={editData.deadline}
                  onChange={(e) =>
                    setEditData({ ...editData, deadline: e.target.value })
                  }
                />
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
                  <p className="text-sm">
                    Deadline:{" "}
                    {todo.deadline
                      ? new Date(todo.deadline).toLocaleDateString()
                      : "None"}
                  </p>
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
