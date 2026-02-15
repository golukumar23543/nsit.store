import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "./constants";

export const getGeminiStream = async (userQuery: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const context = PRODUCTS.map(p => 
    `${p.name} (${p.cat}) - ₹${p.price}, ${p.orderCount} orders, rating ${p.rating} stars. ${p.desc}`
  ).join('. ');

  const systemPrompt = `You are the NSIP Premium Digital Concierge.
    Store Context:
    - Products: ${context}
    - Phone/Primary: +91 91020 98613
    - Support Channel: +91 87091 07808
    - Philosophy: Zero Waiting, Authentic Premium Assets.

    RESPONSE GUIDELINES:
    1. Tone: Professional, sophisticated, and helpful.
    2. Formatting: Use structured lists for product recommendations. 
    3. Prices: Always mention prices clearly using the ₹ symbol. 
    4. Style: Use bolding for product names. Use bullet points (•) for features.
    5. Call to Action: If the user is interested, tell them to "Add to VIP Inventory" or use the WhatsApp support.
    6. Language: Keep it concise but elegant.`;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
        thinkingConfig: { thinkingBudget: 0 } // Optimization for speed
      },
    });

    return responseStream;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};