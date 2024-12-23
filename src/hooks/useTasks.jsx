import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useTasks = () => {
  const axiosPublic = useAxiosPublic();
  const {
    data: tasks = [], // Default value for tasks
    isLoading: loading, // Renamed isPending to isLoading for consistency
    refetch,
  } = useQuery({
    queryKey: ["tasks"], // Updated queryKey to "tasks"
    queryFn: async () => {
      const res = await axiosPublic.get("/tasks"); // Updated endpoint to "/tasks"
      return res.data; // Return the task data
    },
  });

  return [tasks, loading, refetch];
};

export default useTasks;
