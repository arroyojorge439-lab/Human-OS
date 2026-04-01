import { GoogleGenAI } from "@google/genai";

export const getAI = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("API Key not found. AI features may be limited.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const callGemini = async (prompt: string, role: string = ""): Promise<string> => {
  try {
    const ai = getAI();
    if (!ai) throw new Error("API Key no configurada.");

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: role,
      },
    });
    
    const text = response.text;
    if (!text) throw new Error("Error en la respuesta.");
    return text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const ai = getAI();
    if (!ai) throw new Error("API Key no configurada.");

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
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};
