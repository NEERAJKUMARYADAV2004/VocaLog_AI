"use client";

import { useState, useRef } from "react";
// 1. Point this to the action we just fixed with Gemini 3
import { processAudioUpload } from "@/app/actions/transcript-actions"; 

interface Props {
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
}

export default function AudioRecorder({ isProcessing, setIsProcessing }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setErrorMessage(null);
    setTranscript("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true); // Locks the whole UI
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([audioBlob], "recording.webm", { type: "audio/webm" });

        const formData = new FormData();
        // 2. Changed "audio" to "file" to match your server-side .get("file")
        formData.append("file", file); 

        const response = await processAudioUpload(formData);
        
        if (response.success) {
          // The log will now appear in your "Recent Logs" list automatically!
          setTranscript("Voice log saved to dashboard.");
        } else {
          setErrorMessage(response.error || "The AI failed to process the audio.");
        }
        setIsProcessing(false); // Unlocks the UI
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setErrorMessage("Please allow microphone permissions in your browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md flex flex-col items-center gap-4 w-full max-w-lg">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={`flex items-center justify-center gap-3 px-8 py-3 rounded-full font-semibold transition-all duration-500 border ${
          isRecording 
            ? "bg-red-900/40 text-red-400 border-red-500/50 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
            : isProcessing 
              ? "bg-[#1a1a1a] text-gray-500 border-white/5 cursor-not-allowed" 
              : "bg-[#1E1610] text-[#E0E0E0] border-[#3C2A1A] hover:bg-[#2A1E16] hover:border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.05)]"
        }`}
      >
        {isRecording ? (
          <>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Stop Recording
          </>
        ) : isProcessing ? (
          "⏳ Transcribing..."
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
              <path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/>
            </svg>
            Start Recording
          </>
        )}
      </button>

      {errorMessage && (
        <div className="mt-4 p-4 w-full bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <p className="text-red-400 text-sm font-medium text-center">{errorMessage}</p>
        </div>
      )}

      {transcript && !errorMessage && (
        <div className="mt-4 p-5 w-full bg-black/40 border border-white/5 rounded-lg text-gray-200 text-sm shadow-inner">
          <p className="text-green-400/80 mb-2 text-xs uppercase tracking-wider font-semibold">Success:</p>
          <p className="leading-relaxed italic">{transcript}</p>
        </div>
      )}
    </div>
  );
}