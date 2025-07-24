import { create } from "zustand";
import { axiosInstance } from "../lib/Axios";
import { toast } from "react-hot-toast";
import axios from "axios";

export const useProblemStor = create (() => ({
    problems: [],
    problem: null,
    solvedProblem: [],
    isProblemsLoding: false,
    isProblemLoding: false,


    getAllProblem: async(set) => {

        set({isProblemsLoding: true});
        try {
            const res = await axiosInstance.get("/problems/get-All-problems");
            set({problems: res.data.problems})

        
            
        } catch (error) {
            console.log("Error geting All problems ", error);

        }finally {
             set({isProblemsLoding: false});

        }

    },

    getProblemById: async(id) => {
        set({isProblemLoding: ture});
        try {
            const res = axiosInstance.get(`/problems/get-problem/${id}`)
            set({problem: (await res).data.problem})
            
        } catch (error) {
            console.log("Error geting problem", error);
            
            
        }finally{
            set({isProblemLoding: false})
        }
    },
    getSolvedProblem: async() => {
        try {
            const res = axiosInstance.get("/problems/get-solved-problems")
        set({solvedProblem: (await res).data.problems})
            
        } catch (error) {
            console.log("Error geting solved problem");
            
        
        }
    } 

}));

