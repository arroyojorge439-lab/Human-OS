import { Request, Response } from "express";
import {
  getInterpretation,
  getSimpleResponse,
  analyzeImage,
} from "../services/ai.service.js";

// Controller for dream interpretation
export const interpret = async (req: Request, res: Response) => {
  try {
    const { input, depth = 'medio' } = req.body;
    if (!input) {
      return res.status(400).json({ error: "Input is required" });
    }

    // Validate depth
    const validDepths = ['suave', 'medio', 'profundo'];
    if (!validDepths.includes(depth)) {
        return res.status(400).json({ error: "Invalid depth level provided." });
    }

    const result = await getInterpretation(input, depth);
    res.json({ result });
  } catch (error: any) {
    console.error("Interpret Controller Error:", error);
    res.status(500).json({
      error: error.message || "Failed to process interpretation",
    });
  }
};

// Controller for simple, role-based AI responses
export const simpleCall = async (req: Request, res: Response) => {
  try {
    const { prompt, role } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    const result = await getSimpleResponse(prompt, role);
    res.json({ result });
  } catch (error: any) {
    console.error("Simple Call Controller Error:", error);
    res.status(500).json({ error: error.message || "Failed to process simple call" });
  }
};

// Controller for using the vision model
export const visionController = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    // Note: This function uses a vision model, it does not generate images.
    const result = await analyzeImage(prompt);
    res.json({ result });
  } catch (error: any) {
    console.error("Vision Controller Error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to process vision request" });
  }
};
