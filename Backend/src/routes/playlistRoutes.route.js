import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addProblemToPlaylist, createPlaylist, deletePlaylist,  getAllplaylistDetails,  getplaylistDetails, removeproblemFromPlaylist } from "../controllers/playlist.controller.js";



const playlistRoutes = express.Router();

playlistRoutes.get("/", authMiddleware, getAllplaylistDetails);
playlistRoutes.get("/:playlistId", authMiddleware, getplaylistDetails);
playlistRoutes.post("/create_playlist", authMiddleware, createPlaylist);
playlistRoutes.post("/:playlistId/add_problem", authMiddleware, addProblemToPlaylist);
playlistRoutes.delete("/:playlistId", authMiddleware, deletePlaylist);
playlistRoutes.delete("/:playlistId/remove-problem", authMiddleware, removeproblemFromPlaylist)

export default playlistRoutes;