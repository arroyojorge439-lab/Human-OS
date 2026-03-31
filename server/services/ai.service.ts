import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { config } from "../config/env.js";

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY! });

const promptPath = path.join(process.cwd(), "shared/prompts/interpret.prompt.txt");
const systemPrompt = fs.readFileSync(promptPath, "utf-8");

export const getInterpretation = async (input: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: input,
    config: {
      systemInstruction: systemPrompt,
    },
  });

  return response.text;
};

export const getSimpleResponse = async (prompt: string, role: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: role,
    },
  });

  return response.text;
};

export const generateImage = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
