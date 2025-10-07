import React, {useState} from 'react';
import { TaskProvider, useTasks } from '../../context/TaskContext';
import TaskCard from '../../components/task/TaskCard';
import Pagination from '../../components/task/Pagination';
import TaskFormModal from './TaskFormModal';

const TaskDashboardContent = () => {
  const { tasks, loading, error, pagination, setPage } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null); 

  const handleOpenCreate = () => {
    setTaskToEdit(null); 
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);

  
  if (loading) return <div className="text-center text-lg mt-10 p-4">Loading tasks...</div>;
  if (error) return <div className="text-center text-lg mt-10 p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">
        My Tasks 📝
      </h1>
      
      <div className="flex justify-end mb-8">
        <button 
          onClick={handleOpenCreate} // <-- Open Create Modal
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 font-medium shadow-md"
        >
          + Create New Task
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="text-center p-10 bg-gray-100 rounded-xl border border-dashed border-gray-300">
          <p className="text-xl text-gray-600">You have no tasks assigned yet. Get started by creating one! 🎉</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tasks.map(task => (
            <TaskCard key={task._id} task={task} onEditClick={handleOpenEdit} /> 
          ))}
        </div>
      )}

      <Pagination pagination={pagination} setPage={setPage} />

      {isModalOpen && (
        <TaskFormModal 
          taskToEdit={taskToEdit} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};
}

const DashboardPage = () => (
  <TaskProvider>
    <TaskDashboardContent />
  </TaskProvider>
);

export default TaskDashboardContent;