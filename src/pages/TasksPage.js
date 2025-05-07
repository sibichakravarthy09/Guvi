import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { TaskContext } from "../context/TaskContext";
import "../styles/Tasks.css";

const Tasks = () => {
  const { tasks, createTask, editTask, removeTask } = useContext(TaskContext);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState(null);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "pending",
    assignedTo: "",
  });
  const [leads, setLeads] = useState([]);

  // Fetch leads on component mount
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/leads");
        setLeads(res.data);
      } catch (err) {
        console.error("Failed to fetch leads", err);
      }
    };
    fetchLeads();
  }, []);

  const handleOpenModal = (task = null) => {
    setError(null);
    setEditingTask(task);
    setTaskData(task ? task : {
      title: "",
      description: "",
      status: "pending",
      assignedTo: "",
    });
    setShowModal(true);
  };

  const handleSaveTask = async () => {
    if (!taskData.title.trim() || !taskData.description.trim()) {
      setError("Title and Description are required.");
      return;
    }

    try {
      if (editingTask) {
        await editTask(editingTask._id, taskData);
      } else {
        await createTask(taskData);
      }
      setShowModal(false);
    } catch (err) {
      setError("Error saving task. Please try again.");
    }
  };

  return (
    <div className="task-container">
      <h1>Tasks</h1>
      <button className="add-btn" onClick={() => handleOpenModal()}>+ Add Task</button>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <div>
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <span className={`status ${task.status.toLowerCase()}`}>{task.status}</span>
              {task.assignedTo && <p>Assigned To: {task.assignedTo}</p>}
            </div>
            <div className="task-actions">
              <button className="edit-btn" onClick={() => handleOpenModal(task)}>✏️</button>
              <button className="delete-btn" onClick={() => removeTask(task._id)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingTask ? "Edit Task" : "Add Task"}</h2>
            {error && <p className="error-msg">{error}</p>}
            <input
              type="text"
              placeholder="Title"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            />
            <select
              value={taskData.status}
              onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={taskData.assignedTo}
              onChange={(e) => setTaskData({ ...taskData, assignedTo: e.target.value })}
            >
              <option value="">Assign to Lead</option>
              {leads.map((lead) => (
                <option key={lead._id} value={lead.name}>
                  {lead.name}
                </option>
              ))}
            </select>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="save-btn" onClick={handleSaveTask}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
