import React, { useState, useEffect } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "../services/api";

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await getTasks();
      setTasks(data.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const openModal = (task = null) => {
    setIsModalOpen(true);
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(
        task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
      );
    } else {
      resetForm();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setStatus("To Do");
    setPriority("Medium");
    setDueDate("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, description, status, priority, dueDate };
    console.log("Submitting task data:", taskData);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      } else {
        await addTask(taskData);
      }
      closeModal();
      fetchTasks();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        fetchTasks();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#ffcdd2"; // Light Red
      case "Medium":
        return "#fff9c4"; // Light Yellow
      case "Low":
        return "#c8e6c9"; // Light Green
      default:
        return "#f5f5f5"; // Grey
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>My Tasks</h2>
        <button
          onClick={() => openModal()}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Add New Task
        </button>
      </div>

      {/* Task List */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {tasks.map((task) => (
          <div
            key={task._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "15px",
              backgroundColor: getPriorityColor(task.priority),
            }}
          >
            <h3 style={{ marginTop: 0 }}>{task.title}</h3>
            <p>{task.description}</p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <p>
              <strong>Priority:</strong> {task.priority}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "Not set"}
            </p>
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => openModal(task)}
                style={{ marginRight: "10px" }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(task._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit Task */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>{editingTask ? "Edit Task" : "Add Task"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ ...inputStyle, height: "80px" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={inputStyle}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={inputStyle}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{ marginRight: "10px" }}
                >
                  Cancel
                </button>
                <button type="submit">
                  {editingTask ? "Update Task" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContentStyle = {
  background: "white",
  padding: "20px 40px",
  borderRadius: "5px",
  width: "400px",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  boxSizing: "border-box",
};

export default UserDashboard;
