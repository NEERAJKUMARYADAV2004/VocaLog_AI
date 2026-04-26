"use client";

import { useState } from "react";
import AudioRecorder from "./AudioRecorder";
import FileUploader from "./FileUploader";

export default function TranscriptionManager() {
    // THIS IS THE GLOBAL LOCK
    // If true, BOTH the recorder and the uploader will be disabled
    const [isGlobalProcessing, setIsGlobalProcessing] = useState(false);

    return (
        <section className="w-full flex flex-col gap-6 relative">
            
            {/* Visual indicator that the system is locked */}
            {isGlobalProcessing && (
                <div className="absolute -top-8 left-0 w-full flex justify-center">
                    <span className="text-[10px] tracking-widest uppercase text-[#D4AF37] animate-pulse font-semibold">
                        System Processing... Please Wait
                    </span>
                </div>
            )}

            <AudioRecorder 
                isProcessing={isGlobalProcessing} 
                setIsProcessing={setIsGlobalProcessing} 
            />
            
            <FileUploader 
                isProcessing={isGlobalProcessing} 
                setIsProcessing={setIsGlobalProcessing} 
            />
        </section>
    );
}