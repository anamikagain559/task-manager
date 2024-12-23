import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Link } from "react-router-dom";
const TaskDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const taskResponse = await axiosPublic.get(`/tasks/${id}`);
        setTask(taskResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching task details", error);
        setIsLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id, axiosPublic]);

  if (isLoading) return <div>Loading...</div>;
  if (!task) return <div>No task details found.</div>;

  return (
    <div className="task-details p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
      <p className="mb-2"><strong>Description:</strong> {task.description}</p>
      <p className="mb-2"><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleString()}</p>
      <p className="mb-2"><strong>Status:</strong> {task.status}</p>
      <p className="mb-2"><strong>Assigned to:</strong> {task.assignee || "Unassigned"}</p>
      <button className="btn btn-primary">
        <Link to={`/dashboard/tasks/activities/${id}`} className="text-white no-underline">
          See All Activity
        </Link>
      </button>
    </div>
  );
};

export default TaskDetails;
