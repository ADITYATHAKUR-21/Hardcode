import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { executCode } from "../controllers/excutCode.controller.js";


const executionRoutes = express.Router();

executionRoutes.post("/", authMiddleware, executCode);



export default executionRoutes;