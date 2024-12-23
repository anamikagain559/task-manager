import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const UserTask = () => {
  const { user } = useAuth();
  const userEmail = user?.email || null; // Get the current user's email
  const axiosSecure = useAxiosPublic();

  const [statusFilter, setStatusFilter] = useState("All");
  const [dueDateFilter, setDueDateFilter] = useState("");

  const {
    data: allTasks = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks`); // Fetch all tasks
      return res.data;
    },
  });

  // Filter tasks by userEmail, status, and due date
  const tasks = userEmail
    ? allTasks.filter((task) => task.userEmail === userEmail)
    : [];

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;
    const matchesDueDate =
      !dueDateFilter ||
      new Date(task.dueDate).toLocaleDateString() ===
        new Date(dueDateFilter).toLocaleDateString();
    return matchesStatus && matchesDueDate;
  });

  // Mutation for deleting a task
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      await axiosSecure.delete(`/tasks/${taskId}`);
    },
    onSuccess: () => {
      toast.success("Task deleted successfully");
      refetch(); // Refresh task list
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  const handleDelete = (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setStatusFilter("All");
    setDueDateFilter("");
  };

  // Handle the drag end and update the order of tasks
  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return; // Dropped outside the list
    }

    if (
      destination.index === source.index
    ) {
      return; // No change if dropped in the same position
    }

    const reorderedTasks = Array.from(filteredTasks);
    const [movedTask] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, movedTask);

    // Update the task order in the backend
    reorderedTasks.forEach((task, index) => {
      axiosSecure.put(`/tasks/${task._id}`, { ...task, order: index });
    });

    refetch(); // Refresh task list
  };

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <div className="overflow-x-auto">
    <h1 className="text-center font-bold p-5"> ALL Task Added By Me</h1>
      <div className="mb-4 flex flex-wrap space-x-4">
        <select
          className="p-2 border rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <input
          type="date"
          className="p-2 border rounded"
          value={dueDateFilter}
          onChange={(e) => setDueDateFilter(e.target.value)}
        />
        {/* Reset Filters Button */}
        <button
          onClick={handleResetFilters}
          className="p-2 bg-gray-500 text-white rounded"
        >
          Reset Filters
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <table
              className="table-auto w-full min-w-full lg:min-w-[600px]"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 lg:px-4 py-2 text-left">#</th>
                  <th className="px-2 lg:px-4 py-2 text-left">Title</th>
                  <th className="px-2 lg:px-4 py-2 text-left">Description</th>
                  <th className="px-2 lg:px-4 py-2 text-left">Priority</th>
                  <th className="px-2 lg:px-4 py-2 text-left">Status</th>
                  <th className="px-2 lg:px-4 py-2 text-left">Due Date</th>
                  <th className="px-2 lg:px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <tr
                        className="hover:bg-gray-100"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <td className="border px-2 lg:px-4 py-2">{index + 1}</td>
                        <td className="border px-2 lg:px-4 py-2">{task.title}</td>
                        <td className="border px-2 lg:px-4 py-2">{task.description}</td>
                        <td className="border px-2 lg:px-4 py-2">{task.priority}</td>
                        <td className="border px-2 lg:px-4 py-2">{task.status}</td>
                        <td className="border px-2 lg:px-4 py-2">{task.dueDate}</td>
                        <td className="border px-2 lg:px-4 py-2 flex flex-col lg:flex-row lg:space-x-2">
                          <Link to={`/dashboard/tasks/${task._id}`}>
                            <button className="btn btn-primary mb-2 lg:mb-0">
                              Details
                            </button>
                          </Link>
                          <Link to={`/dashboard/editTask/${task._id}`}>
                            <button className="btn btn-secondary mb-2 lg:mb-0">Edit</button>
                          </Link>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="btn btn-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>

      <ToastContainer />
    </div>
  );
};

export default UserTask;
