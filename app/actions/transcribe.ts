"use server";
import { revalidatePath } from "next/cache";
import { aiModel } from "../../lib/gemini"; 
import {prisma} from "../../lib/prisma";

export async function transcribeAudio(formData: FormData) {
  try {
    const file = formData.get("audio") as File;
    if (!file) return { success: false, error: "No audio provided." };

    const arrayBuffer = await file.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    const prompt = "You are a professional transcriptionist. Please transcribe this audio accurately. Only return the transcription text, nothing else. If the audio is silent, has no speech, or only background noise, respond with EXACTLY: [NO_SPEECH]";

    
    const result = await aiModel.generateContent([
      prompt,
      {
        inlineData: { mimeType: file.type, data: base64Audio },
      },
    ]);

    const finalTranscript = result.response.text().trim();

    // Don't save empty or silent transcriptions
    if (!finalTranscript || 
        finalTranscript === "[NO_SPEECH]" || 
        finalTranscript === "[No speech detected]" ||
        finalTranscript.toLowerCase().includes("no speech") ||
        finalTranscript.length < 3) {
      return { success: false, error: "No speech detected in the audio." };
    }

    await prisma.transcript.create({
      data: {
        content: finalTranscript
      },
    });
    revalidatePath("/dashboard");
    
    return { success: true, text: finalTranscript };

  } catch (error) {
    console.error("Transcription Error:", error);
    return { success: false, error: "The AI failed to process the audio." };
  }
}