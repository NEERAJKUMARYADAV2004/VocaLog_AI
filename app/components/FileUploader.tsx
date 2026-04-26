"use client";

import { useState } from "react";
import { processAudioUpload } from "@/app/actions/transcript-actions";
import Toast from "./Toast"; // 👈 Import the custom toast

interface Props {
    isProcessing: boolean;
    setIsProcessing: (val: boolean) => void;
}

export default function FileUploader({ isProcessing, setIsProcessing }: Props) {
    const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isProcessing) return;
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await processAudioUpload(formData);
            if (result.success) {
                setNotification({ msg: "Transcription Successful", type: "success" });
            } else {
                setNotification({ msg: result.error || "Upload Failed", type: "error" });
            }
        } catch (error) {
            setNotification({ msg: "Network Error", type: "error" });
        } finally {
            setIsProcessing(false);
            e.target.value = ''; 
        }
    };

    return (
        <div className="border-t border-white/10 pt-6 mt-2">
            {notification && (
                <Toast 
                    message={notification.msg} 
                    type={notification.type} 
                    onClose={() => setNotification(null)} 
                />
            )}
            
            <p className="text-xs text-white/50 tracking-widest uppercase mb-4 font-semibold text-center">Or Upload Audio</p>
            <label className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-xl transition-all duration-300 ${
                isProcessing ? "border-white/5 bg-white/5 cursor-not-allowed opacity-50" : "border-white/20 hover:border-[#D4AF37]/50 hover:bg-white/5 cursor-pointer"
            }`}>
                <span className={`text-sm font-semibold tracking-wide ${isProcessing ? "text-white/30" : "text-[#D4AF37]"}`}>
                    {isProcessing ? "TRANSCRIBING..." : "+ Select MP3 File"}
                </span>
                <input type="file" accept="audio/*" className="hidden" onChange={handleFileChange} disabled={isProcessing} />
            </label>
        </div>
    );
}