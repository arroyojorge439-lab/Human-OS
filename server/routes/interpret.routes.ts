import express from "express";
import {
  interpret,
  simpleCall,
  visionController,
  deepen,
} from "../controllers/interpret.controller.js";

const router = express.Router();

// Route for main landscape interpretation
router.post("/", interpret);

// Route for deepening the interpretation of a specific symbol
router.post("/deepen", deepen);

// Route for simple, role-based AI responses
router.post("/simple", simpleCall);

// Route for using the vision model
router.post("/image", visionController);

export default router;
