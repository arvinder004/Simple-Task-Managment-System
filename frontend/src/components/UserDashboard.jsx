import React, { useState, useEffect } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "../services/api";


// Helper function to map priority to Tailwind classes
const getPriorityClasses = (priority) => {
    switch (priority) {
        case "High":
            return {
                bg: "bg-red-50",
                border: "border-red-500",
                chip: "bg-red-500",
                text: "text-red-500",
            };
        case "Medium":
            return {
                bg: "bg-amber-50",
                border: "border-amber-500",
                chip: "bg-amber-500",
                text: "text-amber-500",
            };
        case "Low":
            return {
                bg: "bg-emerald-50",
                border: "border-emerald-500",
                chip: "bg-emerald-500",
                text: "text-emerald-500",
            };
        default:
            return {
                bg: "bg-gray-50",
                border: "border-gray-400",
                chip: "bg-gray-500",
                text: "text-gray-500",
            };
    }
};

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    try {
      const { data } = await getTasks();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
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
      // Ensure date conversion handles null/undefined
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
    // IMPORTANT: Replacing window.confirm() with a custom modal is best practice in iframed environments.
    // For now, retaining a simple check, but note that window.confirm is not ideal.
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        fetchTasks();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center text-xl font-semibold text-indigo-600">
        Loading Tasks...
      </div>
    );
  }

  return (
    <div className="p-5 max-w-7xl mx-auto">
      {/* 1. Header and Add Button */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-3xl font-extrabold text-indigo-700 m-0">My Tasks</h2>
        <button
          onClick={() => openModal()}
          // Tailwind equivalent of successColor (#10B981) and hover effect
          className="px-5 py-2 text-base bg-emerald-500 text-white font-semibold rounded-lg shadow-md
                     hover:bg-emerald-600 transition duration-200 transform hover:-translate-y-0.5"
        >
          + Add New Task
        </button>
      </div>

      {/* 2. Task List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tasks.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-lg py-12">
            You haven't added any tasks yet. Click "Add New Task" to get started!
          </p>
        ) : (
          tasks.map((task) => {
            const priorityClasses = getPriorityClasses(task.priority);
            return (
              <div
                key={task._id}
                className={`border rounded-xl p-5 shadow-sm transition-all duration-300 transform 
                            hover:scale-[1.01] hover:shadow-xl cursor-default
                            ${priorityClasses.bg} ${priorityClasses.border}`}
              >
                <div className={`text-xl font-bold ${priorityClasses.text} mb-2`}>
                    {task.title}
                </div>
                
                {/* Priority Chip */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider mb-3 ${priorityClasses.chip}`}>
                    {task.priority}
                </span>

                {/* Description */}
                <p className="text-sm italic text-gray-700 mb-4 h-14 overflow-hidden line-clamp-3">
                    {task.description}
                </p>
                
                {/* Status and Due Date */}
                <div className="flex justify-between items-start pt-3 mb-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        <strong className="font-bold mr-1">Status:</strong> {task.status}
                    </div>
                    <div className="text-sm text-gray-600">
                        <strong className="font-bold mr-1">Due:</strong>{" "}
                        {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "Not set"}
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => openModal(task)}
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm mr-2
                               hover:bg-indigo-700 transition duration-200"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(task._id)}
                    // Tailwind equivalent of accentColor (#DB2777)
                    className="px-4 py-2 bg-pink-600 text-white font-medium rounded-lg text-sm
                               hover:bg-pink-700 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Modal for Add/Edit Task */}
      {isModalOpen && (
        // Modal Overlay (Fixed position, dark backdrop)
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-10 animate-fade-in">
          {/* Modal Content */}
          <div className="bg-white p-8 rounded-xl w-11/12 max-w-xl shadow-2xl animate-slide-in">
            <h2 className="text-xl font-semibold text-indigo-600 mb-5 pb-3 border-b border-gray-200">
              {editingTask ? "Edit Task" : "Add Task"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
                />
              </div>
              
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
                />
              </div>
              
              {/* Status and Priority (Side-by-side in a flex container) */}
              <div className="flex gap-4 mb-4">
                <div className="w-1/2">
                    <label className="block font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                </div>
                <div className="w-1/2">
                    <label className="block font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
                />
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg text-sm mr-3
                             hover:bg-gray-300 transition duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg text-sm
                             hover:bg-emerald-600 transition duration-200"
                >
                  {editingTask ? "Update Task" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Required keyframes for animations used in modal (faked for React in a single file) */}
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
        .line-clamp-3 { 
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
