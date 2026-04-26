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

    const prompt = "You are a professional transcriptionist. Please transcribe this audio accurately. Only return the transcription text, nothing else. If it is silent, say '[No speech detected]'.";

    // 1. Get the text from Gemini
    const result = await aiModel.generateContent([
      prompt,
      {
        inlineData: { mimeType: file.type, data: base64Audio },
      },
    ]);

    const finalTranscript = result.response.text();

    // 2. SAVE IT TO THE DATABASE!
   const adminUser = await prisma.user.findFirst();

    if (!adminUser) {
      return { success: false, error: "No admin user found in database." };
    }

    await prisma.transcript.create({
      data: {
        content: finalTranscript,
        user: {
          connect: { id: adminUser.id }
        }
      },
    });
    revalidatePath("/dashboard");
    // 3. Return it to the frontend
    return { success: true, text: finalTranscript };

  } catch (error) {
    console.error("Transcription Error:", error);
    return { success: false, error: "The AI failed to process the audio." };
  }
}