
import { GoogleGenAI } from "@google/genai";
import { USMAN_BIO } from "../constants";

export const getAiResponse = async (userMessage: string) => {
  try {
    // Re-instantiating inside the function ensures the latest process.env.API_KEY is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: `
          You are Usman's personal AI Assistant. Your goal is to represent Usman to potential employers or collaborators.
          ${USMAN_BIO}
          Be professional, modern, and slightly futuristic in your tone. 
          Keep answers concise and helpful. 
          If asked about Usman's skills, mention React, HTML, CSS, and JS prominently.
          Always maintain a helpful and tech-forward persona.
        `,
        temperature: 0.7,
      },
    });

    if (!response || !response.text) {
      throw new Error("No response from neural network.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    // Check for specific connection/auth errors
    if (error.message?.includes("refused") || error.message?.includes("API_KEY")) {
      return "System Error: Connection to the neural grid was refused. Please check your API credentials or network settings.";
    }
    
    return "The assistant is currently recalibrating its neural pathways. Please try your query again in a moment.";
  }
};
