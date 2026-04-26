"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/lib/auth"; //  Added
import { headers } from "next/headers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 1. DELETE FUNCTION
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

// 2. EDIT FUNCTION
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

// 3. UPLOAD & TRANSCRIBE FUNCTION (Gemini Powered)
export async function processAudioUpload(formData: FormData) {
    // 1. Get the session to find the Admin's ID
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return { success: false, error: "Authentication required" };

    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file received" };

    try {
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const result = await model.generateContent([
            { inlineData: { mimeType: file.type, data: base64Data } },
            { text: `ACT AS A RAW TRANSCRIPTION ENGINE. 
        Transcribe the audio exactly as spoken. 
        DO NOT include any introductory remarks, preambles, or conversational filler like "Sure, here is the transcription". 
        Output ONLY the spoken words. If there is no speech, return an empty string.` },
        ]);

        const realTranscription = result.response.text();

        // 2. CONNECT TO THE USER
        await prisma.transcript.create({
            data: {
                content: realTranscription,
                user: {
                    connect: { id: session.user.id } // 👈 This fixes the missing argument error
                }
            }
        });

        revalidatePath("/dashboard");
        return { success: true };

    } catch (error: any) {
    console.error("AI Transcription Error:", error);
    
    // Check if it's a quota error
    if (error.message?.includes("429") || error.status === 429) {
        return { 
            success: false, 
            error: "Peak Capacity Reached: Daily intelligence buffers are full." 
        };
    }

    return { success: false, error: "AI processing failed. Please try again." };
}
}