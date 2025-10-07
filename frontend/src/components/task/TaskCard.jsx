import React from 'react';
import { useTasks } from '../../context/TaskContext';

const PRIORITY_COLORS = {
  high: 'bg-red-100 border-red-500 text-red-800',
  medium: 'bg-yellow-100 border-yellow-500 text-yellow-800',
  low: 'bg-green-100 border-green-500 text-green-800',
};

const STATUS_COLORS = {
  pending: 'bg-blue-600',
  complete: 'bg-green-600',
};

const TaskCard = ({ task }) => {
  const priorityClass = PRIORITY_COLORS[task.priority.toLowerCase()] || 'bg-gray-100 border-gray-400';
  const statusClass = STATUS_COLORS[task.status.toLowerCase()] || 'bg-gray-500';

  const dueDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      }) 
    : 'N/A';

    const {updateTask} = useTasks()

    const handleStatusUpdate = async (newStatus) => {
    try {
      await updateTask(task._id, { status: newStatus });
    } catch (error) {
      alert(`Error updating status: ${error}`);
    }
  };

  const isPending = task.status.toLowerCase() === 'pending';

  return (
    <div className={`p-4 border-l-4 shadow-md rounded-lg mb-4 transition duration-300 ease-in-out ${priorityClass}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold mb-1 truncate">{task.title}</h3>
        
        <span 
          className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${statusClass}`}
        >
          {task.status.toUpperCase()}
        </span>
      </div>

      <p className="text-sm mb-2 text-gray-600 font-medium">Due Date: {dueDate}</p>
      
      <span className={`text-xs font-bold px-2 py-0.5 rounded ${priorityClass.split(' ')[0]} ${priorityClass.split(' ')[2]} border`}>
        {task.priority.toUpperCase()}
      </span>
      
<p className="text-sm italic my-3 text-gray-700 line-clamp-2">{task.description}</p> 

      <div className="flex justify-between items-center border-t pt-3">
        {/* Status Update Button */}
        {isPending ? (
          <button 
            onClick={() => handleStatusUpdate('complete')} 
            className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Mark Complete
          </button>
        ) : (
          <span className="text-sm text-green-700 font-semibold">Completed!</span>
        )}

        <div className="flex space-x-2">
            <button 
            onClick={() => onEditClick(task)} // <-- Open modal with this task
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
            Edit
            </button>
            
            <button 
            onClick={() => console.log('Delete feature coming in Step 7')} 
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
            Delete
            </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;