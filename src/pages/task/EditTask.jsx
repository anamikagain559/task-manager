import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useParams, useNavigate } from "react-router-dom";

const EditTask = () => {
  const { user } = useAuth();
  const { taskId } = useParams();


  const navigate = useNavigate(); // For navigation after successful update
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState("");
  const priorities = ["Low", "Medium", "High"];
  const statuses = ["Pending", "In Progress", "Completed"];
  const axiosSecure = useAxiosPublic();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axiosSecure.get(`/tasks/${taskId}`);
        const task = response.data;
        setTitle(task.title);
        setDescription(task.description);
        setPriority(task.priority);
        setStatus(task.status);
        setDueDate(task.dueDate);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch task details. Please try again.",
        });
      }
    };

    fetchTask();
  }, [taskId, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTask = {
      title,
      description,
      priority,
      status,
      dueDate,
      userEmail: user?.email || "unknown",
      userName: user?.displayName || "unknown",
    };

    try {
      await axiosSecure.put(`/tasks/${taskId}`, updatedTask);

      Swal.fire({
        icon: "success",
        title: "Task Updated",
        text: "Task updated successfully!",
      });

      // Redirect to task list or details page after successful update
      navigate("/dashboard/mySurveyList");
    } catch (error) {
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update task. Please try again.",
      });
    }
  };

  return (
    <div className="pt-[100px]">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-8 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-6">Edit Task</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            {priorities.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            {statuses.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default EditTask;
