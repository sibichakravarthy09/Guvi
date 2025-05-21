import { useContext, useEffect, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import "../styles/Tasks.css";
import api from "../services/api";

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

  // Fetch leads for assignment options on component mount
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get("/leads"); // Adjust endpoint as needed
        setLeads(res.data);
      } catch (err) {
        console.error("Failed to fetch leads", err);
      }
    };
    fetchLeads();
  }, []);

  // Open modal for new task or editing existing task
  const handleOpenModal = (task = null) => {
    setError(null);
    setEditingTask(task);
    setTaskData(
      task
        ? {
            title: task.title || "",
            description: task.description || "",
            status: task.status || "pending",
            assignedTo: task.assignedTo || "",
          }
        : {
            title: "",
            description: "",
            status: "pending",
            assignedTo: "",
          }
    );
    setShowModal(true);
  };

  // Validate and save task (create or edit)
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
      <button className="add-btn" onClick={() => handleOpenModal()}>
        + Add Task
      </button>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <div>
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <span className={`status ${task.status.toLowerCase()}`}>
                {task.status}
              </span>
              {task.assignedTo && (
                <p>
                  Assigned To:{" "}
                  {leads.find((lead) => lead._id === task.assignedTo)?.name ||
                    "Unknown"}
                </p>
              )}
            </div>
            <div className="task-actions">
              <button
                className="edit-btn"
                onClick={() => handleOpenModal(task)}
                aria-label={`Edit ${task.title}`}
              >
                ✏️
              </button>
              <button
                className="delete-btn"
                onClick={() => removeTask(task._id)}
                aria-label={`Delete ${task.title}`}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-content">
            <h2 id="modal-title">{editingTask ? "Edit Task" : "Add Task"}</h2>
            {error && <p className="error-msg">{error}</p>}

            <input
              type="text"
              placeholder="Title"
              value={taskData.title}
              onChange={(e) =>
                setTaskData({ ...taskData, title: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              value={taskData.description}
              onChange={(e) =>
                setTaskData({ ...taskData, description: e.target.value })
              }
            />
            <select
              value={taskData.status}
              onChange={(e) =>
                setTaskData({ ...taskData, status: e.target.value })
              }
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={taskData.assignedTo}
              onChange={(e) =>
                setTaskData({ ...taskData, assignedTo: e.target.value })
              }
            >
              <option value="">Assign to Lead</option>
              {leads.map((lead) => (
                <option key={lead._id} value={lead._id}>
                  {lead.name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
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
