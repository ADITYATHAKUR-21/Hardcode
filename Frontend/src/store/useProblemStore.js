import { create } from "zustand";
import { axiosInstance } from "../lib/Axios";
import { toast } from "react-hot-toast";


export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblem: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    
    try {
      set({ isProblemsLoading : true });
      const res = await axiosInstance.get("/problems/get-all-problems");
      
      if (res.data && res.data.problems) {
        set({ problems: res.data.problems });
      } else {
        console.log("No problems data in response:", res.data);
        toast.error("No problems found");
        
      }
    } catch (error) {
      console.log("Error getting All problems ", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch problems";
      toast.error(errorMessage);
      set({ problems: [] });
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    set({ isProblemLoading: true });
    try {
      const res = await axiosInstance.get(`/problems/get-problem/${id}`);
      set({ problem: res.data.problem });
    } catch (error) {
      console.log("Error getting problem", error);
    } finally {
      set({ isProblemLoading: false });
    }
  },
  getSolvedProblem: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problems");
      set({ solvedProblem: res.data.problems });
    } catch (error) {
      console.log("Error getting solved problem", error);
    }
  },
}));
