import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { fetchTasks, addTask, updateTask, deleteTask } from "../services/api";
import { useAuth } from "./AuthContext";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const loadTasks = useCallback(async () => {
    if (loading) return;
    if (!user) {
      console.warn("User not found. Skipping task fetch.");
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

  const createTask = async (task) => {
    try {
      const newTask = await addTask(task);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const editTask = async (id, taskData) => {
    try {
      const updatedTask = await updateTask(id, taskData);
      setTasks((prevTasks) => prevTasks.map((task) => (task._id === id ? updatedTask : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <TaskContext.Provider value={{ tasks, loadTasks, createTask, editTask, removeTask, isFetching }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
