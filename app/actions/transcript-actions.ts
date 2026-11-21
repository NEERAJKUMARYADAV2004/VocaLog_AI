"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cookies } from "next/headers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);


export async function deleteTranscript(id: string) {
    try {
        await prisma.transcript.delete({
            where: { id },
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete transcript:", error);
        return { success: false, error: "Failed to delete" };
    }
}


export async function updateTranscript(id: string, newContent: string) {
    try {
        await prisma.transcript.update({
            where: { id },
            data: { content: newContent },
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to update transcript:", error);
        return { success: false, error: "Failed to update" };
    }
}


export async function processAudioUpload(formData: FormData) {
    const cookieStore = await cookies();
    const session = cookieStore.get("vocalog_session");

    if (!session) return { success: false, error: "Authentication required" };

    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file received" };

    try {
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");
        const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

        const result = await model.generateContent([
            { inlineData: { mimeType: file.type, data: base64Data } },
            { text: `ACT AS A RAW TRANSCRIPTION ENGINE. 
        Transcribe the audio exactly as spoken. 
        DO NOT include any introductory remarks, preambles, or conversational filler like "Sure, here is the transcription". 
        Output ONLY the spoken words. If there is no speech, silence, background noise, or unintelligible audio, respond with EXACTLY: [NO_SPEECH]` },
        ]);

        const realTranscription = result.response.text().trim();

        // Don't save empty or silent transcriptions
        if (!realTranscription || 
            realTranscription === "[NO_SPEECH]" || 
            realTranscription === "[No speech detected]" ||
            realTranscription.toLowerCase().includes("no speech") ||
            realTranscription.length < 3) {
            return { success: false, error: "No speech detected in the audio." };
        }

        await prisma.transcript.create({
            data: {
                content: realTranscription
            }
        });

        revalidatePath("/dashboard");
        return { success: true };

    } catch (error: any) {
    console.error("AI Transcription Error:", error);
    
    
    if (error.message?.includes("429") || error.status === 429) {
        return { 
            success: false, 
            error: "Peak Capacity Reached: Daily intelligence buffers are full." 
        };
    }

    return { success: false, error: "AI processing failed. Please try again." };
}
}