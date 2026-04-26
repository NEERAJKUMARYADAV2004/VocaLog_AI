import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API key exists
if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// We use 'gemini-1.5-flash' because it handles native audio transcription incredibly fast
export const aiModel = genAI.getGenerativeModel({ 
    model: "gemini-3-flash-preview" 
});