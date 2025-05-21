import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { fetchTasks, addTask, updateTask, deleteTask } from "../services/api";
import { useAuth } from "./AuthContext";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // Load tasks when user is available and not loading
  const loadTasks = useCallback(async () => {
    if (loading) return; // Wait until auth is done
    if (!user) {
      console.warn("User not found. Skipping task fetch.");
      setTasks([]); // Clear tasks if user logs out
      return;
    }

    setIsFetching(true);
    try {
      console.log("Fetching tasks...");
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsFetching(false);
    }
  }, [user, loading]);

  // Create a new task and update state
  const createTask = async (task) => {
    try {
      const newTask = await addTask(task);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Edit existing task and update state
  const editTask = async (id, taskData) => {
    try {
      const updatedTask = await updateTask(id, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete task and update state
  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Load tasks on mount and when user or loading changes
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <TaskContext.Provider
      value={{ tasks, loadTasks, createTask, editTask, removeTask, isFetching }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook for easier use of TaskContext
export const useTasks = () => useContext(TaskContext);
