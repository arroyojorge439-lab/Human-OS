import { Request, Response } from "express";
import { aiService, InterpretationResponse } from "../services/ai.service.js";

// Helper to handle async controller logic and errors
const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => 
    (req: Request, res: Response) => {
        Promise.resolve(fn(req, res)).catch((error) => {
            console.error(`Error in ${req.path}:`, error);
            res.status(500).json({ error: error.message || "Internal Server Error" });
        });
    };


// Controller for dream interpretation
export const interpret = asyncHandler(async (req: Request, res: Response) => {
    const { input, depth = 'medio' } = req.body;

    if (!input) {
        res.status(400).json({ error: "Input is required" });
        return;
    }

    // Type guard for depth
    const validDepths = ['suave', 'medio', 'profundo'];
    if (!validDepths.includes(depth)) {
        res.status(400).json({ error: "Invalid depth level provided." });
        return;
    }

    const result: InterpretationResponse = await aiService.getInterpretation(input, depth as 'suave' | 'medio' | 'profundo');
    res.json(result);
});

export const deepen = asyncHandler(async (req: Request, res: Response) => {
    const { symbol, context } = req.body;

    if (!symbol || !context) {
        res.status(400).json({ error: "Symbol and context are required" });
        return;
    }

    const result = await aiService.getSymbolInterpretation(symbol, context);
    res.json({ interpretation: result });
});

// Controller for simple, role-based AI responses
export const simpleCall = asyncHandler(async (req: Request, res: Response) => {
    const { prompt, role } = req.body;
    if (!prompt) {
        res.status(400).json({ error: "Prompt is required" });
        return;
    }
    const result = await aiService.getSimpleResponse(prompt, role);
    res.json({ result });
});

// Controller for using the vision model
export const visionController = asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = req.body;
    if (!prompt) {
        res.status(400).json({ error: "Prompt is required" });
        return;
    }
    const result = await aiService.analyzeImage(prompt);
    res.json({ result });
});
