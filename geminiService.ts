import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "./constants";

export const askGemini = async (userQuery: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const context = PRODUCTS.map(p => 
    `${p.name} (${p.cat}) - ₹${p.price}, ${p.orderCount} orders, rating ${p.rating} stars. ${p.desc}`
  ).join('. ');

  const systemPrompt = `You are the NSIP Store AI assistant. 
    Information about our products: ${context}. 
    Our contact: +91 91020 98613. 
    Answer the user's questions about products, pricing, and the store concisely and politely. 
    If they ask to buy, guide them to the 'Add to Cart' button.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Our AI assistant is currently taking a short break. Please feel free to browse our products or contact support directly!";
  }
};