import { GoogleGenerativeAI } from "@google/generative-ai";


if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export const aiModel = genAI.getGenerativeModel({ 
    model: "gemini-3-flash-preview" 
});