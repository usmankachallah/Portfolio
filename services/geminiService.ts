
import { GoogleGenAI } from "@google/genai";

export const getAiResponse = async (userMessage: string, instruction: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: instruction,
        temperature: 0.7,
      },
    });

    if (!response || !response.text) {
      throw new Error("No response from neural network.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    if (error.message?.includes("refused") || error.message?.includes("API_KEY")) {
      return "System Error: Connection to the neural grid was refused. Please check your API credentials or network settings.";
    }
    
    return "The assistant is currently recalibrating its neural pathways. Please try your query again in a moment.";
  }
};
