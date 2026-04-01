import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { config } from "../config/env.js";
import fs from "fs";
import path from "path";

// --- Type Definitions ---
type DepthLevel = 'suave' | 'medio' | 'profundo';

export interface InterpretationResponse {
    interpretation: string;
    symbols: string[];
}

// --- AI Service Class ---

class AIService {
    private genAI: GoogleGenerativeAI;
    private promptConfig: any;
    private textModel: GenerativeModel;
    private visionModel: GenerativeModel;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not defined.");
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.textModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        this.visionModel = this.genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        this.loadPromptConfig();
    }

    private loadPromptConfig() {
        try {
            const promptPath = path.join(process.cwd(), "shared/prompts/interpret.prompt.json");
            this.promptConfig = JSON.parse(fs.readFileSync(promptPath, "utf-8"));
        } catch (error) {
            console.error("Failed to load or parse prompt configuration:", error);
            throw new Error("Could not load AI prompt configuration.");
        }
    }

    private buildSystemPrompt(depthLevel: DepthLevel): string {
        const { persona, base_rules, safety_guardrails, response_structure, depth_levels, special_functions, edge_cases } = this.promptConfig;
        
        const level = depth_levels[depthLevel] || depth_levels.medio;

        const sections = [
            persona,
            "\n--- REGLAS BASE ---\n" + base_rules.join("\n"),
            "\n--- GUARDIANES DE SEGURIDAD ---\n" + safety_guardrails.join("\n"),
            "\n--- ESTRUCTURA DE RESPUESTA OBLIGATORIA ---\n" + response_structure.join("\n"),
            `\n--- NIVEL DE PROFUNDIDAD: ${depthLevel.toUpperCase()} ---\n` + level.rules.join("\n"),
        ];

        // Special functions
        const { blind_spot_detection, integration_step, reflective_question } = special_functions;
        if (blind_spot_detection.enabled_levels.includes(depthLevel)) {
            sections.push(`\n--- FUNCIÓN ADICIONAL: ${blind_spot_detection.section_title} ---\n` + blind_spot_detection.rules.join("\n") + "\nEjemplos de frases: " + blind_spot_detection.examples.join(", "));
        }
        sections.push(`\n--- FUNCIÓN ADICIONAL: ${integration_step.section_title} ---\n` + integration_step.rules.join("\n") + `\nAdaptación al tono de ${depthLevel}: ${integration_step.level_specific_tone[depthLevel]}` + "\nEjemplos: " + integration_step.examples.join(", "));
        sections.push(`\n--- FUNCIÓN ADICIONAL: ${reflective_question.section_title} ---\n` + reflective_question.rules.join("\n") + `\nEjemplo para ${depthLevel}: ${reflective_question.level_specific_examples[depthLevel]}`);
        
        // Edge cases
        sections.push("\n--- CASOS BORDE ---\n" + edge_cases.ambiguous_input.instruction + "\n" + edge_cases.high_conflict_in_low_depth.instruction);

        return sections.join("\n\n");
    }

    private cleanJsonString(text: string): string {
        const match = text.match(/```json\n([\s\S]*?)\n```/);
        if (match && match[1]) {
            return match[1];
        }
        return text.trim();
    }
    
    private async generateText(systemPrompt: string, userPrompt: string): Promise<string> {
        try {
            const result = await this.textModel.generateContent([
                { role: "system", parts: [{ text: systemPrompt }] },
                { role: "user", parts: [{ text: userPrompt }] },
            ]);
            return result.response.text();
        } catch (error) {
            console.error("Error during text generation:", error);
            throw new Error("Failed to generate text from AI model.");
        }
    }

    public async getInterpretation(input: string, depth: DepthLevel): Promise<InterpretationResponse> {
        const systemPrompt = this.buildSystemPrompt(depth);
        const rawResponse = await this.generateText(systemPrompt, input);

        try {
            const cleanedResponse = this.cleanJsonString(rawResponse);
            const jsonResponse = JSON.parse(cleanedResponse);

            if (!jsonResponse.interpretation || !Array.isArray(jsonResponse.symbols)) {
                throw new Error("Invalid JSON structure from AI");
            }
            return jsonResponse;
        } catch (error: any) {
            console.error("Failed to parse AI response as JSON:", error.message);
            console.error("Raw AI Response:", rawResponse);
            // Fallback for safety
            return {
                interpretation: "Error: La respuesta de la IA no pudo ser procesada. Esto puede ser un error temporal. Respuesta original: " + rawResponse,
                symbols: []
            };
        }
    }

    public async getSimpleResponse(prompt: string, role?: string): Promise<string> {
        const systemPrompt = role || "Eres un asistente de IA útil.";
        return this.generateText(systemPrompt, prompt);
    }
    
    public async analyzeImage(prompt: string): Promise<string> {
        try {
            const result = await this.visionModel.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error("Error during image analysis:", error);
            throw new Error("Failed to analyze image with AI model.");
        }
    }
}

// --- Service Singleton Export ---

// Export a singleton instance of the service
export const aiService = new AIService(config.GEMINI_API_KEY);
