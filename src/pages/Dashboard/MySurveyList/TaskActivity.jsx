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
  const [editingActivity, setEditingActivity] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch task activities
  const { data: taskActivities = [], isLoading: activitiesLoading, error: activitiesError } = useQuery({
    queryKey: ["taskActivities", id],
    queryFn: async () => {
      if (!id) throw new Error("Task ID is required");
      const res = await axiosPublic.get(`/tasks/${id}/activities`);
      return res.data;
    },
  });

  const filteredActivities = taskActivities.filter((activity) => activity.task_id === id);

  // Add or update activity
  const handleSaveActivity = async () => {
    if (newActivity.trim() === "") {
      toast.error("Activity cannot be empty");
      return;
    }

    try {
      setLoading(true);
      if (editingActivity) {
        // Update activity
        await axiosPublic.put(`/tasks/activities/${editingActivity._id}`, { activity: newActivity });
        Swal.fire("Success", "Activity updated successfully!", "success");
      } else {
        // Add new activity
        await axiosPublic.post(`/tasks/activities/${id}`, { activity: newActivity });
        Swal.fire("Success", "Activity added successfully!", "success");
      }
      queryClient.invalidateQueries(["taskActivities", id]);
      setNewActivity("");
      setEditingActivity(null);
      document.getElementById("activity_modal").close();
    } catch (error) {
      Swal.fire("Error", "Failed to save activity. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete activity
  const handleDeleteActivity = async (activityId) => {
    try {
      const confirmed = await Swal.fire({
        title: "Are you sure?",
        text: "This activity will be deleted permanently.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      });
      if (confirmed.isConfirmed) {
        await axiosPublic.delete(`/tasks/activities/${activityId}`);
        Swal.fire("Deleted!", "Activity has been deleted.", "success");
        queryClient.invalidateQueries(["taskActivities", id]);
      }
    } catch (error) {
      Swal.fire("Error", "Failed to delete activity. Please try again.", "error");
    }
  };

  // Open modal for adding or editing activity
  const openModal = (activity = null) => {
    setNewActivity(activity ? activity.name : "");
    setEditingActivity(activity);
    document.getElementById("activity_modal").showModal();
  };

  if (activitiesLoading) return <div>Loading activities...</div>;
  if (activitiesError) return <div>Error fetching activities: {activitiesError.message}</div>;
console.log(taskActivities);
  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Task Activities</h1>

      {/* Add Activity Button */}
      <button className="btn btn-accent mt-4" onClick={() => openModal()}>
        Add Activity
      </button>

      {/* Task Activities */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Activities</h2>
        {filteredActivities.length > 0 ? (
          <ul className="space-y-4">
            {filteredActivities.map((activity) => (
              <li key={activity.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-xl">{activity.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openModal(activity)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteActivity(activity._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600 font-medium">No activities yet</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      <dialog id="activity_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {editingActivity ? "Edit Activity" : "Add New Activity"}
          </h3>
          <input
            type="text"
            placeholder="Activity Name"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            className="input input-bordered w-full mt-2"
          />
          <div className="modal-action">
            <button
              onClick={handleSaveActivity}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Activity"}
            </button>
            <button
              className="btn"
              onClick={() => document.getElementById("activity_modal").close()}
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
