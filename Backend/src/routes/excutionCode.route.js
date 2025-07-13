import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { excutCode } from "../controllers/excutCode.controller.js";


const excutionRoutes = express.Router();

excutionRoutes.post("/", authMiddleware, excutCode);



export default excutionRoutes;