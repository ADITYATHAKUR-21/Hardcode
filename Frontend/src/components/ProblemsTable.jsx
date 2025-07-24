import React, {useState, useMemo} from "react";
import { useAuthStore } from "../store/useAuthStore";
import {Link} from "react-router-dom"

import {Bookmark, PencilIcon, Trash, TrashIcon, Plus} from "lucide-react"



const ProblemsTable = ({problems}) => {
  const { authUser } = useAuthStore();
 
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <>
    <div className="w-full max-w-6xl mt-10 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Problems</h2>
        <button
          className="btn btn-primary gap-2"
          onClick= {() => {}}
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </button>
      </div>

    </div>
    </>
  )
  
};

export default ProblemsTable;
