import type { Request, Response } from "express";
import { getInterpretation, getSimpleResponse, generateImage } from "../services/ai.service.ts";

export const interpret = async (req: Request, res: Response) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: "Input requerido" });
    }

    const result = await getInterpretation(input);

    res.json({ result });

  } catch (error: any) {
    console.error("Interpret Controller Error:", error);
    res.status(500).json({
      error: error.message || "No se pudo procesar la interpretación",
    });
  }
};

export const simpleCall = async (req: Request, res: Response) => {
  try {
    const { prompt, role } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt requerido" });
    }

    const result = await getSimpleResponse(prompt, role);

    res.json({ result });

  } catch (error: any) {
    console.error("Simple Call Controller Error:", error);
    res.status(500).json({
      error: error.message || "No se pudo procesar la llamada simple",
    });
  }
};

export const generateImageController = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt requerido" });
    }

    const result = await generateImage(prompt);

    res.json({ result });

  } catch (error: any) {
    console.error("Generate Image Controller Error:", error);
    res.status(500).json({
      error: error.message || "No se pudo generar la imagen",
    });
  }
};
