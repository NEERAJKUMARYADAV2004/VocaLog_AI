"use client";

import { useState } from "react";
import { deleteTranscript, updateTranscript } from "../actions/transcript-actions";

interface TranscriptProps {
    log: {
        id: string;
        content: string;
        createdAt: Date;
    };
}

export default function TranscriptCard({ log }: TranscriptProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(log.content);
    const [isPending, setIsPending] = useState(false);
    
    // 1. NEW STATE: Controls the visibility of the custom delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleSave = async () => {
        setIsPending(true);
        await updateTranscript(log.id, content);
        setIsEditing(false);
        setIsPending(false);
    };

    // 2. NEW FUNCTION: Actually executes the deletion
    const executeDelete = async () => {
        setIsPending(true);
        setShowDeleteModal(false); // Hide the modal immediately
        await deleteTranscript(log.id);
    };

    return (
        <>
            <div className="p-7 bg-[#141414] border border-white/5 rounded-2xl shadow-xl hover:bg-[#181818] hover:border-white/10 transition-all duration-500 group relative">
                
                {/* The Edit / Delete Controls */}
                <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-xs text-[#D4AF37] hover:text-white uppercase tracking-wider font-semibold transition-colors"
                        disabled={isPending}
                    >
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                    <button 
                        // 3. Trigger the custom modal instead of window.confirm
                        onClick={() => setShowDeleteModal(true)}
                        className="text-xs text-red-500/70 hover:text-red-500 uppercase tracking-wider font-semibold transition-colors"
                        disabled={isPending}
                    >
                        Delete
                    </button>
                </div>

                {/* The Content Area */}
                {isEditing ? (
                    <div className="mt-4">
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-[#E0E0E0] focus:outline-none focus:border-[#D4AF37] min-h-[100px]"
                        />
                        <button 
                            onClick={handleSave}
                            disabled={isPending}
                            className="mt-3 bg-[#D4AF37]/20 text-[#D4AF37] px-4 py-2 rounded-md text-sm font-bold tracking-widest hover:bg-[#D4AF37]/30 transition-all disabled:opacity-50"
                        >
                            {isPending ? "SAVING..." : "SAVE LOG"}
                        </button>
                    </div>
                ) : (
                    <p className="text-[#E0E0E0] leading-relaxed text-[17px] font-light tracking-wide mt-2 pr-16 whitespace-pre-wrap">
                        {log.content}
                    </p>
                )}
                
                {/* Elegant timestamp footer */}
                <div className="flex items-center gap-3 mt-5 opacity-40">
                    <div className="h-1 w-1 rounded-full bg-[#D4AF37]"></div>
                    <p className="text-[11px] text-gray-400 font-mono tracking-widest uppercase">
                        Logged: {new Date(log.createdAt).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* 4. THE CUSTOM DELETION MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] transform transition-all">
                        <h3 className="text-xl font-semibold text-white mb-2 tracking-wide">Delete Record?</h3>
                        <p className="text-white/60 text-sm mb-8 font-light leading-relaxed">
                            This action cannot be undone. The transcript will be permanently removed from the database.
                        </p>
                        
                        <div className="flex justify-end gap-4">
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                className="px-5 py-2.5 text-xs font-bold tracking-widest uppercase text-white/50 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={executeDelete}
                                className="px-5 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-red-500/20 transition-all"
                            >
                                Confirm Erase
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}