import express from "express";
import {
  interpret,
  simpleCall,
  visionController,
} from "../controllers/interpret.controller.js";

const router = express.Router();

// Route for dream interpretation
router.post("/", interpret);

// Route for simple, role-based AI responses
router.post("/simple", simpleCall);

// Route for using the vision model
router.post("/vision", visionController);

export default router;
