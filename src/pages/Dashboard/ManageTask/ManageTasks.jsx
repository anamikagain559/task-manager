import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useTasks from "../../../hooks/useTasks"; // Assume a custom hook for fetching tasks
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const ManageTasks = () => {
  const [tasks, , refetch] = useTasks(); // Replace `useSurvey` with `useTasks`
  const axiosSecure = useAxiosSecure();
console.log(tasks);
  const handleStatusChange = async (id) => {
    const currentTask = tasks.find((task) => task._id === id);

    try {
      const newStatus = currentTask.status === "completed" ? "pending" : "completed";

      if (response.status === 200) {
        refetch(); // Refresh the task list
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Task status updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to update task status",
        showConfirmButton: false,
        timer: 1500,
      });
      console.error("Error updating task status", error);
    }
  };

  return (
    <div>
      <h1>Manage All Tasks</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full min-w-full lg:min-w-[800px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 lg:px-4 py-2 text-left">#</th>
              <th className="px-2 lg:px-4 py-2 text-left">Task Title</th>
              <th className="px-2 lg:px-4 py-2 text-left">Priority</th>
              <th className="px-2 lg:px-4 py-2 text-left">Status</th>
              <th className="px-2 lg:px-4 py-2 text-left">See Details</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task._id} className="hover:bg-gray-100">
                <td className="border px-2 lg:px-4 py-2">{index + 1}</td>
                <td className="border px-2 lg:px-4 py-2">{task.title}</td>
                <td className="border px-2 lg:px-4 py-2 text-right">{task.priority}</td>
                <td className="border px-2 lg:px-4 py-2">
                {task.status}
                 
                </td>
                <td className="border px-2 lg:px-4 py-2">
                  <Link to={`/dashboard/tasks/${task._id}`}>
                    <button className="btn btn-ghost bg-[#3ABEF9] text-base text-white">
                      Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTasks;
