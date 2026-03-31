import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/env.js";
import fs from "fs";
import path from "path";

if (!config.GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not defined. Please set it in your .env file."
  );
}

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

// --- Prompt Engineering Core ---

const promptPath = path.join(process.cwd(), "shared/prompts/interpret.prompt.json");
const promptConfig = JSON.parse(fs.readFileSync(promptPath, "utf-8"));

function buildSystemPrompt(depthLevel: 'suave' | 'medio' | 'profundo') {
  const level = promptConfig.depth_levels[depthLevel] || promptConfig.depth_levels.medio;

  const sections = [
    promptConfig.persona,
    "\n--- REGLAS BASE ---\n" + promptConfig.base_rules.join("\n"),
    "\n--- GUARDIANES DE SEGURIDAD ---\n" + promptConfig.safety_guardrails.join("\n"),
    `\n--- NIVEL DE PROFUNDIDAD: ${depthLevel.toUpperCase()} ---\n` + level.rules.join("\n"),
    "\n--- ESTRUCTURA DE RESPUESTA OBLIGATORIA ---\n" + promptConfig.response_structure.join("\n"),
  ];

  // Add special functions based on depth
  if (promptConfig.special_functions.blind_spot_detection.enabled_levels.includes(depthLevel)) {
    const func = promptConfig.special_functions.blind_spot_detection;
    sections.push(`\n--- FUNCIÓN ADICIONAL: ${func.section_title} ---\n` + func.rules.join("\n") + "\nEjemplos de frases: " + func.examples.join(", "));
  }

  const integration = promptConfig.special_functions.integration_step;
  sections.push(`\n--- FUNCIÓN ADICIONAL: ${integration.section_title} ---\n` + integration.rules.join("\n") + `\nAdaptación al tono de ${depthLevel}: ${integration.level_specific_tone[depthLevel]}` + "\nEjemplos: " + integration.examples.join(", "));

  const question = promptConfig.special_functions.reflective_question;
  sections.push(`\n--- FUNCIÓN ADICIONAL: ${question.section_title} ---\n` + question.rules.join("\n") + `\nEjemplo para ${depthLevel}: ${question.level_specific_examples[depthLevel]}`);
  
  // Add edge cases
  sections.push("\n--- CASOS BORDE ---\n" + promptConfig.edge_cases.ambiguous_input.instruction + "\n" + promptConfig.edge_cases.high_conflict_in_low_depth.instruction);

  return sections.join("\n\n");
}


// --- Text Generation Service ---

async function generateText(systemPrompt: string, userPrompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    { role: "system", parts: [{ text: systemPrompt }] },
    { role: "user", parts: [{ text: userPrompt }] },
  ]);

  const response = result.response;
  return response.text();
}

export async function getInterpretation(input: string, depth: 'suave' | 'medio' | 'profundo') {
  const systemPrompt = buildSystemPrompt(depth);
  return generateText(systemPrompt, input);
}

export async function getSimpleResponse(prompt: string, role: string) {
  // If no specific role is provided, use a generic one.
  const systemPrompt = role || "Eres un asistente de IA útil.";
  return generateText(systemPrompt, prompt);
}

// --- Image Analysis Service ---

export async function analyzeImage(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}
