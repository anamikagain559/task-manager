import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

const TaskActivity = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  // State hooks
  const [newActivity, setNewActivity] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch task activities
  const { data: taskActivities = [], isLoading: activitiesLoading, error: activitiesError } = useQuery(
    ["taskActivities", id],
    async () => {
      if (!id) throw new Error("Task ID is required");
      const res = await axiosPublic.get(`/tasks/${id}/activities`);
      return res.data;
    }
  );

  // Add new activity
  const handleAddActivity = async () => {
    if (!id || newActivity.trim() === "") {
      toast.error("Activity cannot be empty or Task ID is missing");
      return;
    }

    try {
      setLoading(true);
      await axiosPublic.post(`/tasks/activities/${id}`, { activity: newActivity });
      Swal.fire("Success", "Activity added successfully!", "success");
      queryClient.invalidateQueries(["taskActivities", id]); // Refresh activities
      setNewActivity(""); // Clear input field
      document.getElementById("my_modal_1").close(); // Close modal
    } catch (error) {
      Swal.fire("Error", "Failed to add activity. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Open modal for adding activity
  const openAddModal = () => document.getElementById("my_modal_1").showModal();

  if (activitiesLoading) return <div>Loading activities...</div>;
  if (activitiesError) return <div>Error fetching activities: {activitiesError.message}</div>;

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Task Activities</h1>

      {/* Add Activity Button */}
      <button className="btn btn-accent mt-4" onClick={openAddModal}>
        Add Activity
      </button>

      {/* Task Activities */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Activities</h2>
        {taskActivities.length > 0 ? (
          <ul className="space-y-4">
            {taskActivities.map((activity) => (
              <li key={activity.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-xl">{activity.name}</h3>
                  <div className="flex space-x-2">
                    <button className="btn btn-danger btn-sm">Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600 font-medium">No activities yet</p>
        )}
      </div>

      {/* Add Modal */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Activity</h3>
          <input
            type="text"
            placeholder="Activity Name"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            className="input input-bordered w-full mt-2"
          />
          <div className="modal-action">
            <button
              onClick={handleAddActivity}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Activity"}
            </button>
            <button
              className="btn"
              onClick={() => document.getElementById("my_modal_1").close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default TaskActivity;
