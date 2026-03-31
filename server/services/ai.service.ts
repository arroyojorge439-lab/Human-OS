import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/env.js";
import fs from "fs";
import path from "path";

// 1. API Key Check: Ensure the API key is available before doing anything else.
if (!config.GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not defined. Please set it in your .env file."
  );
}

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

// --- Text Generation Service ---

// Helper to read the system prompt from a file
const interpretPromptPath = path.join(
  process.cwd(),
  "shared/prompts/interpret.prompt.txt"
);
const interpretSystemPrompt = fs.readFileSync(interpretPromptPath, "utf-8");

/**
 * A generalized function to generate text content using the Gemini API.
 * @param systemPrompt The system instruction to guide the model.
 * @param userPrompt The user-provided prompt.
 * @returns The generated text.
 */
async function generateText(systemPrompt: string, userPrompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    { role: "system", parts: [{ text: systemPrompt }] },
    { role: "user", parts: [{ text: userPrompt }] },
  ]);

  const response = result.response;
  return response.text();
}

// Specific function for dream interpretation
export async function getInterpretation(input: string) {
  return generateText(interpretSystemPrompt, input);
}

// Specific function for a simple, role-based response
export async function getSimpleResponse(prompt: string, role: string) {
  return generateText(role, prompt);
}

// --- Image Generation/Analysis Service ---

/**
 * This function uses a vision model. It can describe images, but not generate them.
 * The model name has been corrected to a valid vision model.
 * @param prompt The text prompt to send to the vision model.
 * @returns The generated text based on the prompt.
 */
export async function analyzeImage(prompt: string) {
  // Note: This model is for understanding images, not generating them.
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}
